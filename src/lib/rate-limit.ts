import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitOptions {
  limit: number
  windowMs: number
}

const store = new Map<string, RateLimitEntry>()

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

function pruneExpired(now: number) {
  if (store.size < 500) return
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) store.delete(key)
  })
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  pruneExpired(now)

  const existing = store.get(key)
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: limit - 1, resetAt }
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000))
  return NextResponse.json(
    { error: 'Too many requests. Please try again shortly.', code: 'RATE_LIMITED' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0',
      },
    },
  )
}

export function withRateLimitHeaders(
  response: NextResponse,
  remaining: number,
  resetAt: number,
): NextResponse {
  response.headers.set('X-RateLimit-Remaining', String(Math.max(0, remaining)))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)))
  return response
}

/**
 * Rate limit by client IP. Uses a shared Postgres counter so limits hold across serverless instances;
 * falls back to the in-memory counter if the database is unavailable (fails open, never blocks customers).
 */
export async function enforceRateLimit(
  request: NextRequest,
  namespace: string,
  options: RateLimitOptions,
): Promise<NextResponse | null> {
  const key = `${namespace}:${getClientIp(request)}`

  if (isSupabaseAdminConfigured()) {
    try {
      const { data, error } = await createAdminClient().rpc('rate_limit_hit', {
        p_key: key,
        p_limit: options.limit,
        p_window_seconds: Math.ceil(options.windowMs / 1000),
      })
      const row = data?.[0]
      if (!error && row) {
        return row.allowed ? null : rateLimitResponse(new Date(row.reset_at).getTime())
      }
    } catch {
      // fall through to the in-memory limiter
    }
  }

  const result = checkRateLimit(key, options)
  return result.allowed ? null : rateLimitResponse(result.resetAt)
}
