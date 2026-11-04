import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { listOrders } from '@/lib/db/orders'

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => {
  const orders = await listOrders()
  return NextResponse.json({ orders, total: orders.length })
})
