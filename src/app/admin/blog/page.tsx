'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import {
  PlusCircle, Search, ChevronDown, Pencil, Trash2, Eye, Clock, BarChart2,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { MOCK_ADMIN_POSTS, BLOG_CATEGORIES } from '@/lib/mock-admin-blog'
import type { AdminPost } from '@/lib/mock-admin-blog'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CAT_COLORS: Record<string, string> = {
  'home-tips':        'bg-emerald-100 text-emerald-700',
  'office':           'bg-blue-100 text-blue-700',
  'before-and-after': 'bg-orange-100 text-orange-700',
  'product-reviews':  'bg-purple-100 text-purple-700',
  'nairobi-living':   'bg-primary/10 text-primary',
}

function catLabel(cat: string) {
  return BLOG_CATEGORIES.find(c => c.value === cat)?.label ?? cat
}

function DeleteDialog({ post, onConfirm, onCancel }: { post: AdminPost; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-danger" />
          </div>
          <div>
            <h3 className="font-semibold text-dark">Delete Post?</h3>
            <p className="text-sm text-dark/60 mt-1">
              <span className="font-medium text-dark">&ldquo;{post.title}&rdquo;</span> will be permanently deleted.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel}  className="flex-1 px-4 py-2.5 border border-dark/15 text-dark text-sm font-medium rounded-lg hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90 transition-colors">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const [posts,       setPosts]       = useState<AdminPost[]>(MOCK_ADMIN_POSTS)
  const [search,      setSearch]      = useState('')
  const [statusFilter,setStatusFilter]= useState('all')
  const [catFilter,   setCatFilter]   = useState('all')
  const [deleteSlug,  setDeleteSlug]  = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...posts]
    const q = search.toLowerCase().trim()
    if (q)                  list = list.filter(p => p.title.toLowerCase().includes(q) || p.slug.includes(q))
    if (statusFilter !== 'all') list = list.filter(p => p.status === statusFilter)
    if (catFilter    !== 'all') list = list.filter(p => p.category === catFilter)
    return list
  }, [posts, search, statusFilter, catFilter])

  function handleDelete() {
    if (!deleteSlug) return
    setPosts(prev => prev.filter(p => p.slug !== deleteSlug))
    fetch(`/api/admin/blog/${deleteSlug}`, { method: 'DELETE' }).catch(() => {})
    setDeleteSlug(null)
  }

  const publishedCount = posts.filter(p => p.status === 'published').length
  const draftCount     = posts.filter(p => p.status === 'draft').length
  const deletePost     = deleteSlug ? posts.find(p => p.slug === deleteSlug) : null

  return (
    <>
      <div className="flex flex-col gap-6">

        <AdminPageHeader
          title="Blog Posts"
          subtitle="Manage and publish your blog content"
          action={{ label: 'New Post', href: '/admin/blog/new', icon: PlusCircle }}
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {[
            { label: 'Total',     count: posts.length,   color: 'text-dark'    },
            { label: 'Published', count: publishedCount, color: 'text-success' },
            { label: 'Drafts',    count: draftCount,     color: 'text-amber-600' },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 text-center">
              <p className={cn('font-display text-2xl font-bold', color)}>{count}</p>
              <p className="text-dark/50 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
            />
          </div>
          {/* Status filter */}
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-dark/15 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" />
          </div>
          {/* Category filter */}
          <div className="relative">
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              className="appearance-none bg-white border border-dark/15 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
              <option value="all">All Categories</option>
              {BLOG_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" />
          </div>
          {(search || statusFilter !== 'all' || catFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setCatFilter('all') }}
              className="text-xs text-primary hover:underline">Clear</button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-dark/8 bg-muted/30">
                  {['Cover', 'Title', 'Category', 'Status', 'Date', 'Views', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-dark/40 text-sm">No posts match your filters.</td></tr>
                ) : filtered.map((post, i) => (
                  <tr key={post.slug} className={cn('border-b border-dark/5 hover:bg-muted/20 transition-colors', i % 2 !== 0 && 'bg-muted/10')}>
                    {/* Cover */}
                    <td className="px-4 py-3 w-14">
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="40px" />
                      </div>
                    </td>
                    {/* Title */}
                    <td className="px-5 py-3 max-w-[280px]">
                      <p className="font-medium text-dark text-sm leading-snug line-clamp-2">{post.title}</p>
                      <p className="text-dark/35 text-xs font-mono mt-0.5 truncate">/blog/{post.slug}</p>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap', CAT_COLORS[post.category] ?? 'bg-muted text-dark/60')}>
                        {catLabel(post.category)}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold', post.status === 'published' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-700')}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-5 py-3 text-dark/50 text-xs whitespace-nowrap">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
                        : <span className="text-dark/30">—</span>}
                    </td>
                    {/* Views */}
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-dark/60 text-xs font-mono">
                        <BarChart2 size={11} className="text-dark/30" />
                        {post.views > 0 ? post.views.toLocaleString() : '—'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        {post.status === 'published' && (
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors">
                            <Eye size={14} />
                          </a>
                        )}
                        <Link href={`/admin/blog/${post.slug}/edit`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteSlug(post.slug)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-danger hover:bg-danger/8 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-dark/5">
              <p className="text-xs text-dark/40">Showing <span className="font-medium text-dark">{filtered.length}</span> of <span className="font-medium text-dark">{posts.length}</span> posts</p>
            </div>
          )}
        </div>
      </div>

      {deleteSlug && deletePost && (
        <DeleteDialog post={deletePost} onConfirm={handleDelete} onCancel={() => setDeleteSlug(null)} />
      )}
    </>
  )
}
