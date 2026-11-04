import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminSession, type AdminSession } from '@/lib/auth'
import { BackofficeUnavailableError } from '@/lib/db/backoffice'
import { logger } from '@/lib/logger'

type Handler = (session: AdminSession) => Promise<NextResponse>

/** Runs an admin-only handler with consistent auth + error responses. */
export async function adminRoute(handler: Handler): Promise<NextResponse> {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return await handler(session)
  } catch (err) {
    if (err instanceof BackofficeUnavailableError) {
      return NextResponse.json({ error: 'Database is not configured' }, { status: 503 })
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? 'Invalid input', code: 'validation' }, { status: 400 })
    }
    logger.error({ event: 'admin_route_failed', error_code: err instanceof Error ? err.message : 'unknown' })
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}

export const paymentMethodSchema = z.enum(['cash', 'mpesa', 'card', 'credit'])
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
