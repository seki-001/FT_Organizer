import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { logActivity } from '@/lib/activity-log'
import { getUserSession } from '@/lib/auth'
import { getClientIp } from '@/lib/rate-limit'

const ClientActivitySchema = z.object({
  action: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  resourceType: z.string().max(50).optional(),
  resourceId: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
}).strict()

/** Allow authenticated storefront users to log non-sensitive actions (e.g. login). */
export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'activity-log', { limit: 30, windowMs: 60_000 })
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
      resourceType: parsed.data.resourceType ?? null,
      resourceId: parsed.data.resourceId ?? null,
      metadata: parsed.data.metadata,
      ipAddress: ip,
      userAgent,
      source: 'storefront',
    })

    return apiSuccess({ logged: true }, 201)
  } catch {
    return apiError('Could not record activity.', 'INTERNAL_ERROR', 500)
  }
}
