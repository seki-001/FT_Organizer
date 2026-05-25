'use client'

import { useParams } from 'next/navigation'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import BlogPostForm   from '@/components/admin/BlogPostForm'
import { MOCK_ADMIN_POSTS } from '@/lib/mock-admin-blog'
import type { BlogFormInitialData } from '@/components/admin/BlogPostForm'

export default function EditBlogPostPage() {
  const params = useParams<{ slug: string }>()
  const post   = MOCK_ADMIN_POSTS.find(p => p.slug === params.slug)

  if (!post) { notFound(); return null }

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
