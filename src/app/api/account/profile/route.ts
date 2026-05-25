import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ProfileUpdateSchema = z.object({
  name:    z.string().min(2),
  phone:   z.string().optional(),
  address: z.string().optional(),
  city:    z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body   = await request.json() as unknown
    const parsed = ProfileUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data.' }, { status: 400 })
    }

    // TODO: Verify session / JWT and identify user
    // const session = await getServerSession(authOptions)
    // if (!session) return NextResponse.json({ success: false, error: 'Unauthorised' }, { status: 401 })

    // TODO: Update user record in database
    // await db.user.update({ where: { email: session.user.email }, data: parsed.data })

    console.log('[Profile update]', parsed.data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Profile API error]', error)
    return NextResponse.json({ success: false, error: 'Server error.' }, { status: 500 })
  }
}
