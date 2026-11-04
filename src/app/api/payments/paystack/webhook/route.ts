import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { logger } from '@/lib/logger'
import { completePaystackPayment } from '@/lib/payments/complete'

/**
 * Paystack server-to-server webhook. Configure this URL in the Paystack dashboard:
 *   https://www.organizer.co.ke/api/payments/paystack/webhook
 * Ensures orders get marked paid even if the customer closes the tab after paying.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const raw = await request.text()
  const signature = request.headers.get('x-paystack-signature') ?? ''
  const expected = createHmac('sha512', secret).update(raw).digest('hex')
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  try {
    const event = JSON.parse(raw) as { event?: string; data?: { reference?: string } }
    if (event.event === 'charge.success' && event.data?.reference) {
      await completePaystackPayment(event.data.reference)
    }
  } catch {
    logger.error({ event: 'paystack_webhook_failed', error_code: 'PROCESS_ERROR' })
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
  return NextResponse.json({ received: true })
}
