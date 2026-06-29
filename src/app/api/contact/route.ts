import { NextRequest, NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { insertContactSubmission } from '@/lib/db/contact'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'contact', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as unknown
    const parsed = ContactFormSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid form data. Please check all fields.', 'VALIDATION_ERROR', 400)
    }

    await insertContactSubmission(parsed.data)

    logger.info({
      event: 'contact_submitted',
      resource_id: parsed.data.subject,
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true }, 201),
      rate.remaining,
      rate.resetAt,
    )
  } catch {
    logger.error({ event: 'contact_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Server error. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
