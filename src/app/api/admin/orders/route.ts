import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_ADMIN_ORDERS } from '@/lib/mock-admin-orders'

/**
 * GET /api/admin/orders
 * Returns paginated, filtered orders.
 *
 * Query params:
 *   status        — order status filter (all | processing | packed | dispatched | delivered | cancelled)
 *   search        — matches order id, customer name, or customer email
 *   paymentMethod — payment method filter (all | mpesa | card | cod)
 *   dateRange     — date range filter (all | today | week | month)
 *   page          — page number (default: 1)
 *
 * TODO: Replace mock data with real DB query (Prisma, Supabase, etc.)
 */
export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status        = searchParams.get('status') ?? 'all'
  const search        = (searchParams.get('search') ?? '').toLowerCase().trim()
  const paymentMethod = searchParams.get('paymentMethod') ?? 'all'
  const dateRange     = searchParams.get('dateRange') ?? 'all'
  const page          = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const perPage       = 20

  let orders = [...MOCK_ADMIN_ORDERS]

  if (status !== 'all') {
    orders = orders.filter(o => o.orderStatus === status)
  }

  if (paymentMethod !== 'all') {
    orders = orders.filter(o => o.paymentMethod === paymentMethod)
  }

  if (search) {
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(search) ||
      o.customer.name.toLowerCase().includes(search) ||
      o.customer.email.toLowerCase().includes(search),
    )
  }

  if (dateRange !== 'all') {
    const now = new Date()
    orders = orders.filter(o => {
      const created = new Date(o.createdAt)
      if (dateRange === 'today') {
        return created.toDateString() === now.toDateString()
      }
      if (dateRange === 'week') {
        return created >= new Date(now.getTime() - 7 * 86_400_000)
      }
      if (dateRange === 'month') {
        return created >= new Date(now.getTime() - 30 * 86_400_000)
      }
      return true
    })
  }

  const total      = orders.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const sliced     = orders.slice((page - 1) * perPage, page * perPage)

  return NextResponse.json({ orders: sliced, total, page, totalPages, perPage })
}
