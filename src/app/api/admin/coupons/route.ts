import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_COUPONS } from '@/lib/mock-admin-coupons'

export async function GET(_req: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ coupons: MOCK_COUPONS, total: MOCK_COUPONS.length })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json() as Record<string, unknown>
  // TODO: Validate + save to DB
  const newCoupon = { ...body, id: `cp-${Date.now()}`, uses: 0, createdAt: new Date().toISOString() }
  return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 })
}
