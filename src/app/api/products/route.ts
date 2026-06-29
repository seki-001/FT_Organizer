import { listProducts } from '@/lib/db/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const products = await listProducts({
    search: searchParams.get('search') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    stock: searchParams.get('stock') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  })

  return Response.json({ products, total: products.length })
}
