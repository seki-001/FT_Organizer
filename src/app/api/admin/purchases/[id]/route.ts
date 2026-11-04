import { NextResponse } from 'next/server'
import { adminRoute } from '@/lib/admin-api'
import { deletePurchase } from '@/lib/db/backoffice'
import { logAdminActivity } from '@/lib/activity-log'

export const DELETE = async (request: Request, props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  return adminRoute(async (session) => {
    await deletePurchase(params.id)
    await logAdminActivity(session, request, {
      action: 'purchase.deleted', description: 'Deleted a purchase record (stock not reversed)',
      resourceType: 'purchase', resourceId: params.id,
    })
    return NextResponse.json({ success: true })
  });
}
