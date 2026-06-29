import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { enforceRateLimit } from '@/lib/rate-limit'

const pollCounts = new Map<string, number>()

export async function GET(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-status', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const { searchParams } = request.nextUrl
  const checkoutRequestId = searchParams.get('checkoutRequestId') ?? ''

  if (!checkoutRequestId) {
    return NextResponse.json(
      { error: 'Missing checkoutRequestId', code: 'VALIDATION_ERROR' },
      { status: 400 },
    )
  }

  const count = (pollCounts.get(checkoutRequestId) ?? 0) + 1
  pollCounts.set(checkoutRequestId, count)
  if (count > 2) pollCounts.delete(checkoutRequestId)

  const status = count <= 2 ? 'pending' : 'success'
  logger.info({
    event: 'mpesa_status_polled',
    resource_id: checkoutRequestId,
    action: status,
  })

  return NextResponse.json({ status })
}
