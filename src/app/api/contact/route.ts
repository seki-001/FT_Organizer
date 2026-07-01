import { NextRequest, NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { insertContactSubmission } from '@/lib/db/contact'
import { logger } from '@/lib/logger'
import { logActivity } from '@/lib/activity-log'

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

    const ip = getClientIp(request)
    await logActivity({
      action: 'contact.submitted',
      description: `${parsed.data.name} submitted a contact form: ${parsed.data.subject}`,
      actorEmail: parsed.data.email,
      actorName: parsed.data.name,
      resourceType: 'contact',
      metadata: { subject: parsed.data.subject },
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
      source: 'storefront',
    })

    logger.info({
      event: 'contact_submitted',
      resource_id: parsed.data.subject,
      ip_address: ip,
    })

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
