import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit, withRateLimitHeaders, checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const ProfileUpdateSchema = z.object({
  name:    z.string().min(2),
  phone:   z.string().optional(),
  address: z.string().optional(),
  city:    z.string().optional(),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'profile', { limit: 10, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as unknown
    const parsed = ProfileUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid data.', 'VALIDATION_ERROR', 400)
    }

    logger.info({
      event: 'profile_updated',
      ip_address: getClientIp(request),
    })

    const ip = getClientIp(request)
    const rate = checkRateLimit(`profile:${ip}`, { limit: 10, windowMs: 60_000 })
    return withRateLimitHeaders(apiSuccess({ success: true }), rate.remaining, rate.resetAt)
  } catch {
    logger.error({ event: 'profile_update_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Server error.', 'INTERNAL_ERROR', 500)
  }
}
