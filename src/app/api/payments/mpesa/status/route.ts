import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { enforceRateLimit } from '@/lib/rate-limit'
import {
  getPaymentEventByExternalId,
  updatePaymentEventStatus,
} from '@/lib/db/payments'
import { queryStkPushStatus } from '@/lib/payments/mpesa'
import { isMpesaConfigured } from '@/lib/payments/config'
import { updateOrderPaymentStatus } from '@/lib/db/orders'

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-status', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const checkoutRequestId = request.nextUrl.searchParams.get('checkoutRequestId') ?? ''

  if (!checkoutRequestId) {
    return NextResponse.json(
      { error: 'Missing checkoutRequestId', code: 'VALIDATION_ERROR' },
      { status: 400 },
    )
  }

  const stored = await getPaymentEventByExternalId(checkoutRequestId)

  if (checkoutRequestId.startsWith('mock_') && !isMpesaConfigured()) {
    const mockPoll = Number(request.nextUrl.searchParams.get('poll') ?? '0')
    const status = mockPoll < 2 ? 'pending' : 'success'
    if (status === 'success' && stored?.order_reference) {
      await updateOrderPaymentStatus(stored.order_reference, 'paid')
    }
    return NextResponse.json({ status })
  }

  if (stored?.verified && stored.status === 'paid') {
    return NextResponse.json({ status: 'success' })
  }
  if (stored?.status === 'failed') {
    return NextResponse.json({ status: 'failed' })
  }

  if (!isMpesaConfigured()) {
    return NextResponse.json({ status: 'pending' })
  }

  try {
    const status = await queryStkPushStatus(checkoutRequestId)
    if (status === 'success') {
      await updatePaymentEventStatus(checkoutRequestId, 'paid', true)
      if (stored?.order_reference) {
        await updateOrderPaymentStatus(stored.order_reference, 'paid')
      }
    }
    logger.info({
      event: 'mpesa_status_polled',
      resource_id: checkoutRequestId,
      action: status,
    })
    return NextResponse.json({ status })
  } catch {
    return NextResponse.json({ status: 'pending' })
  }
}
