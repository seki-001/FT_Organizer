import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { humanizeAuthError } from '@/lib/auth-errors'

export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login', request.url)
  const next = request.nextUrl.searchParams.get('next') ?? '/account'

  if (!isSupabaseConfigured()) {
    loginUrl.searchParams.set('error', 'supabase_not_configured')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = await createClient()
    const origin = request.nextUrl.origin

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })

    if (error || !data.url) {
      loginUrl.searchParams.set('error', humanizeAuthError(error?.message ?? 'Could not start Google sign-in.'))
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.redirect(data.url)
  } catch {
    loginUrl.searchParams.set('error', 'Could not start Google sign-in. Please try again.')
    return NextResponse.redirect(loginUrl)
  }
}
