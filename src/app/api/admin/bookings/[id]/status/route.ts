import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Params = { params: { id: string } }

const VALID_STATUSES = ['new', 'quoted', 'confirmed', 'completed', 'cancelled'] as const
type BookingStatus = (typeof VALID_STATUSES)[number]

/**
 * PATCH /api/admin/bookings/[id]/status
 * Updates the status of a booking.
 *
 * Body: { status: BookingStatus }
 *
 * TODO: Update real DB record.
 * TODO: Trigger status-change notification to customer (email/SMS).
 */
export async function PATCH(request: Request, { params }: Params) {
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

  const newStatus = body.status as BookingStatus | undefined
  if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json(
      { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 422 },
    )
  }

  // TODO: Replace with real DB update
  return NextResponse.json({
    success:   true,
    bookingId: params.id,
    newStatus,
    updatedAt: new Date().toISOString(),
  })
}
