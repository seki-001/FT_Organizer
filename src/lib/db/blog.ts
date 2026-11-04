import type { BlogPost } from '@/lib/types'
import type { AdminPost } from '@/lib/admin-types'
import { allowMockData } from '@/lib/mock-guard'
import { MOCK_POSTS } from '@/lib/mock-posts'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { rowToBlogPost } from '@/lib/db/mappers'
import { logger } from '@/lib/logger'
import type { TablesInsert } from '@/types/database'

export async function listPublishedPosts(): Promise<BlogPost[]> {
  if (!isSupabaseAdminConfigured()) {
    return allowMockData() ? [...MOCK_POSTS] : []
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    logger.error({ event: 'blog_list_failed', error_code: error.code })
    return allowMockData() ? [...MOCK_POSTS] : []
  }
  if (!data?.length) return allowMockData() ? [...MOCK_POSTS] : []

  return data.map(rowToBlogPost)
}

function rowToAdminPost(row: Parameters<typeof rowToBlogPost>[0]): AdminPost {
  return { ...rowToBlogPost(row), status: row.published ? 'published' : 'draft', views: 0 }
}

/** All posts including drafts — admin only. Never falls back to demo data in production. */
export async function listAllPosts(): Promise<AdminPost[]> {
  if (!isSupabaseAdminConfigured()) return []
  const admin = createAdminClient()
  const { data, error } = await admin.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToAdminPost)
}

export async function getAdminPostBySlug(slug: string): Promise<AdminPost | null> {
  if (!isSupabaseAdminConfigured()) return null
  const admin = createAdminClient()
  const { data, error } = await admin.from('blog_posts').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data ? rowToAdminPost(data) : null
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseAdminConfigured()) {
    return allowMockData() ? (MOCK_POSTS.find((p) => p.slug === slug) ?? null) : null
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('blog_posts').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return null
  return rowToBlogPost(data)
}

export async function upsertPost(post: BlogPost & { published?: boolean }) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const payload: TablesInsert<'blog_posts'> = {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    cover_image: post.coverImage,
    category: post.category,
    author: post.author,
    published_at: post.publishedAt,
    read_time: post.readTime,
    tags: post.tags,
    published: post.published ?? true,
  }

  const { data, error } = await admin
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })
    .select()
    .single()

  if (error) {
    logger.error({ event: 'blog_upsert_failed', error_code: error.code })
    throw error
  }
  return rowToBlogPost(data)
}

export async function deletePostBySlug(slug: string) {
  if (!isSupabaseAdminConfigured()) return false
  const admin = createAdminClient()
  const { error } = await admin.from('blog_posts').delete().eq('slug', slug)
  return !error
}
