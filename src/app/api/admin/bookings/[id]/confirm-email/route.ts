import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Params = { params: { id: string } }

/**
 * POST /api/admin/bookings/[id]/confirm-email
 * Sends a booking confirmation email to the customer.
 *
 * TODO: Connect Resend (https://resend.com) to send real transactional email:
 *
 *   import { Resend } from 'resend'
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *
 *   const booking = await prisma.booking.findUnique({ where: { id: params.id } })
 *   if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
 *
 *   await resend.emails.send({
 *     from:    'Faith The Organizer <bookings@organizer.co.ke>',
 *     to:      booking.email,
 *     subject: `Your booking #${booking.id} is confirmed — Faith The Organizer`,
 *     html:    renderBookingConfirmationEmail(booking), // see src/emails/
 *   })
 */
export async function POST(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Stub — log and return success until Resend is connected
  console.log(`[Stub] Confirmation email would be sent for booking ${params.id}`)

  return NextResponse.json({
    success:   true,
    bookingId: params.id,
    message:   'Confirmation email stub — connect Resend to send real emails.',
    sentAt:    new Date().toISOString(),
  })
}
