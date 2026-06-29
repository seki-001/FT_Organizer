import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError } from '@/lib/api-response'
import { enforceRateLimit } from '@/lib/rate-limit'
import { findCouponByCode } from '@/lib/db/coupons'

const ValidateSchema = z.object({
  code: z.string().min(1),
  orderTotal: z.number().nonnegative(),
})

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, 'coupons-validate', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid request body', 'VALIDATION_ERROR', 400)
  }

  const parsed = ValidateSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Please enter a coupon code.', 'VALIDATION_ERROR', 400)
  }

  const code = parsed.data.code.toUpperCase().trim()
  const orderTotal = parsed.data.orderTotal
  const coupon = await findCouponByCode(code)

  if (!coupon) {
    return Response.json({ valid: false, message: `"${code}" is not a valid coupon code.` })
  }

  if (!coupon.active) {
    return Response.json({ valid: false, message: 'This coupon is no longer active.' })
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return Response.json({ valid: false, message: 'This coupon has expired.' })
  }

  if (coupon.usageLimit !== null && coupon.uses >= coupon.usageLimit) {
    return Response.json({ valid: false, message: 'This coupon has reached its usage limit.' })
  }

  if (orderTotal < coupon.minOrder) {
    return Response.json({
      valid: false,
      message: `This coupon requires a minimum order of KSh ${coupon.minOrder.toLocaleString('en-KE')}.`,
    })
  }

  const discountAmount = coupon.type === 'percentage'
    ? Math.round(orderTotal * coupon.value / 100)
    : coupon.value

  const label = coupon.type === 'percentage'
    ? `${coupon.value}% off`
    : `KSh ${coupon.value.toLocaleString('en-KE')} off`

  return Response.json({
    valid: true,
    discountType: coupon.type,
    discountValue: discountAmount,
    message: `${label} applied! You save KSh ${discountAmount.toLocaleString('en-KE')}.`,
  })
}
