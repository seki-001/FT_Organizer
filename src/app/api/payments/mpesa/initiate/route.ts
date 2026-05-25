import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const InitiateSchema = z.object({
  phone:    z.string().min(9, 'Phone number too short'),
  amount:   z.number().positive('Amount must be positive'),
  orderRef: z.string().min(1, 'Order reference required'),
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise Kenyan phone to the 2547XXXXXXXX format required by Daraja.
 * Accepts: 07XX, +2547XX, 2547XX
 */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('2547') && digits.length === 12) return digits
  if (digits.startsWith('07')   && digits.length === 10) return '254' + digits.slice(1)
  if (digits.startsWith('7')    && digits.length === 9)  return '254' + digits
  return null
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json() as unknown
    const parsed = InitiateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { phone, amount, orderRef } = parsed.data
    const normalisedPhone = normalisePhone(phone)

    if (!normalisedPhone) {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number. Use format 07XX XXX XXX.' },
        { status: 400 }
      )
    }

    // ── TODO: Replace mock below with real IntaSend / Daraja STK Push ──────────
    //
    // REAL DARAJA STK PUSH PAYLOAD (Safaricom Daraja API v1):
    // ─────────────────────────────────────────────────────────
    // const timestamp  = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
    // const password   = Buffer.from(
    //   process.env.DARAJA_SHORTCODE + process.env.DARAJA_PASSKEY + timestamp
    // ).toString('base64')
    //
    // const payload = {
    //   BusinessShortCode: process.env.DARAJA_SHORTCODE,  // e.g. "174379"
    //   Password:          password,
    //   Timestamp:         timestamp,
    //   TransactionType:   "CustomerPayBillOnline",
    //   Amount:            Math.round(amount),            // whole KSh only
    //   PartyA:            normalisedPhone,               // customer phone
    //   PartyB:            process.env.DARAJA_SHORTCODE,
    //   PhoneNumber:       normalisedPhone,
    //   CallBackURL:       `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/mpesa/callback`,
    //   AccountReference:  orderRef,
    //   TransactionDesc:   `Payment for ${orderRef} — Faith The Organizer`,
    // }
    //
    // Using IntaSend wrapper (simpler):
    // const intasend = new IntaSend(
    //   process.env.INTASEND_API_KEY,
    //   process.env.INTASEND_SECRET_KEY,
    //   process.env.INTASEND_IS_SANDBOX === 'true'
    // )
    // const response = await intasend.collection().mpesaStkPush({
    //   first_name:  'Customer',
    //   last_name:   '',
    //   email:       '',
    //   host:        process.env.NEXT_PUBLIC_APP_URL,
    //   amount:      Math.round(amount),
    //   phone_number: normalisedPhone,
    //   api_ref:     orderRef,
    // })
    // return NextResponse.json({ success: true, checkoutRequestId: response.id })
    // ──────────────────────────────────────────────────────────────────────────

    console.log('[M-Pesa initiate mock]', { phone: normalisedPhone, amount, orderRef })

    // Simulate the ~2 second network call to Daraja
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json(
      {
        success:           true,
        checkoutRequestId: `mock_${Date.now()}`,
        message:           'STK push sent (mock)',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[M-Pesa initiate error]', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initiate M-Pesa payment. Please try again.' },
      { status: 500 }
    )
  }
}
