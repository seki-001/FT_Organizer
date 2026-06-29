import { NextRequest, NextResponse } from 'next/server'

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

export function enforceRateLimit(
  request: NextRequest,
  namespace: string,
  options: RateLimitOptions,
): NextResponse | null {
  const ip = getClientIp(request)
  const result = checkRateLimit(`${namespace}:${ip}`, options)
  if (!result.allowed) return rateLimitResponse(result.resetAt)
  return null
}
