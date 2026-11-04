import { NextResponse } from 'next/server'
import { z } from 'zod'
import { adminRoute } from '@/lib/admin-api'
import { createCustomer, listCustomers } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(150),
  phone: z.string().trim().min(1, 'Phone is required').max(30),
  email: z.string().trim().email().optional().or(z.literal('')),
  address: z.string().max(300).optional(),
  notes: z.string().max(500).optional(),
})

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => NextResponse.json({ customers: await listCustomers() }))

export const POST = (request: Request) => adminRoute(async (session) => {
  const customer = await createCustomer(schema.parse(await request.json()))
  await logAdminActivity(session, request, {
    action: 'customer.created', description: `Added customer "${customer.name}"`,
    resourceType: 'customer', resourceId: customer.id,
  })
  return NextResponse.json({ customer }, { status: 201 })
})
