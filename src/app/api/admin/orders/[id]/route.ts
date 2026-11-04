import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { getOrderByReference } from '@/lib/db/orders'

export const dynamic = 'force-dynamic'

export const GET = async (_request: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  return adminRoute(async () => {
    const order = await getOrderByReference(params.id)
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ order })
  });
}
