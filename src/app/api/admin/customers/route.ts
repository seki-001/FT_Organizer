import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_CUSTOMERS } from '@/lib/mock-admin-customers'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') ?? '').toLowerCase().trim()
  const filter  = searchParams.get('filter') ?? 'all'   // 'all' | 'active' | 'new'

  const now        = new Date()
  const active90   = new Date(now); active90.setDate(active90.getDate() - 90)
  const thisMonth  = new Date(now.getFullYear(), now.getMonth(), 1)

  let customers = [...MOCK_CUSTOMERS]

  if (search) {
    customers = customers.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.includes(search),
    )
  }

  if (filter === 'active') {
    customers = customers.filter(c => c.lastOrderAt && new Date(c.lastOrderAt) >= active90)
  } else if (filter === 'new') {
    customers = customers.filter(c => new Date(c.joinedAt) >= thisMonth)
  }

  // Strip order/booking detail from list response
  const list = customers.map(({ orders: _o, bookings: _b, ...rest }) => rest)

  return NextResponse.json({ customers: list, total: list.length })
}
