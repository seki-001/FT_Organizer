import { NextRequest, NextResponse } from 'next/server'
import { BookingFormSchema } from '@/lib/validations'

function generateReference(): string {
  return Math.random().toString(36).toUpperCase().slice(2, 8)
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()

    const parsed = BookingFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const booking = parsed.data
    const reference = generateReference()

    // Log the incoming booking (visible in Vercel/Next.js server logs)
    console.log('[Booking received]', {
      reference,
      service:      booking.service,
      date:         booking.date,
      name:         booking.name,
      email:        booking.email,
      phone:        booking.phone,
      location:     booking.location,
      city:         booking.city,
      country:      booking.country,
      propertyType: booking.propertyType,
      propertySize: booking.propertySize,
      notes:        booking.notes ?? '',
      createdAt:    booking.createdAt,
    })

    // TODO: Send confirmation email to client via Resend
    //   await sendBookingConfirmation({ to: booking.email, booking, reference })

    // TODO: Send admin notification email via Resend
    //   await sendAdminNotification({ booking, reference })

    // TODO: Persist booking to database (e.g. Prisma / Supabase)
    //   await db.booking.create({ data: { ...booking, reference, status: 'new' } })

    return NextResponse.json({ success: true, reference }, { status: 201 })
  } catch (error) {
    console.error('[Booking API error]', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
