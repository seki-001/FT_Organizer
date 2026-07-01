import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { upsertPost, deletePostBySlug } from '@/lib/db/blog'
import { logAdminActivity } from '@/lib/activity-log'
import type { BlogPost } from '@/lib/types'

type Params = { params: { slug: string } }

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json() as Record<string, unknown>
  const post = await upsertPost({
    slug: params.slug,
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
    return NextResponse.json({ error: 'Could not update post' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'blog.updated',
    description: `Updated blog post "${post.title}"`,
    resourceType: 'blog',
    resourceId: params.slug,
    metadata: { title: post.title },
  })

  return NextResponse.json({ success: true, post })
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ok = await deletePostBySlug(params.slug)
  if (!ok) {
    return NextResponse.json({ error: 'Could not delete post' }, { status: 500 })
  }

  await logAdminActivity(session, request, {
    action: 'blog.deleted',
    description: `Deleted blog post "${params.slug}"`,
    resourceType: 'blog',
    resourceId: params.slug,
  })

  return NextResponse.json({ success: true, slug: params.slug })
}
