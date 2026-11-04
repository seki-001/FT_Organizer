import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { enforceRateLimit } from '@/lib/rate-limit'
import {
  getInitiationEvent,
  insertPaymentEvent,
  updatePaymentEventStatus,
} from '@/lib/db/payments'
import { updateOrderPaymentStatus } from '@/lib/db/orders'
import { queryStkPushStatus } from '@/lib/payments/mpesa'
import { isMpesaConfigured } from '@/lib/payments/config'
import type { Json } from '@/types/database'

interface StkCallbackBody {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string
      ResultCode?: number
      ResultDesc?: string
      CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] }
    }
  }
}

/**
 * Safaricom STK callback. Daraja callbacks are unsigned, so a "success" is never trusted on its
 * own: it must match a payment we initiated, carry the amount we asked for, and be confirmed
 * by a direct Daraja status query before the order is marked paid.
 */
export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-callback', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as StkCallbackBody
    const callback = body?.Body?.stkCallback
    const checkoutRequestId = callback?.CheckoutRequestID ?? ''
    const claimedSuccess = callback?.ResultCode === 0

    logger.info({ event: 'mpesa_callback_received', resource_id: checkoutRequestId, result_code: callback?.ResultCode })

    // Only act on payments we started.
    const initiation = checkoutRequestId ? await getInitiationEvent(checkoutRequestId) : null
    if (!initiation) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const paidAmount = Number(callback?.CallbackMetadata?.Item?.find((i) => i.Name === 'Amount')?.Value ?? 0)
    const expected = Number(initiation.amount ?? 0)
    let confirmed = claimedSuccess && expected > 0 && paidAmount + 0.5 >= expected
    if (confirmed && isMpesaConfigured()) {
      confirmed = (await queryStkPushStatus(checkoutRequestId)) === 'success'
    }

    await insertPaymentEvent({
      orderReference: initiation.order_reference,
      provider: 'mpesa',
      eventType: confirmed ? 'stk_callback_success' : 'stk_callback',
      externalId: checkoutRequestId,
      amount: paidAmount || null,
      status: confirmed ? 'paid' : claimedSuccess ? 'unverified' : String(callback?.ResultCode ?? 'unknown'),
      payload: body as Json,
      verified: confirmed,
    })

    if (initiation.status !== 'paid') {
      await updatePaymentEventStatus(checkoutRequestId, confirmed ? 'paid' : 'failed', confirmed)
      if (confirmed && initiation.order_reference) {
        await updateOrderPaymentStatus(initiation.order_reference, 'paid')
      }
    }
    if (claimedSuccess && !confirmed) {
      logger.error({ event: 'mpesa_callback_unconfirmed', resource_id: checkoutRequestId })
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    logger.error({ event: 'mpesa_callback_failed', error_code: 'PARSE_ERROR' })
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}
