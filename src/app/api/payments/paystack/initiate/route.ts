import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { insertPaymentEvent } from '@/lib/db/payments'
import { initializePaystackTransaction } from '@/lib/payments/paystack'
import { isPaystackConfigured } from '@/lib/payments/config'

const InitiateSchema = z.object({
  amount:   z.number().positive(),
  orderRef: z.string().min(1),
  email:    z.string().email(),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'paystack-initiate', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as unknown
    const parsed = InitiateSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid payment request.', 'VALIDATION_ERROR', 400)
    }

    const { amount, orderRef, email } = parsed.data

    if (!isPaystackConfigured()) {
      const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
      return apiSuccess({
        success: true,
        redirectUrl: `${appUrl}/order-confirmation?ref=${orderRef}`,
        message: 'Paystack not configured — mock redirect',
      })
    }

    const reference = `FTO-${orderRef}-${Date.now()}`
    const { authorizationUrl } = await initializePaystackTransaction({
      email,
      amount: Math.round(amount),
      reference,
      metadata: { order_ref: orderRef },
    })

    await insertPaymentEvent({
      orderReference: orderRef,
      provider: 'paystack',
      eventType: 'payment_initiated',
      externalId: reference,
      amount: Math.round(amount),
      status: 'pending',
      payload: { email },
    })

    logger.info({
      event: 'paystack_initiated',
      resource_id: orderRef,
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`paystack-initiate:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true, redirectUrl: authorizationUrl, reference }),
      rate.remaining,
      rate.resetAt,
    )
  } catch (err) {
    logger.error({ event: 'paystack_initiate_failed', error_code: 'INTERNAL_ERROR' })
    const message = err instanceof Error ? err.message : 'Payment initiation failed'
    return apiError(message, 'INTERNAL_ERROR', 500)
  }
}
