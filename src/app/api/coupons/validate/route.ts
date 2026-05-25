import { NextResponse } from 'next/server'
import { MOCK_COUPONS } from '@/lib/mock-admin-coupons'

interface ValidateBody {
  code:       string
  orderTotal: number
}

interface ValidateResponse {
  valid:         boolean
  discountType?: 'percentage' | 'fixed'
  discountValue?: number
  message:       string
}

/**
 * POST /api/coupons/validate
 * Public route — used at checkout to validate a promo code.
 *
 * Body:  { code: string, orderTotal: number }
 * Returns: { valid, discountType, discountValue, message }
 *
 * TODO: Look up coupon from DB instead of mock data.
 */
export async function POST(request: Request): Promise<NextResponse<ValidateResponse>> {
  let body: Partial<ValidateBody>
  try {
    body = await request.json() as Partial<ValidateBody>
  } catch {
    return NextResponse.json({ valid: false, message: 'Invalid request body' }, { status: 400 })
  }

  const code       = (body.code ?? '').toUpperCase().trim()
  const orderTotal = body.orderTotal ?? 0

  if (!code) {
    return NextResponse.json({ valid: false, message: 'Please enter a coupon code.' })
  }

  const coupon = MOCK_COUPONS.find(c => c.code === code)

  if (!coupon) {
    return NextResponse.json({ valid: false, message: `"${code}" is not a valid coupon code.` })
  }

  if (!coupon.active) {
    return NextResponse.json({ valid: false, message: 'This coupon is no longer active.' })
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ valid: false, message: 'This coupon has expired.' })
  }

  if (coupon.usageLimit !== null && coupon.uses >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit.' })
  }

  if (orderTotal < coupon.minOrder) {
    return NextResponse.json({
      valid:   false,
      message: `This coupon requires a minimum order of KSh ${coupon.minOrder.toLocaleString('en-KE')}.`,
    })
  }

  const discountAmount = coupon.type === 'percentage'
    ? Math.round(orderTotal * coupon.value / 100)
    : coupon.value

  const label = coupon.type === 'percentage'
    ? `${coupon.value}% off`
    : `KSh ${coupon.value.toLocaleString('en-KE')} off`

  return NextResponse.json({
    valid:         true,
    discountType:  coupon.type,
    discountValue: discountAmount,
    message:       `${label} applied! You save KSh ${discountAmount.toLocaleString('en-KE')}.`,
  })
}
