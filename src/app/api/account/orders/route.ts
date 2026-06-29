import { getUserSession } from '@/lib/auth'
import { listOrdersForUser } from '@/lib/db/orders'
import { apiError } from '@/lib/api-response'

export async function GET() {
  const session = await getUserSession()
  if (!session?.user) {
    return apiError('Unauthorized', 'UNAUTHORIZED', 401)
  }

  const orders = await listOrdersForUser(session.user.id)
  return Response.json({ orders, total: orders.length })
}
