import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listBookings } from '@/lib/db/bookings'
import { SERVICES } from '@/lib/constants'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const bookings = await listBookings({
    search:    (searchParams.get('search')    ?? '').toLowerCase().trim(),
    status:    searchParams.get('status')    ?? 'all',
    service:   searchParams.get('service')   ?? 'all',
    dateRange: searchParams.get('dateRange') ?? 'all',
  })

  return NextResponse.json({ bookings, total: bookings.length, services: SERVICES })
}
