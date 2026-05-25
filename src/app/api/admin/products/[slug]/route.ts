import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type Params = { params: { slug: string } }

/**
 * PATCH /api/admin/products/[slug]
 * Updates a product (partial update).
 *
 * TODO: Update real DB record.
 * TODO: If slug changes, handle redirect / old-slug deprecation.
 */
export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // TODO: Replace with real DB update
  return NextResponse.json({
    success:   true,
    slug:      params.slug,
    updatedAt: new Date().toISOString(),
    data:      body,
  })
}

/**
 * DELETE /api/admin/products/[slug]
 * Soft-deletes a product (sets deleted: true).
 *
 * TODO: Implement soft-delete in real DB:
 *   await prisma.product.update({
 *     where: { slug: params.slug },
 *     data: { deleted: true, deletedAt: new Date() },
 *   })
 */
export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // TODO: Replace with real soft-delete
  return NextResponse.json({
    success:   true,
    slug:      params.slug,
    deletedAt: new Date().toISOString(),
  })
}
