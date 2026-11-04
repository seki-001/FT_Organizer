import { NextRequest } from 'next/server'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { isPaystackConfigured } from '@/lib/payments/config'
import { completePaystackPayment } from '@/lib/payments/complete'
import { allowMockData } from '@/lib/mock-guard'

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, 'paystack-verify', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  const reference = request.nextUrl.searchParams.get('reference') ?? ''
  if (!reference) {
    return apiError('Missing payment reference.', 'VALIDATION_ERROR', 400)
  }

  if (!isPaystackConfigured()) {
    if (!allowMockData()) {
      return apiError('Payment verification is unavailable.', 'PAYMENTS_UNAVAILABLE', 503)
    }
    return apiSuccess({ success: true, paid: true, reference })
  }

  try {
    const result = await completePaystackPayment(reference)
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
