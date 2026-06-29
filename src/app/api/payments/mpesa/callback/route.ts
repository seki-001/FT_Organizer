import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { enforceRateLimit } from '@/lib/rate-limit'
import {
  getPaymentEventByExternalId,
  insertPaymentEvent,
  updatePaymentEventStatus,
} from '@/lib/db/payments'
import { updateOrderPaymentStatus } from '@/lib/db/orders'
import type { Json } from '@/types/database'

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-callback', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as {
      Body?: {
        stkCallback?: {
          CheckoutRequestID?: string
          ResultCode?: number
          ResultDesc?: string
        }
      }
    }

    const callback = body?.Body?.stkCallback
    const checkoutRequestId = callback?.CheckoutRequestID ?? ''
    const success = callback?.ResultCode === 0

    logger.info({
      event: 'mpesa_callback_received',
      resource_id: checkoutRequestId,
      result_code: callback?.ResultCode,
    })

    const existing = checkoutRequestId
      ? await getPaymentEventByExternalId(checkoutRequestId)
      : null

    await insertPaymentEvent({
      orderReference: existing?.order_reference ?? null,
      provider: 'mpesa',
      eventType: success ? 'stk_callback_success' : 'stk_callback',
      externalId: checkoutRequestId || null,
      status: success ? 'paid' : String(callback?.ResultCode ?? 'unknown'),
      payload: body as Json,
      verified: success,
    })

    if (checkoutRequestId) {
      await updatePaymentEventStatus(checkoutRequestId, success ? 'paid' : 'failed', success)
    }

    if (success && existing?.order_reference) {
      await updateOrderPaymentStatus(existing.order_reference, 'paid')
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    logger.error({ event: 'mpesa_callback_failed', error_code: 'PARSE_ERROR' })
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
