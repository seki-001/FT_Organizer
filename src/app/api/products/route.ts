import { listProducts } from '@/lib/db/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  let products = await listProducts({
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    stock: searchParams.get('stock') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  })

  if (searchParams.get('featured') === '1') products = products.filter((p) => p.featured)
  const limit = Number(searchParams.get('limit'))
  if (Number.isInteger(limit) && limit > 0) products = products.slice(0, Math.min(limit, 200))

  // Public catalog data: let the CDN absorb repeat requests.
  return Response.json(
    { products, total: products.length },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  )
}
