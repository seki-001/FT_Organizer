import { NextRequest, NextResponse } from 'next/server'
import { BookingFormSchema } from '@/lib/validations'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

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
    const status = 'new' as const
    const createdAt = new Date().toISOString()

    logger.info({
      event: 'booking_created',
      resource_id: reference,
      action: status,
      ip_address: getClientIp(request),
      service: booking.service,
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`bookings:${ip}`, { limit: 5, windowMs: 60_000 })
    return withRateLimitHeaders(
      apiSuccess({ success: true, reference, status, createdAt }, 201),
      rate.remaining,
      rate.resetAt,
    )
  } catch {
    logger.error({ event: 'booking_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Something went wrong. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
