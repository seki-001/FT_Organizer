import { NextResponse } from 'next/server'
import { z } from 'zod'
import { adminRoute, dateSchema, paymentMethodSchema } from '@/lib/admin-api'
import { createPurchase, listPurchases } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

const schema = z.object({
  supplierName: z.string().trim().min(1, 'Supplier is required').max(150),
  items: z.array(z.object({
    productId: z.string().optional(),
    productName: z.string().trim().min(1).max(200),
    quantity: z.number().int().positive(),
    unitCost: z.number().min(0),
    total: z.number().optional().default(0),
  })).min(1, 'Add at least one item'),
  paymentMethod: paymentMethodSchema,
  date: dateSchema,
  invoiceNo: z.string().max(80).optional(),
  note: z.string().max(500).optional(),
})

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => NextResponse.json({ purchases: await listPurchases() }))

export const POST = (request: Request) => adminRoute(async (session) => {
  const input = schema.parse(await request.json())
  const purchase = await createPurchase(input)
  await logAdminActivity(session, request, {
    action: 'purchase.created', description: `Recorded purchase from ${purchase.supplierName}`,
    resourceType: 'purchase', resourceId: purchase.id, metadata: { total: purchase.total },
  })
  return NextResponse.json({ purchase }, { status: 201 })
})
