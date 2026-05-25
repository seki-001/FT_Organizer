'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Link2, CheckCheck, MessageCircle, Facebook } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TocItem {
  id:    string
  text:  string
  level: number
}

interface BlogPostSidebarProps {
  slug:  string
  title: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlogPostSidebar({ slug, title }: BlogPostSidebarProps) {
  const [toc,      setToc]      = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [copied,   setCopied]   = useState(false)

  // Build TOC by scanning the rendered article for h2/h3 elements
  useEffect(() => {
    const article = document.querySelector('article[data-blog]')
    if (!article) return
    const headings = Array.from(article.querySelectorAll('h2[id], h3[id]'))
    setToc(
      headings.map((el) => ({
        id:    el.id,
        text:  el.textContent ?? '',
        level: parseInt(el.tagName[1], 10),
      }))
    )
  }, [slug])

  // Track active heading with IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-15% 0% -65% 0%' }
    )
    toc.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [toc])

  const pageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${slug}`
      : `https://organizer.co.ke/blog/${slug}`

  const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${pageUrl}`)}`
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <aside className="hidden lg:block lg:col-span-4">
      <div className="sticky top-24 space-y-8">

        {/* ── Table of Contents ──────────────────────────────────────────── */}
        {toc.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-dark/30 font-medium mb-4">
              In This Article
            </p>
            <nav className="space-y-0.5">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={cn(
                    'block py-1.5 text-sm animated-link transition-colors leading-snug',
                    item.level === 3 && 'pl-4 text-xs',
                    activeId === item.id
                      ? 'text-primary font-medium'
                      : 'text-dark/45 hover:text-primary'
                  )}
                >
                  {item.text}
                </a>
              ))}
            </nav>
            <hr className="border-dark/8 mt-6" />
          </div>
        )}

        {/* ── Share ──────────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-dark/30 font-medium mb-4">
            Share This
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
                         bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <MessageCircle size={13} aria-hidden="true" /> WhatsApp
            </a>
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg
                         bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Facebook size={13} aria-hidden="true" /> Facebook
            </a>
            <button
              type="button"
              onClick={copyLink}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors',
                copied ? 'bg-green-50 text-green-700' : 'bg-muted text-dark/60 hover:bg-dark/10'
              )}
            >
              {copied ? <CheckCheck size={13} aria-hidden="true" /> : <Link2 size={13} aria-hidden="true" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <hr className="border-dark/8" />

        {/* ── Book a Service card ─────────────────────────────────────────── */}
        <div className="bg-muted border border-dark/8 rounded-2xl p-6">
          <p className="font-display text-lg text-dark leading-snug">
            Ready to organize your home?
          </p>
          <p className="text-dark/55 text-sm mt-2 mb-5 leading-relaxed">
            Get a free consultation with Faith — Nairobi&apos;s leading professional organizer.
          </p>
          <Link
            href="/book"
            className="block w-full bg-primary text-white text-sm font-medium text-center
                       py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Book a Free Consultation
          </Link>
        </div>

      </div>
    </aside>
  )
}
