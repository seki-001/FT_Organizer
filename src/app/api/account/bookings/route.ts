import { getUserSession } from '@/lib/auth'
import { listBookingsForUser } from '@/lib/db/bookings'
import { apiError } from '@/lib/api-response'

export async function GET() {
  const session = await getUserSession()
  if (!session?.user) {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  const bookings = await listBookingsForUser(session.user.id)
  return Response.json({ bookings, total: bookings.length })
}
