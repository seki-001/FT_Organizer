import { NextResponse } from 'next/server'
import { z } from 'zod'
import { adminRoute, paymentMethodSchema } from '@/lib/admin-api'
import { createSale, listSales } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

const schema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string().min(1).max(200),
    category: z.string().max(100).default(''),
    quantity: z.number().int().positive(),
    unitPrice: z.number().min(0),
    total: z.number().optional().default(0),
  })).min(1, 'Cart is empty'),
  discount: z.number().min(0).default(0),
  paymentMethod: paymentMethodSchema,
  customerId: z.string().uuid().optional(),
  customerName: z.string().max(150).optional(),
  note: z.string().max(500).optional(),
})

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => NextResponse.json({ sales: await listSales() }))

export const POST = (request: Request) => adminRoute(async (session) => {
  const input = schema.parse(await request.json())
  const sale = await createSale({ ...input, cashierName: session.user.name })
  await logAdminActivity(session, request, {
    action: 'pos.sale', description: `POS sale ${sale.receiptNo} — KSh ${sale.total}`,
    resourceType: 'sale', resourceId: sale.id, metadata: { total: sale.total, paymentMethod: sale.paymentMethod },
  })
  return NextResponse.json({ sale }, { status: 201 })
})
