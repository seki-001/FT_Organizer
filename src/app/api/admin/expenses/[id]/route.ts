import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { deleteExpense } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

export const DELETE = async (request: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  return adminRoute(async (session) => {
    await deleteExpense(params.id)
    await logAdminActivity(session, request, {
      action: 'expense.deleted', description: 'Deleted an expense', resourceType: 'expense', resourceId: params.id,
    })
    return NextResponse.json({ success: true })
  });
}
