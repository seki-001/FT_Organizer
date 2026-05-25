import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { MOCK_ADMIN_POSTS } from '@/lib/mock-admin-blog'

export async function GET(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { searchParams } = new URL(request.url)
  const status   = searchParams.get('status')   ?? 'all'
  const category = searchParams.get('category') ?? 'all'
  const search   = (searchParams.get('search')  ?? '').toLowerCase()

  let posts = [...MOCK_ADMIN_POSTS]
  if (status   !== 'all') posts = posts.filter(p => p.status   === status)
  if (category !== 'all') posts = posts.filter(p => p.category === category)
  if (search)             posts = posts.filter(p => p.title.toLowerCase().includes(search) || p.slug.includes(search))

  return NextResponse.json({ posts, total: posts.length })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json() as Record<string, unknown>
  // TODO: Save to DB
  return NextResponse.json({ success: true, post: { ...body, id: `post-${Date.now()}` } }, { status: 201 })
}
