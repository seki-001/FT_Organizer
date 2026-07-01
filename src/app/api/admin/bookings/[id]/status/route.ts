import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateBookingStatus } from '@/lib/db/bookings'
import { logAdminActivity } from '@/lib/activity-log'

type Params = { params: { id: string } }

const VALID_STATUSES = ['new', 'quoted', 'confirmed', 'completed', 'cancelled'] as const
type BookingStatus = (typeof VALID_STATUSES)[number]

export async function PATCH(request: NextRequest, { params }: Params) {
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

  await updateBookingStatus(params.id, newStatus)

  await logAdminActivity(session, request, {
    action: 'booking.status_updated',
    description: `Booking ${params.id} status changed to ${newStatus}`,
    resourceType: 'booking',
    resourceId: params.id,
    metadata: { newStatus },
  })

  return NextResponse.json({
    success:   true,
    bookingId: params.id,
    newStatus,
    updatedAt: new Date().toISOString(),
  })
}
