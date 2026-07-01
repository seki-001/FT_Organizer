import type { NextRequest } from 'next/server'

/**
 * Canonical site URL for emails, payment callbacks, and metadata.
 * On Vercel preview deployments, always uses the current deployment URL —
 * never NEXT_PUBLIC_SITE_URL (which may point at production/staging).
 */
export function getSiteUrl(): string {
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }

  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL

  if (explicit) return explicit.replace(/\/$/, '')

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

/** Origin for the incoming HTTP request (preview, staging, prod, or local). */
export function getRequestOrigin(request: Request | NextRequest): string {
  try {
    const origin = new URL(request.url).origin
    if (origin && origin !== 'null') return origin
  } catch {
    // fall through to forwarded headers
  }

  const host =
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host')

  if (host) {
    const proto =
      request.headers.get('x-forwarded-proto') ??
      (host.includes('localhost') ? 'http' : 'https')
    return `${proto}://${host}`
  }

  return getSiteUrl()
}

/** Safe internal path for post-auth redirects (blocks open redirects). */
export function safeAuthNextPath(next: string | null, fallback = '/account'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback
  return next
}

export function getAuthCallbackUrl(origin: string, nextPath = '/account'): string {
  const safeNext = safeAuthNextPath(nextPath)
  return `${origin}/auth/callback?next=${encodeURIComponent(safeNext)}`
}
