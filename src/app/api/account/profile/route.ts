import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getUserSession } from '@/lib/auth'
import { getProfile, updateProfile } from '@/lib/db/profiles'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const ProfileUpdateSchema = z.object({
  name:    z.string().min(2),
  phone:   z.string().optional(),
  address: z.string().optional(),
  city:    z.string().optional(),
})

export async function GET() {
  const session = await getUserSession()
  if (!session?.user) {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  const profile = await getProfile(session.user.id)
  return apiSuccess({
    name: profile?.full_name ?? '',
    email: session.user.email ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
    city: profile?.city ?? '',
  })
}

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'profile', { limit: 10, windowMs: 60_000 })
  if (limited) return limited

  const session = await getUserSession()
  if (!session?.user) {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  try {
    const body = await request.json() as unknown
    const parsed = ProfileUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return apiError('Invalid data.', 'VALIDATION_ERROR', 400)
    }

    await updateProfile(session.user.id, {
      name: parsed.data.name,
      phone: parsed.data.phone,
      address: parsed.data.address,
      city: parsed.data.city,
    })

    logger.info({ event: 'profile_updated', user_id: session.user.id })

    return apiSuccess({ success: true })
  } catch {
    logger.error({ event: 'profile_update_failed', error_code: 'INTERNAL_ERROR' })
    return apiError('Server error.', 'INTERNAL_ERROR', 500)
  }
}
