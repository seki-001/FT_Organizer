import { NextResponse } from 'next/server'
import { z } from 'zod'
import { adminRoute } from '@/lib/admin-api'
import { adjustCustomerBalance, deleteCustomer } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

const schema = z.object({ delta: z.number().refine((n) => n !== 0, 'Amount cannot be zero') })

/** PATCH { delta } — positive = customer owes more, negative = payment received. */
export const PATCH = (request: Request, { params }: { params: { id: string } }) => adminRoute(async (session) => {
  const { delta } = schema.parse(await request.json())
  const customer = await adjustCustomerBalance(params.id, delta)
  if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await logAdminActivity(session, request, {
    action: delta < 0 ? 'customer.payment' : 'customer.debt',
    description: `${delta < 0 ? 'Payment received from' : 'Debt added for'} ${customer.name}`,
    resourceType: 'customer', resourceId: customer.id, metadata: { delta },
  })
  return NextResponse.json({ customer })
})

export const DELETE = (request: Request, { params }: { params: { id: string } }) => adminRoute(async (session) => {
  await deleteCustomer(params.id)
  await logAdminActivity(session, request, {
    action: 'customer.deleted', description: 'Deleted a customer', resourceType: 'customer', resourceId: params.id,
  })
  return NextResponse.json({ success: true })
})
