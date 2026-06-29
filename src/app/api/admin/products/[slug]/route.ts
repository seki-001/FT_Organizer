import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { updateProductBySlug, deleteProductBySlug } from '@/lib/db/products'
import type { Product } from '@/lib/types'

type Params = { params: { slug: string } }

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

  const product = await updateProductBySlug(params.slug, {
    name: body.name != null ? String(body.name) : undefined,
    description: body.description != null ? String(body.description) : undefined,
    price: body.price != null ? Number(body.price) : undefined,
    salePrice: body.salePrice != null ? Number(body.salePrice) : body.salePrice === null ? undefined : undefined,
    category: body.category as Product['category'] | undefined,
    images: Array.isArray(body.images) ? body.images as string[] : undefined,
    inStock: body.inStock != null ? Boolean(body.inStock) : undefined,
    stockCount: body.stockCount != null ? Number(body.stockCount) : undefined,
    featured: body.featured != null ? Boolean(body.featured) : undefined,
    variants: body.variants as Product['variants'],
    specs: body.specs as Product['specs'],
  })

  if (!product) {
    return NextResponse.json({ error: 'Could not update product' }, { status: 500 })
  }

  return NextResponse.json({ success: true, product })
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ok = await deleteProductBySlug(params.slug)
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete product' }, { status: 500 })
  }

  return NextResponse.json({ success: true, slug: params.slug })
}
