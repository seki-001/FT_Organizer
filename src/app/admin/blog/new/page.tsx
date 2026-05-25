'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import BlogPostForm   from '@/components/admin/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark transition-colors w-fit">
        <ArrowLeft size={15} /> Back to Posts
      </Link>
      <AdminPageHeader title="New Post" subtitle="Write and publish a new blog article." />
      <BlogPostForm mode="new" />
    </div>
  )
}
