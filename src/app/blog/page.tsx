'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { MOCK_POSTS } from '@/lib/mock-posts'
import type { BlogCategory } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Types + constants ────────────────────────────────────────────────────────

type FilterCategory = BlogCategory | 'all'

const FILTER_TABS: { value: FilterCategory; label: string }[] = [
  { value: 'all',              label: 'All'           },
  { value: 'home-tips',        label: 'Home Tips'     },
  { value: 'office',           label: 'Office'        },
  { value: 'before-and-after', label: 'Before & After'},
  { value: 'product-reviews',  label: 'Product Reviews'},
]

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  'home-tips':        'Home Tips',
  'office':           'Office',
  'before-and-after': 'Before & After',
  'product-reviews':  'Product Reviews',
  'nairobi-living':   'Nairobi Living',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function authorInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0][0]
}

// ─── Post card variants ───────────────────────────────────────────────────────

// Large card (row 1, col-span-8, h-96)
function LargePostCard({ post }: { post: typeof MOCK_POSTS[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="rounded-2xl overflow-hidden border border-dark/8 bg-white hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-64 overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Image src={post.coverImage} alt={post.title} fill className="object-cover"
                   sizes="(max-width: 1024px) 100vw, 66vw" />
          </motion.div>
        </div>
        <div className="p-6">
          <span className="text-primary text-xs uppercase tracking-[0.18em] font-medium">
            {CATEGORY_LABELS[post.category] ?? post.category}
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-dark leading-snug mt-2
                         group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-dark/55 text-sm mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-2 mt-4 text-dark/35 text-xs font-mono">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {post.readTime} min read
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Small horizontal card (row 1, stacked)
function SmallHorizontalCard({ post }: { post: typeof MOCK_POSTS[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="flex h-[9.5rem] rounded-2xl overflow-hidden border border-dark/8 bg-white
                      hover:shadow-md transition-shadow duration-200">
        <div className="relative w-32 shrink-0 overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="128px" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-between p-4 min-w-0">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.15em] font-medium">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <h3 className="font-display text-base text-dark leading-snug mt-0.5 line-clamp-2
                           group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>
          <time className="text-dark/35 text-xs font-mono" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}

// Standard card (rows 2 + 3, h-64)
function StandardPostCard({ post }: { post: typeof MOCK_POSTS[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-64">
      <div className="h-full flex flex-col rounded-2xl overflow-hidden border border-dark/8 bg-white
                      hover:shadow-md transition-shadow duration-200">
        <div className="relative h-36 shrink-0 overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Image src={post.coverImage} alt={post.title} fill className="object-cover"
                   sizes="(max-width: 1024px) 100vw, 33vw" />
          </motion.div>
        </div>
        <div className="flex flex-col justify-between p-4 flex-1">
          <div>
            <span className="text-primary text-xs uppercase tracking-[0.15em] font-medium">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
            <h3 className="font-display text-base sm:text-lg text-dark leading-snug mt-1 line-clamp-2
                           group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>
          <time className="text-dark/35 text-xs font-mono mt-2" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Link>
  )
}

// ─── Newsletter Band ──────────────────────────────────────────────────────────

function NewsletterBand() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const { ref, isInView } = useScrollAnimation({ amount: 0.3 })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res  = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json() as { success: boolean; message?: string }
      if (data.success) { setStatus('success'); setMessage(data.message ?? "You're in!") }
      else { setStatus('error'); setMessage('Something went wrong. Please try again.') }
    } catch {
      setStatus('error'); setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="bg-dark py-16 text-center">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE_STANDARD }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="font-display text-3xl md:text-4xl text-white leading-tight">
          Organizing Tips, Straight to Your Inbox
        </h2>
        <p className="text-white/45 mt-4 mb-8 text-base max-w-md mx-auto leading-relaxed">
          Join Nairobi homeowners getting weekly organizing tips from Faith.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-4 rounded-xl">
            <CheckCircle2 size={18} />
            <span className="font-medium text-sm">{message}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex bg-white/10 rounded-xl overflow-hidden max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={status === 'loading'}
              className="flex-1 bg-transparent text-white placeholder-white/40 px-6 py-4 text-sm
                         outline-none focus:ring-0 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-medium
                         px-8 py-4 text-sm whitespace-nowrap transition-colors"
            >
              {status === 'loading' ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-white/60 text-sm mt-3">{message}</p>
        )}
      </motion.div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogIndexPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  const [featured, ...rest] = MOCK_POSTS
  const filtered = activeFilter === 'all' ? rest : rest.filter((p) => p.category === activeFilter)

  // Distribute posts into bento slots
  const [p0, p1, p2, p3, p4, ...extra] = filtered

  const { ref: row1Ref, isInView: row1InView } = useScrollAnimation({ amount: 0.08 })
  const { ref: row2Ref, isInView: row2InView } = useScrollAnimation({ amount: 0.08 })
  const { ref: row3Ref, isInView: row3InView } = useScrollAnimation({ amount: 0.08 })

  const today = new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main className="bg-dark">

      {/* ── 1. MAGAZINE MASTHEAD ─────────────────────────────────────────── */}
      <header className="bg-surface py-16 lg:py-24 border-b border-dark/8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Row 1 — Thin label + rule */}
          <div className="mb-6">
            <p className="text-[11px] tracking-[0.42em] uppercase text-dark/30 mb-3">
              The Organized Life
            </p>
            <hr className="border-t border-dark/10" />
          </div>

          {/* Row 2 — Three columns */}
          <div className="grid grid-cols-3 items-end gap-4 py-6">
            {/* Left: issue info */}
            <div className="hidden sm:block text-xs text-dark/40 leading-relaxed">
              <p>Est. 2018 · Nairobi, Kenya</p>
              <p className="mt-1">Home · Office · Life</p>
            </div>

            {/* Center: masthead title */}
            <div className="col-span-3 sm:col-span-1 text-center">
              <h1 className="font-display text-6xl md:text-7xl text-dark leading-none">
                Organized
                <br />
                Living
              </h1>
            </div>

            {/* Right: byline */}
            <div className="hidden sm:block text-xs text-dark/40 text-right leading-relaxed">
              <p>By Faith The Organizer</p>
              <p className="mt-1">{today}</p>
            </div>
          </div>

          <hr className="border-t border-dark/10 mt-2" />
        </div>
      </header>

      {/* ── 2. FEATURED STORY ────────────────────────────────────────────── */}
      <section className="bg-dark py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-0 rounded-2xl overflow-hidden
                        border border-dark/8 bg-white group hover:shadow-lg transition-shadow duration-300">
          {/* Image */}
          <div className="relative aspect-video md:aspect-auto md:min-h-[400px] overflow-hidden bg-muted">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <span className="text-primary text-xs uppercase tracking-[0.22em] font-medium">
              {CATEGORY_LABELS[featured.category] ?? featured.category}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-dark leading-tight mt-3">
              {featured.title}
            </h2>

            <p className="text-dark/60 text-base sm:text-lg mt-5 leading-relaxed line-clamp-3">
              {featured.excerpt}
            </p>

            {/* Author row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-7">
              <div className="w-9 h-9 rounded-full bg-dark flex items-center justify-center
                              text-white text-xs font-bold uppercase shrink-0">
                {authorInitials(featured.author)}
              </div>
              <span className="font-medium text-dark text-sm">{featured.author}</span>
              <span className="text-dark/30">·</span>
              <time className="text-dark/40 text-sm" dateTime={featured.publishedAt}>
                {formatDate(featured.publishedAt)}
              </time>
              <span className="text-dark/30">·</span>
              <span className="flex items-center gap-1 text-dark/40 text-sm">
                <Clock size={13} /> {featured.readTime} min read
              </span>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="inline-flex items-center gap-2 bg-primary text-white font-medium
                         px-6 py-3 rounded-lg mt-7 w-fit hover:bg-primary/90 transition-colors text-sm"
            >
              Read Article <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
      </section>

      <section className="bg-dark py-16 lg:py-24">
      {/* ── 3. CATEGORY FILTER ───────────────────────────────────────────── */}
      <div className="border-y border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center gap-2">
          <span className="text-white/40 text-sm mr-2 shrink-0">Filter:</span>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border',
                activeFilter === tab.value
                  ? 'bg-white text-dark border-white font-semibold'
                  : 'border-white/15 text-white/50 hover:border-white/30 hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. BENTO POSTS GRID ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-4">

        {/* Row 1: Large + two stacked */}
        {p0 && (
          <motion.div
            ref={row1Ref}
            variants={staggerContainer}
            initial="initial"
            animate={row1InView ? 'animate' : 'initial'}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4"
          >
            <motion.div variants={staggerItem} className="lg:col-span-8">
              <LargePostCard post={p0} />
            </motion.div>
            {(p1 || p2) && (
              <motion.div variants={staggerItem} className="lg:col-span-4 flex flex-col gap-4">
                {p1 && <SmallHorizontalCard post={p1} />}
                {p2 && <SmallHorizontalCard post={p2} />}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Row 2: Red editorial card + 2 posts */}
        {(p3 || p4) && (
          <motion.div
            ref={row2Ref}
            variants={staggerContainer}
            initial="initial"
            animate={row2InView ? 'animate' : 'initial'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4"
          >
            {/* Red editorial card — always shown */}
            <motion.div variants={staggerItem} className="lg:col-span-4">
              <div className="bg-primary rounded-2xl p-8 h-64 flex flex-col justify-between">
                <p className="text-xs tracking-widest uppercase text-white/50 font-medium">
                  Featured Tip
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                  5 Signs You Need a Professional Organizer
                </h3>
                <Link
                  href="/blog/5-signs-you-need-professional-organizer"
                  className="text-white/65 hover:text-white text-sm animated-link
                             inline-flex items-center gap-1 transition-colors"
                >
                  Read Article <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>

            {p3 && (
              <motion.div variants={staggerItem} className="lg:col-span-4">
                <StandardPostCard post={p3} />
              </motion.div>
            )}
            {p4 && (
              <motion.div variants={staggerItem} className="lg:col-span-4">
                <StandardPostCard post={p4} />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Row 3: Three equal cards */}
        {extra.length > 0 && (
          <motion.div
            ref={row3Ref}
            variants={staggerContainer}
            initial="initial"
            animate={row3InView ? 'animate' : 'initial'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {extra.slice(0, 3).map((post) => (
              <motion.div key={post.slug} variants={staggerItem}>
                <StandardPostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-dark/40">
            <p className="text-lg font-display">No posts in this category yet.</p>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-dark/50 hover:text-dark text-sm font-medium"
            >
              View all posts
            </button>
          </div>
        )}
      </div>

      {/* ── 5. NEWSLETTER BAND ───────────────────────────────────────────── */}
      <AnimatePresence>
        <NewsletterBand />
      </AnimatePresence>
      </section>

    </main>
  )
}
