import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Params = { params: { id: string } }

/**
 * PATCH /api/admin/bookings/[id]/notes
 * Saves admin-only internal notes for a booking.
 * These notes are never visible to the customer.
 *
 * Body: { notes: string }
 *
 * TODO: Update real DB record (internalNotes field).
 */
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

  // TODO: Replace with real DB update
  return NextResponse.json({
    success:   true,
    bookingId: params.id,
    updatedAt: new Date().toISOString(),
  })
}
