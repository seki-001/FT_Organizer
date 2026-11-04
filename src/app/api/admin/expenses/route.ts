import { NextResponse } from 'next/server'
import { z } from 'zod'
import { adminRoute, dateSchema, paymentMethodSchema } from '@/lib/admin-api'
import { createExpense, listExpenses } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

const schema = z.object({
  description: z.string().trim().min(1, 'Description is required').max(200),
  category: z.enum(['rent', 'utilities', 'salaries', 'stock-purchase', 'transport', 'marketing', 'packaging', 'equipment', 'other']),
  amount: z.number().positive('Enter a valid amount').max(100_000_000),
  paymentMethod: paymentMethodSchema,
  date: dateSchema,
  note: z.string().max(500).optional(),
})

export const dynamic = 'force-dynamic'

export const GET = () => adminRoute(async () => NextResponse.json({ expenses: await listExpenses() }))

export const POST = (request: Request) => adminRoute(async (session) => {
  const input = schema.parse(await request.json())
  const expense = await createExpense(input)
  await logAdminActivity(session, request, {
    action: 'expense.created', description: `Recorded expense "${expense.description}"`,
    resourceType: 'expense', resourceId: expense.id, metadata: { amount: expense.amount, category: expense.category },
  })
  return NextResponse.json({ expense }, { status: 201 })
})
