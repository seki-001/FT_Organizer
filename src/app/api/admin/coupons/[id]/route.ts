import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateCouponById, deleteCoupon } from '@/lib/db/coupons'
import { logAdminActivity } from '@/lib/activity-log'

type Params = { params: { id: string } }

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as Record<string, unknown>
  const coupon = await updateCouponById(params.id, {
    code: body.code != null ? String(body.code) : undefined,
    type: body.type as 'percentage' | 'fixed' | undefined,
    value: body.value != null ? Number(body.value) : undefined,
    minOrder: body.minOrder != null ? Number(body.minOrder) : undefined,
    usageLimit: body.usageLimit != null ? Number(body.usageLimit) : body.usageLimit === null ? null : undefined,
    uses: body.uses != null ? Number(body.uses) : undefined,
    active: body.active != null ? Boolean(body.active) : undefined,
    expiresAt: body.expiresAt != null ? String(body.expiresAt) : body.expiresAt === null ? null : undefined,
  })

  if (!coupon) {
    return NextResponse.json({ error: 'Could not update coupon' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'coupon.updated',
    description: `Updated coupon "${coupon.code}"`,
    resourceType: 'coupon',
    resourceId: params.id,
    metadata: { code: coupon.code, active: coupon.active },
  })

  return NextResponse.json({ success: true, coupon })
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ok = await deleteCoupon(params.id)
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete coupon' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'coupon.deleted',
    description: `Deleted coupon ${params.id}`,
    resourceType: 'coupon',
    resourceId: params.id,
  })

  return NextResponse.json({ success: true, id: params.id })
}
