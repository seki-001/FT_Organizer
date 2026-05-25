import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json() as unknown
    const parsed = SubscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const { email } = parsed.data

    console.log('[Newsletter subscription]', { email, subscribedAt: new Date().toISOString() })

    // TODO: Add subscriber to email list via Resend Audiences or Mailchimp
    //   await resend.contacts.create({
    //     email,
    //     audienceId: process.env.RESEND_AUDIENCE_ID,
    //   })

    // TODO: Send welcome email
    //   await resend.emails.send({
    //     from:    'Faith The Organizer <hello@organizer.co.ke>',
    //     to:      email,
    //     subject: 'Welcome to The Organized Life!',
    //     html:    welcomeEmailTemplate(),
    //   })

    return NextResponse.json(
      { success: true, message: "You're in! Check your inbox." },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Newsletter API error]', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
