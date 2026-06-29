import { listPublishedPosts } from '@/lib/db/blog'

export async function GET() {
  const posts = await listPublishedPosts()
  return Response.json({ posts, total: posts.length })
}
