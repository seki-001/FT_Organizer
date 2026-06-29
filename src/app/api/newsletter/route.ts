import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'newsletter', { limit: 3, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as unknown
    const parsed = SubscribeSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Please provide a valid email address.', 'VALIDATION_ERROR', 400)
    }

    logger.info({
      event: 'newsletter_subscribed',
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`newsletter:${ip}`, { limit: 3, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true, message: "You're in! Check your inbox." }, 201),
      rate.remaining,
      rate.resetAt,
    )
  } catch {
    logger.error({ event: 'newsletter_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Something went wrong. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
