'use client'

import { useParams } from 'next/navigation'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import BlogPostForm   from '@/components/admin/BlogPostForm'
import { useEffect, useState } from 'react'
import { adminFetch } from '@/lib/admin-client'
import type { AdminPost } from '@/lib/admin-types'
import type { BlogFormInitialData } from '@/components/admin/BlogPostForm'

export default function EditBlogPostPage() {
  const params = useParams<{ slug: string }>()
  const [post, setPost] = useState<AdminPost | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')

  useEffect(() => {
    adminFetch<{ post: AdminPost }>(`/api/admin/blog/${encodeURIComponent(params.slug)}`)
      .then(d => { setPost(d.post); setState('ready') })
      .catch(e => setState(e instanceof Error && e.message === 'Not found' ? 'missing' : 'error'))
  }, [params.slug])

  if (state === 'missing') { notFound(); return null }
  if (state === 'error') return <p role="alert" className="admin-card p-6 text-sm text-danger">Could not load this post. Please refresh.</p>
  if (!post) return <p className="p-6 text-sm text-dark/40">Loading post…</p>

  const initialData: BlogFormInitialData = {
    title:           post.title,
    slug:            post.slug,
    category:        post.category,
    excerpt:         post.excerpt,
    author:          post.author,
    coverImage:      post.coverImage,
    content:         post.content,
    tags:            post.tags,
    metaTitle:       post.metaTitle,
    metaDescription: post.metaDescription,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark transition-colors">
          <ArrowLeft size={15} /> Back to Posts
        </Link>
        <span className="text-dark/20">/</span>
        <span className="text-sm text-dark font-medium truncate max-w-xs">{post.title}</span>
      </div>
      <AdminPageHeader title={`Edit: ${post.title.slice(0, 40)}${post.title.length > 40 ? '…' : ''}`} subtitle={`/blog/${post.slug}`} />
      <BlogPostForm mode="edit" initialData={initialData} editSlug={post.slug} />
    </div>
  )
}
