import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { deleteExpense } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

export const DELETE = (request: Request, { params }: { params: { id: string } }) => adminRoute(async (session) => {
  await deleteExpense(params.id)
  await logAdminActivity(session, request, {
    action: 'expense.deleted', description: 'Deleted an expense', resourceType: 'expense', resourceId: params.id,
  })
  return NextResponse.json({ success: true })
})
