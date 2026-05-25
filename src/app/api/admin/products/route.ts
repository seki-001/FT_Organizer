import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_PRODUCTS } from '@/lib/mock-products'

/**
 * GET /api/admin/products
 * Returns products with optional filtering and sorting.
 *
 * Query params: search, category, stock, sort
 *
 * TODO: Replace with real DB query.
 */
export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search   = (searchParams.get('search') ?? '').toLowerCase().trim()
  const category = searchParams.get('category') ?? 'all'
  const stock    = searchParams.get('stock')    ?? 'all'
  const sort     = searchParams.get('sort')     ?? 'newest'

  let products = [...MOCK_PRODUCTS]

  if (search) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.slug.includes(search),
    )
  }

  if (category !== 'all') {
    products = products.filter(p => p.category === category)
  }

  if (stock === 'in-stock')     products = products.filter(p =>  p.inStock && p.stockCount >= 5)
  if (stock === 'low-stock')    products = products.filter(p =>  p.inStock && p.stockCount > 0 && p.stockCount < 5)
  if (stock === 'out-of-stock') products = products.filter(p => !p.inStock || p.stockCount === 0)

  if (sort === 'name-asc')   products.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'price-low')  products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  if (sort === 'stock-low')  products.sort((a, b) => a.stockCount - b.stockCount)

  return NextResponse.json({ products, total: products.length })
}

/**
 * POST /api/admin/products
 * Creates a new product.
 *
 * TODO: Validate with zod schema.
 * TODO: Save to database (Prisma/Supabase).
 * TODO: Upload images to Cloudinary or Vercel Blob.
 */
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

  // TODO: Replace with real DB insert + image upload
  const newProduct = {
    ...body,
    id:          `p-${Date.now()}`,
    inStock:     (body.stockCount as number ?? 0) > 0,
    rating:      0,
    reviewCount: 0,
  }

  return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
}
