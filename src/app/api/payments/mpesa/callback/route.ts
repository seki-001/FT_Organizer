import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { enforceRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'mpesa-callback', { limit: 30, windowMs: 60_000 })
  if (limited) return limited

  try {
    const body = await request.json() as { Body?: { stkCallback?: { CheckoutRequestID?: string; ResultCode?: number } } }
    logger.info({
      event: 'mpesa_callback_received',
      resource_id: body?.Body?.stkCallback?.CheckoutRequestID,
      result_code: body?.Body?.stkCallback?.ResultCode,
    })
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    logger.error({ event: 'mpesa_callback_failed', error_code: 'PARSE_ERROR' })
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
