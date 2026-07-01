import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listProducts, insertProduct } from '@/lib/db/products'
import { logAdminActivity } from '@/lib/activity-log'
import type { Product } from '@/lib/types'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const products = await listProducts({
    search:   (searchParams.get('search') ?? '').toLowerCase().trim(),
    category: searchParams.get('category') ?? 'all',
    stock:    searchParams.get('stock')    ?? 'all',
    sort:     searchParams.get('sort')     ?? 'newest',
  })

  return NextResponse.json({ products, total: products.length })
}

export async function POST(request: Request) {
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

  const product = await insertProduct({
    slug: body.slug as string,
    name: body.name as string,
    price: Number(body.price),
    category: body.category as Product['category'],
    description: (body.description as string) ?? '',
    salePrice: body.salePrice != null ? Number(body.salePrice) : undefined,
    stockCount: Number(body.stockCount ?? 0),
    images: (body.images as string[]) ?? [],
    featured: Boolean(body.featured),
  })

  if (!product) {
    return NextResponse.json({ error: 'Could not create product' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'product.created',
    description: `Created product "${product.name}"`,
    resourceType: 'product',
    resourceId: product.slug,
    metadata: { name: product.name, price: product.price },
  })

  return NextResponse.json({ success: true, product }, { status: 201 })
}
