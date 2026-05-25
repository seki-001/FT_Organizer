import { NextRequest, NextResponse } from 'next/server'

// Track poll count per checkoutRequestId in-memory (dev only).
// In production this state lives in your database alongside the order.
const pollCounts = new Map<string, number>()

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const checkoutRequestId = searchParams.get('checkoutRequestId') ?? ''

  if (!checkoutRequestId) {
    return NextResponse.json(
      { status: 'failed', error: 'Missing checkoutRequestId' },
      { status: 400 }
    )
  }

  // ── TODO: Replace mock below with real Daraja query API ───────────────────
  //
  // REAL DARAJA QUERY PAYLOAD:
  // ───────────────────────────
  // const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
  // const password  = Buffer.from(
  //   process.env.DARAJA_SHORTCODE + process.env.DARAJA_PASSKEY + timestamp
  // ).toString('base64')
  //
  // const res = await fetch(
  //   'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query',
  //   {
  //     method:  'POST',
  //     headers: {
  //       Authorization:  `Bearer ${await getDarajaToken()}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       BusinessShortCode: process.env.DARAJA_SHORTCODE,
  //       Password:          password,
  //       Timestamp:         timestamp,
  //       CheckoutRequestID: checkoutRequestId,
  //     }),
  //   }
  // )
  // const data = await res.json()
  // // ResultCode 0 = success, 1032 = cancelled by user, others = pending/error
  // if (data.ResultCode === '0')    return NextResponse.json({ status: 'success' })
  // if (data.ResultCode === '1032') return NextResponse.json({ status: 'failed' })
  // return NextResponse.json({ status: 'pending' })
  // ──────────────────────────────────────────────────────────────────────────

  // Mock: return 'pending' for first 2 polls, then 'success'
  const count = (pollCounts.get(checkoutRequestId) ?? 0) + 1
  pollCounts.set(checkoutRequestId, count)

  // Clean up after success to avoid unbounded map growth
  if (count > 2) pollCounts.delete(checkoutRequestId)

  const status = count <= 2 ? 'pending' : 'success'
  console.log(`[M-Pesa status mock] ${checkoutRequestId} poll #${count} → ${status}`)

  return NextResponse.json({ status })
}
