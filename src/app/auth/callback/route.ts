import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logActivity } from '@/lib/activity-log'
import { getRequestOrigin, safeAuthNextPath } from '@/lib/site-url'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeAuthNextPath(searchParams.get('next'))
  const origin = getRequestOrigin(request)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      await logActivity({
        action: 'user.oauth_login',
        description: `${data.user.email ?? 'User'} signed in via OAuth`,
        userId: data.user.id,
        actorEmail: data.user.email,
        actorName: data.user.user_metadata?.full_name as string | undefined,
        source: 'storefront',
      })
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
