import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

const VALID_STATUSES = [
  'processing',
  'packed',
  'dispatched',
  'delivered',
  'cancelled',
] as const

type OrderStatus = (typeof VALID_STATUSES)[number]

/**
 * PATCH /api/admin/orders/[id]/status
 * Updates the status of a single order.
 *
 * Body: { status: OrderStatus }
 *
 * TODO: Persist to real DB — e.g.:
 *   await prisma.order.update({ where: { id: params.id }, data: { orderStatus: status } })
 * TODO: Trigger notification (WhatsApp / email) to customer on status change.
 */
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

  // TODO: Replace with real DB update
  return NextResponse.json({
    success:   true,
    orderId:   params.id,
    newStatus: body.status,
    updatedAt: new Date().toISOString(),
  })
}
