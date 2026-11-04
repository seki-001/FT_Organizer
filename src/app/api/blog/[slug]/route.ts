import { getPostBySlug } from '@/lib/db/blog'
import { apiError } from '@/lib/api-response'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, props: Params) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug)
  if (!post) {
    return apiError('Post not found', 'NOT_FOUND', 404)
  }
  return Response.json({ post })
}
