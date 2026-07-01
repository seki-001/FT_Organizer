import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { logger } from '@/lib/logger'
import type { Json } from '@/types/database'
import type { AdminSession } from '@/lib/auth'

export type ActivitySource = 'storefront' | 'admin' | 'system'

function getRequestIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/** Log an admin action with session actor + request context. */
export async function logAdminActivity(
  session: AdminSession,
  request: Request,
  input: Omit<LogActivityInput, 'actorEmail' | 'actorName' | 'ipAddress' | 'userAgent' | 'source'>,
): Promise<void> {
  await logActivity({
    ...input,
    actorEmail: session.user.email,
    actorName: session.user.name,
    ipAddress: getRequestIp(request),
    userAgent: request.headers.get('user-agent'),
    source: 'admin',
  })
}

/** Log a storefront/system action with request context. */
export async function logStorefrontActivity(
  request: Request,
  input: Omit<LogActivityInput, 'ipAddress' | 'userAgent' | 'source'> & { source?: ActivitySource },
): Promise<void> {
  const { source = 'storefront', ...rest } = input
  await logActivity({
    ...rest,
    ipAddress: getRequestIp(request),
    userAgent: request.headers.get('user-agent'),
    source,
  })
}

export interface LogActivityInput {
  action: string
  description: string
  userId?: string | null
  actorEmail?: string | null
  actorName?: string | null
  resourceType?: string | null
  resourceId?: string | null
  metadata?: Record<string, unknown>
  ipAddress?: string | null
  userAgent?: string | null
  source?: ActivitySource
}

export interface ActivityLogRow {
  id: string
  user_id: string | null
  actor_email: string | null
  actor_name: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  description: string
  metadata: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  source: ActivitySource
  created_at: string
}

/** Persist an activity log entry. Fails silently when Supabase admin is not configured. */
export async function logActivity(input: LogActivityInput): Promise<void> {
  const payload = {
    event: 'activity_logged',
    action: input.action,
    user_id: input.userId ?? undefined,
    resource_id: input.resourceId ?? undefined,
    source: input.source ?? 'storefront',
  }

  if (!isSupabaseAdminConfigured()) {
    logger.info(payload)
    return
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('activity_logs').insert({
      user_id: input.userId ?? null,
      actor_email: input.actorEmail ?? null,
      actor_name: input.actorName ?? null,
      action: input.action,
      resource_type: input.resourceType ?? null,
      resource_id: input.resourceId ?? null,
      description: input.description,
      metadata: (input.metadata ?? {}) as Json,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      source: input.source ?? 'storefront',
    })

    if (error) {
      logger.error({ ...payload, error_code: error.code, message: error.message })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN'
    logger.error({ ...payload, error_code: 'ACTIVITY_LOG_FAILED', message })
  }
}

export async function listActivityLogs(options?: {
  limit?: number
  offset?: number
  source?: ActivitySource | 'all'
}): Promise<ActivityLogRow[]> {
  if (!isSupabaseAdminConfigured()) return []

  const limit = options?.limit ?? 50
  const offset = options?.offset ?? 0

  try {
    const supabase = createAdminClient()
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (options?.source && options.source !== 'all') {
      query = query.eq('source', options.source)
    }

    const { data, error } = await query
    if (error) {
      logger.error({ event: 'activity_logs_fetch_failed', error_code: error.code })
      return []
    }

    return (data ?? []) as ActivityLogRow[]
  } catch {
    return []
  }
}
