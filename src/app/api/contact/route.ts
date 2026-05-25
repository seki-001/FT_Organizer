import { NextRequest, NextResponse } from 'next/server'
import { ContactFormSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json() as unknown
    const parsed = ContactFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data. Please check all fields.' },
        { status: 400 }
      )
    }

    const { name, email, phone, subject, message } = parsed.data

    console.log('[Contact form submission]', {
      name, email, phone, subject,
      messagePreview: message.slice(0, 80),
      receivedAt: new Date().toISOString(),
    })

    // TODO: Send email notification via Resend or NodeMailer
    //   await resend.emails.send({
    //     from:    'Website <noreply@organizer.co.ke>',
    //     to:      ['faith@organizer.co.ke'],
    //     replyTo: email,
    //     subject: `New contact form: ${subject} — from ${name}`,
    //     html: `
    //       <p><strong>Name:</strong> ${name}</p>
    //       <p><strong>Email:</strong> ${email}</p>
    //       <p><strong>Phone:</strong> ${phone}</p>
    //       <p><strong>Subject:</strong> ${subject}</p>
    //       <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
    //     `,
    //   })

    // TODO: Optionally save submission to database for a CRM-style log
    //   await db.contactSubmission.create({ data: parsed.data })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('[Contact API error]', error)
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
