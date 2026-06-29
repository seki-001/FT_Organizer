import { getPostBySlug } from '@/lib/db/blog'
import { apiError } from '@/lib/api-response'

type Params = { params: { slug: string } }

export async function GET(_request: Request, { params }: Params) {
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return apiError('Post not found', 'NOT_FOUND', 404)
  }
  return Response.json({ post })
}
