import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Params = { params: { slug: string } }

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json() as Record<string, unknown>
  // TODO: Update DB record
  return NextResponse.json({ success: true, slug: params.slug, updatedAt: new Date().toISOString(), data: body })
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // TODO: Soft-delete in DB
  return NextResponse.json({ success: true, slug: params.slug, deletedAt: new Date().toISOString() })
}
