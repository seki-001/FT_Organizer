import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logActivity } from '@/lib/activity-log'
import { getUserSession } from '@/lib/auth'
import { getClientIp } from '@/lib/rate-limit'

// Only these client-reported events are accepted; anything else could be used to forge audit entries.
const ALLOWED_ACTIONS = ['user.login', 'user.register', 'user.logout'] as const

const ClientActivitySchema = z.object({
  action: z.enum(ALLOWED_ACTIONS),
  description: z.string().min(1).max(500),
}).strict()

/** Allow authenticated storefront users to log non-sensitive actions (e.g. login). */
export async function POST(request: NextRequest) {
  const limited = await enforceRateLimit(request, 'activity-log', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body: unknown = await request.json()
    const parsed = ClientActivitySchema.safeParse(body)
    if (!parsed.success) {
      return apiError('Invalid activity data.', 'VALIDATION_ERROR', 400)
    }

    const session = await getUserSession()
    const ip = getClientIp(request)
    const userAgent = request.headers.get('user-agent')

    await logActivity({
      action: parsed.data.action,
      description: parsed.data.description,
      userId: session?.user.id ?? null,
      actorEmail: session?.user.email ?? null,
      actorName: session?.profile?.full_name ?? (session?.user.user_metadata?.full_name as string | undefined) ?? null,
      resourceType: 'user',
      resourceId: session?.user.id ?? null,
      ipAddress: ip,
      userAgent,
      source: 'storefront',
    })

    return apiSuccess({ logged: true }, 201)
  } catch {
    return apiError('Could not record activity.', 'INTERNAL_ERROR', 500)
  }
}
