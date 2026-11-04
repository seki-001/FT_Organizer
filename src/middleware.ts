import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/** Server-to-server webhooks have no browser Origin and are authenticated by other means. */
const CSRF_EXEMPT = ['/api/payments/mpesa/callback', '/api/payments/paystack/webhook']
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true // non-browser clients (curl, server calls) carry no cookies to abuse
  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // CSRF defence in depth on top of SameSite cookies: browsers must call our APIs from our own origin.
  if (
    pathname.startsWith('/api/') &&
    MUTATING.has(request.method) &&
    !CSRF_EXEMPT.includes(pathname) &&
    !isSameOrigin(request)
  ) {
    return NextResponse.json({ error: 'Cross-origin request blocked' }, { status: 403 })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const scopedRequest = new NextRequest(request.url, {
    headers: requestHeaders,
  })

  return updateSession(scopedRequest)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
