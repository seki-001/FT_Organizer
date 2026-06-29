'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Mock posts ───────────────────────────────────────────────────────────────

import { IMG } from '@/lib/image-placeholders'

const POSTS = [
  {
    slug:     'decluttering-guide-nairobi',
    category: 'Decluttering',
    title:    '10 Rules for Decluttering a Nairobi Home Without Losing Your Mind',
    date:     'Mar 12, 2025',
    readTime: '6 min read',
    image:    IMG.blog.tips,
  },
  {
    slug:     'small-kitchen-storage-hacks',
    category: 'Kitchen',
    title:    'Storage Hacks for the Typical Nairobi Kitchen',
    date:     'Feb 28, 2025',
    readTime: '4 min read',
    image:    IMG.blog.kitchen,
  },
  {
    slug:     'moving-house-nairobi-checklist',
    category: 'Moving',
    title:    'The Complete Moving-House Checklist for Nairobi Residents',
    date:     'Feb 14, 2025',
    readTime: '5 min read',
    image:    IMG.blog.moving,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditorialBlogPreview() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.08 })

  return (
    <section className="py-16 md:py-24 section-to-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="section-label text-white/40 mb-3">Blog</p>
            <h2 className="text-white">
              <span className="head-sans text-4xl block">The Organized</span>
              <span className="head-serif italic text-4xl text-accent/90">Life</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors group"
          >
            Visit Blog
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* ── Grid ───────────────────────────────────────────────────────── */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4"
        >

          {/* Post 1 — large (col-span-7) */}
          <motion.div variants={staggerItem} className="lg:col-span-7">
            <Link href={`/blog/${POSTS[0].slug}`} className="block group">
              <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-dark">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Image
                    src={POSTS[0].image}
                    alt={POSTS[0].title}
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </motion.div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-medium
                                   rounded-full px-3 py-1 w-fit border border-white/20">
                    {POSTS[0].category}
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-white leading-snug
                                   group-hover:text-white/90 transition-colors">
                      {POSTS[0].title}
                    </h3>
                    <p className="text-white/55 text-xs mt-2 font-mono">
                      {POSTS[0].date} · {POSTS[0].readTime}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Posts 2 + 3 stacked (col-span-5) */}
          <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col gap-4">
            {POSTS.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="flex rounded-2xl overflow-hidden border border-white/8 bg-white/4
                                hover:border-white/15 transition-colors duration-200 h-36">
                  {/* Image */}
                  <div className="relative w-32 shrink-0 overflow-hidden bg-muted">
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between p-4 min-w-0 flex-1">
                    <div>
                      <span className="text-accent text-xs font-medium uppercase tracking-wider">
                        {post.category}
                      </span>
                      <h3 className="font-display text-sm text-white leading-snug mt-0.5 line-clamp-2
                                     group-hover:text-accent/90 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                    <p className="text-white/35 text-xs font-mono">
                      {post.date} · {post.readTime}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
