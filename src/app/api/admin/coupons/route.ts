import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listCoupons, upsertCoupon } from '@/lib/db/coupons'

export async function GET() {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const coupons = await listCoupons()
  return NextResponse.json({ coupons, total: coupons.length })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as Record<string, unknown>
  const coupon = await upsertCoupon({
    code: String(body.code ?? ''),
    type: body.type as 'percentage' | 'fixed',
    value: Number(body.value),
    minOrder: Number(body.minOrder ?? 0),
    usageLimit: body.usageLimit != null ? Number(body.usageLimit) : null,
    uses: 0,
    active: body.active !== false,
    expiresAt: (body.expiresAt as string) ?? null,
  })

  return NextResponse.json({ success: true, coupon }, { status: 201 })
}
