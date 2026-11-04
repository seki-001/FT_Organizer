import { listPublishedPosts } from '@/lib/db/blog'

// Never prerender at build time (the database may be empty or unreachable then).
export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await listPublishedPosts()
  return Response.json(
    { posts, total: posts.length },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } },
  )
}
