'use client'

import { useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, CheckCheck, Link2, MessageCircle, Facebook, ArrowLeft } from 'lucide-react'
import { useState, useCallback } from 'react'
import { MOCK_POSTS } from '@/lib/mock-posts'
import { COMPANY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { BlogPost, BlogCategory } from '@/lib/types'
import BlogPostSidebar from '../_components/BlogPostSidebar'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'home-tips':        'Home Tips',
  'office':           'Office',
  'before-and-after': 'Before & After',
  'product-reviews':  'Product Reviews',
  'nairobi-living':   'Nairobi Living',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
}

function authorInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0][0]
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Content renderer — converts markdown headings + paragraphs to JSX ───────

function renderContent(content: string) {
  return content.split('\n\n').map((block, i) => {
    const trimmed = block.trim()
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3)
      const id   = slugify(text)
      return (
        <h2 key={i} id={id} className="font-display text-2xl sm:text-3xl text-dark mt-10 mb-4 leading-snug">
          {text}
        </h2>
      )
    }
    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4)
      const id   = slugify(text)
      return (
        <h3 key={i} id={id} className="font-display text-xl text-dark mt-8 mb-3 leading-snug">
          {text}
        </h3>
      )
    }
    return (
      <p key={i} className="text-dark/75 leading-relaxed text-lg mb-0">
        {trimmed}
      </p>
    )
  })
}

// ─── Mobile share bar ─────────────────────────────────────────────────────────

function MobileShareBar({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : `https://organizer.co.ke/blog/${slug}`
  const waUrl  = `https://wa.me/?text=${encodeURIComponent(`${title} — ${pageUrl}`)}`
  const fbUrl  = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`
  const copy   = useCallback(async () => {
    try { await navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }, [pageUrl])

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      <a href={waUrl} target="_blank" rel="noopener noreferrer"
         className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
        <MessageCircle size={13} /> WhatsApp
      </a>
      <a href={fbUrl} target="_blank" rel="noopener noreferrer"
         className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
        <Facebook size={13} /> Facebook
      </a>
      <button type="button" onClick={copy}
              className={cn('flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors',
                             copied ? 'bg-green-50 text-green-700' : 'bg-muted text-dark/60 hover:bg-dark/10')}>
        {copied ? <CheckCheck size={13} /> : <Link2 size={13} />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}

// ─── Related post card ────────────────────────────────────────────────────────

function RelatedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="rounded-2xl overflow-hidden border border-dark/8 bg-white hover:shadow-md transition-shadow duration-200">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Image src={post.coverImage} alt={post.title} fill className="object-cover"
                   sizes="(max-width: 1024px) 100vw, 33vw" />
          </motion.div>
        </div>
        <div className="p-5">
          <span className="text-primary text-xs uppercase tracking-[0.15em] font-medium">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <h3 className="font-display text-lg text-dark leading-snug mt-1 line-clamp-2
                         group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <time className="text-dark/35 text-xs font-mono mt-2 block" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const params = useParams()
  const slug   = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''

  const [post, setPost] = useState<BlogPost | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>(MOCK_POSTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/blog/${slug}`).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/blog').then((r) => r.json()),
    ])
      .then(([single, list]: [{ post?: BlogPost } | null, { posts?: BlogPost[] }]) => {
        if (single?.post) setPost(single.post)
        if (list?.posts?.length) setAllPosts(list.posts)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <main className="bg-dark min-h-screen flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading article…</p>
      </main>
    )
  }

  if (!post) notFound()

  const related = allPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3)

  return (
    <main className="bg-dark">

      {/* ── 1. POST HERO ─────────────────────────────────────────────────── */}
      <header className="bg-white py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">

          {/* Back link */}
          <Link href="/blog"
                className="inline-flex items-center gap-1.5 text-dark/35 hover:text-dark text-sm mb-8 transition-colors">
            <ArrowLeft size={13} /> Back to Blog
          </Link>

          <p className="text-primary text-xs uppercase tracking-[0.22em] font-medium">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-dark leading-tight
                         mt-4 max-w-3xl mx-auto">
            {post.title}
          </h1>

          <p className="text-dark/50 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author row */}
          <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center
                            text-white text-xs font-bold uppercase shrink-0">
              {authorInitials(post.author)}
            </div>
            <div className="text-left">
              <p className="text-dark font-medium text-sm">{post.author}</p>
              <div className="flex items-center gap-2 text-dark/40 text-xs font-mono mt-0.5">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {post.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Cover image ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-12">
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
          </motion.div>
        </div>
      </div>

      {/* ── 2. CONTENT + SIDEBAR ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Article */}
          <div className="lg:col-span-8">
            <article
              data-blog
              className="space-y-6 prose prose-lg prose-headings:font-display
                         prose-headings:text-dark prose-a:text-primary prose-a:no-underline
                         hover:prose-a:underline prose-strong:text-dark prose-img:rounded-2xl
                         prose-blockquote:border-primary max-w-none"
            >
              {renderContent(post.content)}
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-dark/8">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-muted text-dark/55 text-xs px-3 py-1.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile share */}
            <div className="lg:hidden mt-8 pt-6 border-t border-dark/8">
              <p className="text-[10px] uppercase tracking-widest text-dark/30 font-medium mb-3">
                Share This
              </p>
              <MobileShareBar title={post.title} slug={post.slug} />
            </div>

            {/* Author box */}
            <div className="bg-muted rounded-2xl p-6 mt-10 flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center
                              text-white font-bold text-lg uppercase shrink-0">
                {authorInitials(post.author)}
              </div>
              <div>
                <p className="text-dark/40 text-xs uppercase tracking-widest mb-1">Written by</p>
                <p className="font-display text-lg text-dark">{post.author}</p>
                <p className="text-dark/55 text-sm leading-relaxed mt-2">
                  Faith is Nairobi&apos;s leading professional organizer, helping hundreds of homes and
                  offices go From Clutter to Order since 2018. She shares practical tips and real
                  transformations on this blog every week.
                </p>
                <Link href="/blog" className="text-dark/50 hover:text-dark text-sm font-medium mt-2 inline-block">
                  View all posts →
                </Link>
              </div>
            </div>

            {/* Comments / WhatsApp CTA */}
            <div className="mt-8 border border-dark/8 rounded-2xl p-6 text-center bg-white">
              <p className="font-display text-xl text-dark">Have a question or tip to share?</p>
              <p className="text-dark/55 text-sm mt-1 mb-4">We&apos;d love to hear from you.</p>
              <a
                href={COMPANY.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                           font-medium px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Sticky sidebar — desktop only */}
          <BlogPostSidebar slug={post.slug} title={post.title} />

        </div>
      </div>

      {/* ── 3. MORE FROM THE BLOG ─────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="w-full bg-muted py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <h2 className="font-display text-3xl md:text-4xl text-dark text-center mb-12">
              More From The Blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <RelatedPostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}
