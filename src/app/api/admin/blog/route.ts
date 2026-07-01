import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { listAllPosts, upsertPost } from '@/lib/db/blog'
import { logAdminActivity } from '@/lib/activity-log'
import type { BlogPost } from '@/lib/types'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status   = searchParams.get('status')   ?? 'all'
  const category = searchParams.get('category') ?? 'all'
  const search   = (searchParams.get('search')  ?? '').toLowerCase()

  let posts = await listAllPosts()
  if (status === 'published') posts = posts.filter((p) => p.publishedAt)
  if (status === 'draft') posts = posts.filter((p) => !p.publishedAt)
  if (category !== 'all') posts = posts.filter((p) => p.category === category)
  if (search) posts = posts.filter((p) => p.title.toLowerCase().includes(search) || p.slug.includes(search))

  return NextResponse.json({ posts, total: posts.length })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as Record<string, unknown>
  const post = await upsertPost({
    slug: String(body.slug ?? ''),
    title: String(body.title ?? ''),
    excerpt: String(body.excerpt ?? ''),
    content: String(body.content ?? ''),
    coverImage: String(body.coverImage ?? body.cover_image ?? ''),
    category: body.category as BlogPost['category'],
    author: String(body.author ?? 'Faith The Organizer'),
    publishedAt: String(body.publishedAt ?? body.published_at ?? new Date().toISOString().slice(0, 10)),
    readTime: Number(body.readTime ?? body.read_time ?? 5),
    tags: Array.isArray(body.tags) ? body.tags as string[] : [],
    published: body.published !== false,
  })

  if (!post) {
    return NextResponse.json({ error: 'Could not create post' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'blog.created',
    description: `Created blog post "${post.title}"`,
    resourceType: 'blog',
    resourceId: post.slug,
    metadata: { title: post.title, published: Boolean(post.publishedAt) },
  })

  return NextResponse.json({ success: true, post }, { status: 201 })
}
