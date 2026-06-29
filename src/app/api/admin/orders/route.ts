import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listOrders } from '@/lib/db/orders'

export async function GET() {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await listOrders()
  return NextResponse.json({ orders, total: orders.length })
}
