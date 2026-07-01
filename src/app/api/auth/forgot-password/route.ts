import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { logStorefrontActivity } from '@/lib/activity-log'

const ForgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'auth-forgot-password', { limit: 5, windowMs: 60_000 })
  if (limited) return limited

  if (!isSupabaseConfigured()) {
    return apiError('Authentication is not configured.', 'SERVICE_UNAVAILABLE', 503)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid request body', 'VALIDATION_ERROR', 400)
  }

  const parsed = ForgotPasswordSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Enter a valid email address.', 'VALIDATION_ERROR', 400)
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin
  const redirectTo = `${origin}/auth/callback?next=/reset-password`

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo })

    if (error) {
      logger.warn({ event: 'forgot_password_failed', error_code: error.code })
    }

    await logStorefrontActivity(request, {
      action: 'password.reset_requested',
      description: `Password reset requested for ${parsed.data.email}`,
      actorEmail: parsed.data.email,
      resourceType: 'auth',
    })

    // Always return success — do not reveal whether the email exists.
    return apiSuccess({ success: true })
  } catch {
    logger.error({ event: 'forgot_password_error', error_code: 'INTERNAL_ERROR' })
    return apiError('Could not send reset email. Please try again.', 'INTERNAL_ERROR', 500)
  }
}
