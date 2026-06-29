import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    status: 'ok' as const,
    app: true,
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    environment: process.env.NODE_ENV ?? 'development',
  }

  return NextResponse.json(checks, { status: 200 })
}
