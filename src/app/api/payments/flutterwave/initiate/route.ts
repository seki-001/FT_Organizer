import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const InitiateSchema = z.object({
  amount:   z.number().positive(),
  orderRef: z.string().min(1),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'flutterwave-initiate', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as unknown
    const parsed = InitiateSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid payment request.', 'VALIDATION_ERROR', 400)
    }

    const { amount, orderRef } = parsed.data

    logger.info({
      event: 'flutterwave_initiated',
      resource_id: orderRef,
      ip_address: getClientIp(request),
    })

    const appUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const ip = getClientIp(request)
    const rate = checkRateLimit(`flutterwave-initiate:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({
        success: true,
        redirectUrl: `${appUrl}/order-confirmation?ref=${orderRef}`,
      }),
      rate.remaining,
      rate.resetAt,
    )
  } catch {
    logger.error({ event: 'flutterwave_initiate_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Payment initiation failed', 'INTERNAL_ERROR', 500)
  }
}
