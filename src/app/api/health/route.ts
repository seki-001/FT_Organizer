import { NextResponse } from 'next/server'
import { isMpesaConfigured, isPaystackConfigured, getSiteUrl } from '@/lib/payments/config'
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env'

export const dynamic = 'force-dynamic'

export async function GET() {
  const healthy = isSupabaseConfigured() && isSupabaseAdminConfigured()
  const status = healthy ? 'ok' : 'degraded'
  const code = healthy ? 200 : 503

  // Public endpoint: in production expose only the overall status, never which integrations are configured.
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ status }, { status: code })
  }

  return NextResponse.json({
    status,
    app: true,
    supabase: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    mpesa: isMpesaConfigured(),
    paystack: isPaystackConfigured(),
    siteUrl: getSiteUrl(),
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
  }, { status: code })
}
