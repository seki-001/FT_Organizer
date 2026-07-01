import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateOrderStatus } from '@/lib/db/orders'
import { logAdminActivity } from '@/lib/activity-log'

const VALID_STATUSES = [
  'processing',
  'packed',
  'dispatched',
  'delivered',
  'cancelled',
] as const

type OrderStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { status?: string }
  try {
    body = await request.json() as { status?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.status || !VALID_STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 },
    )
  }

  await updateOrderStatus(params.id, body.status as OrderStatus)

  await logAdminActivity(session, request, {
    action: 'order.status_updated',
    description: `Order ${params.id} status changed to ${body.status}`,
    resourceType: 'order',
    resourceId: params.id,
    metadata: { newStatus: body.status },
  })

  return NextResponse.json({
    success:   true,
    orderId:   params.id,
    newStatus: body.status,
    updatedAt: new Date().toISOString(),
  })
}
