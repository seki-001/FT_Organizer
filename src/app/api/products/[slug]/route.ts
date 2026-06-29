import { getProductBySlug } from '@/lib/db/products'
import { apiError } from '@/lib/api-response'

type Params = { params: { slug: string } }

export async function GET(_request: Request, { params }: Params) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return apiError('Product not found', 'NOT_FOUND', 404)
  }
  return Response.json({ product })
}
