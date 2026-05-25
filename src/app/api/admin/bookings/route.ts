import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_ADMIN_BOOKINGS } from '@/lib/mock-admin-bookings'
import { SERVICES } from '@/lib/constants'

/**
 * GET /api/admin/bookings
 * Returns bookings with optional filtering.
 *
 * Query params: search, status, service, dateRange
 *
 * TODO: Replace with real DB query (Prisma / Supabase).
 */
export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search    = (searchParams.get('search')    ?? '').toLowerCase().trim()
  const status    = searchParams.get('status')    ?? 'all'
  const service   = searchParams.get('service')   ?? 'all'
  const dateRange = searchParams.get('dateRange') ?? 'all'

  let bookings = [...MOCK_ADMIN_BOOKINGS]

  if (search) {
    bookings = bookings.filter(b =>
      b.id.toLowerCase().includes(search) ||
      b.name.toLowerCase().includes(search) ||
      b.email.toLowerCase().includes(search),
    )
  }

  if (status !== 'all') {
    bookings = bookings.filter(b => b.status === status)
  }

  if (service !== 'all') {
    bookings = bookings.filter(b => b.service === service)
  }

  if (dateRange !== 'all') {
    const now       = new Date()
    const startOf   = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const todayStart = startOf(now)
    const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    bookings = bookings.filter(b => {
      const created = new Date(b.createdAt)
      if (dateRange === 'today') return created >= todayStart
      if (dateRange === 'week')  return created >= weekStart
      if (dateRange === 'month') return created >= monthStart
      return true
    })
  }

  return NextResponse.json({ bookings, total: bookings.length, services: SERVICES })
}
