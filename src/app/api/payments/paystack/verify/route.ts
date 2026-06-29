import { NextRequest } from 'next/server'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { insertPaymentEvent, updatePaymentEventStatus, getPaymentEventByExternalId } from '@/lib/db/payments'
import { verifyPaystackTransaction } from '@/lib/payments/paystack'
import { isPaystackConfigured } from '@/lib/payments/config'
import { updateOrderPaymentStatus } from '@/lib/db/orders'

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, 'paystack-verify', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  const reference = request.nextUrl.searchParams.get('reference') ?? ''
  if (!reference) {
    return apiError('Missing payment reference.', 'VALIDATION_ERROR', 400)
  }

  if (!isPaystackConfigured()) {
    return apiSuccess({ success: true, paid: true, reference })
  }

  try {
    const result = await verifyPaystackTransaction(reference)

    await insertPaymentEvent({
      provider: 'paystack',
      eventType: result.paid ? 'payment_verified' : 'payment_failed',
      externalId: reference,
      amount: Math.round(result.amount),
      status: result.paid ? 'paid' : 'failed',
      verified: result.paid,
      payload: { currency: result.currency },
    })

    if (result.paid) {
      await updatePaymentEventStatus(reference, 'paid', true)
      const existing = await getPaymentEventByExternalId(reference)
      if (existing?.order_reference) {
        await updateOrderPaymentStatus(existing.order_reference, 'paid')
      }
    }

    logger.info({
      event: 'paystack_verified',
      resource_id: reference,
      action: result.paid ? 'paid' : 'failed',
    })

    return apiSuccess({
      success: true,
      paid: result.paid,
      reference,
      amount: result.amount,
      currency: result.currency,
    })
  } catch (err) {
    logger.error({ event: 'paystack_verify_failed', error_code: 'VERIFY_ERROR' })
    const message = err instanceof Error ? err.message : 'Verification failed'
    return apiError(message, 'VERIFY_ERROR', 500)
  }
}
