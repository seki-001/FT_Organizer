import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const InitiateSchema = z.object({
  amount:   z.number().positive(),
  orderRef: z.string().min(1),
})

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json() as unknown
    const parsed = InitiateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const { amount, orderRef } = parsed.data

    // ── TODO: Replace mock with real Flutterwave hosted payment link ──────────
    //
    // const res = await fetch('https://api.flutterwave.com/v3/payments', {
    //   method:  'POST',
    //   headers: {
    //     Authorization:  `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     tx_ref:       orderRef,
    //     amount:       amount,
    //     currency:     'KES',
    //     redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-confirmation?ref=${orderRef}`,
    //     customer: { email, name, phone },
    //     customizations: {
    //       title:       'Faith The Organizer',
    //       description: `Payment for order ${orderRef}`,
    //       logo:        `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    //     },
    //   }),
    // })
    // const data = await res.json()
    // return NextResponse.json({ redirectUrl: data.data.link })
    // ──────────────────────────────────────────────────────────────────────────

    console.log('[Flutterwave initiate mock]', { amount, orderRef })

    // Mock: redirect back to confirmation directly in dev
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    return NextResponse.json({
      success:     true,
      redirectUrl: `${appUrl}/order-confirmation?ref=${orderRef}`,
    })
  } catch (error) {
    console.error('[Flutterwave initiate error]', error)
    return NextResponse.json({ success: false, error: 'Payment initiation failed' }, { status: 500 })
  }
}
