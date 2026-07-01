import { NextRequest, NextResponse } from 'next/server'
import { BookingFormSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { insertBooking } from '@/lib/db/bookings'
import { logger } from '@/lib/logger'
import { logActivity } from '@/lib/activity-log'

function generateReference(): string {
  return Math.random().toString(36).toUpperCase().slice(2, 8)
}

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'bookings', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body: unknown = await request.json()
    const parsed = BookingFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid booking data.', code: 'VALIDATION_ERROR', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const booking = parsed.data
    const reference = generateReference()

    await insertBooking(booking, reference)

    const ip = getClientIp(request)
    await logActivity({
      action: 'booking.created',
      description: `${booking.name} requested a quote for ${booking.service}`,
      actorEmail: booking.email,
      actorName: booking.name,
      resourceType: 'booking',
      resourceId: reference,
      metadata: { service: booking.service },
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
      source: 'storefront',
    })

    logger.info({
      event: 'booking_created',
      resource_id: reference,
      action: 'new',
      ip_address: ip,
      service: booking.service,
    })

    const rate = checkRateLimit(`bookings:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true, reference, status: 'new', createdAt: new Date().toISOString() }, 201),
      rate.remaining,
      rate.resetAt,
    )
  } catch {
    logger.error({ event: 'booking_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Something went wrong. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
