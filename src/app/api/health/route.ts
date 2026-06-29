import { NextResponse } from 'next/server'
import { isMpesaConfigured, isPaystackConfigured, getSiteUrl } from '@/lib/payments/config'
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env'

export async function GET() {
  const checks = {
    app: true,
    supabase: isSupabaseConfigured(),
    supabaseAdmin: isSupabaseAdminConfigured(),
    mpesa: isMpesaConfigured(),
    paystack: isPaystackConfigured(),
    siteUrl: getSiteUrl(),
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
  }

  const healthy = checks.app && checks.supabase && checks.supabaseAdmin

  return NextResponse.json(
    { status: healthy ? 'ok' : 'degraded', ...checks },
    { status: healthy ? 200 : 503 },
  )
}
