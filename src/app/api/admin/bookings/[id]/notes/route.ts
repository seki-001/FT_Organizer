import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateBookingNotes } from '@/lib/db/bookings'
import { logAdminActivity } from '@/lib/activity-log'

type Params = { params: { id: string } }

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { notes?: string }
  try {
    body = await request.json() as { notes?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (body.notes === undefined) {
    return NextResponse.json({ error: 'Missing "notes" field' }, { status: 400 })
  }

  const ok = await updateBookingNotes(params.id, body.notes)
  if (!ok) {
    return NextResponse.json({ error: 'Could not save notes' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'booking.notes_updated',
    description: `Updated notes on booking ${params.id}`,
    resourceType: 'booking',
    resourceId: params.id,
  })

  return NextResponse.json({
    success:   true,
    bookingId: params.id,
    updatedAt: new Date().toISOString(),
  })
}
