'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Briefcase, Video } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Reusable card wrapper ────────────────────────────────────────────────────

function CardLink({ slug, children, className }: { slug: string; children: React.ReactNode; className: string }) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Link href={`/services/${slug}`} className="block h-full">
        {children}
      </Link>
    </motion.div>
  )
}

// ─── Card A — Image card ──────────────────────────────────────────────────────

function ImageCard({ slug, title, price, image, height = 'h-72' }: {
  slug: string; title: string; price: number; image: string; height?: string
}) {
  return (
    <Link href={`/services/${slug}`} className={`relative ${height} rounded-2xl overflow-hidden block group`}>
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="font-display text-xl text-white font-bold leading-snug">{title}</p>
        <p className="text-white/65 text-sm font-mono mt-1">From {formatPrice(price)}</p>
      </div>
    </Link>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EditorialServicesGrid() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({ amount: 0.2 })
  const { ref: row1Ref,   isInView: row1InView   } = useScrollAnimation({ amount: 0.1 })
  const { ref: row2Ref,   isInView: row2InView   } = useScrollAnimation({ amount: 0.1 })

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight">
            Organize Every Corner
          </h2>
          <p className="text-dark/50 text-base max-w-xs leading-relaxed sm:text-right">
            From a single drawer to an entire home — we handle it all.
          </p>
        </motion.div>

        {/* ── Row 1 ───────────────────────────────────────────────────────── */}
        <motion.div
          ref={row1Ref}
          variants={staggerContainer}
          initial="initial"
          animate={row1InView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 mb-4"
        >
          {/* Card A — Large image: General Decluttering */}
          <motion.div variants={staggerItem} className="sm:col-span-2 lg:col-span-5">
            <ImageCard
              slug="general-decluttering"
              title="General Decluttering"
              price={5000}
              image="/images/services/decluttering-after-1.jpg"
            />
          </motion.div>

          {/* Card B — Red featured: Whole House */}
          <CardLink
            slug="whole-house-organizing"
            className="lg:col-span-4"
          >
            <div className="bg-primary rounded-2xl p-6 sm:p-8 h-72 flex flex-col justify-between hover:bg-primary/95 transition-colors">
              <Sparkles size={36} className="text-white/30" aria-hidden="true" />
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-white leading-snug">
                  Whole House Organizing
                </h3>
                <p className="font-mono text-white/65 text-sm mt-2">From {formatPrice(15000)}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 text-xs uppercase tracking-widest">Explore</span>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowRight size={16} className="text-primary" aria-hidden="true" />
                </div>
              </div>
            </div>
          </CardLink>

          {/* Card C — Muted: Moving House */}
          <CardLink
            slug="moving-house"
            className="lg:col-span-3"
          >
            <div className="bg-muted rounded-2xl p-6 h-72 flex flex-col justify-between hover:bg-dark/5 transition-colors">
              <div>
                <span className="inline-block bg-dark text-white text-xs font-medium rounded-full px-3 py-1">
                  Most Booked
                </span>
              </div>
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-dark leading-snug">
                  Moving House
                </h3>
                <p className="font-mono text-primary text-sm mt-2">{formatPrice(8000)}</p>
              </div>
              <p className="text-dark/40 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <ArrowRight size={13} />
              </p>
            </div>
          </CardLink>
        </motion.div>

        {/* ── Row 2 ───────────────────────────────────────────────────────── */}
        <motion.div
          ref={row2Ref}
          variants={staggerContainer}
          initial="initial"
          animate={row2InView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4"
        >
          {/* Card D — Dark: Office Organizing */}
          <CardLink
            slug="office-organizing"
            className="lg:col-span-3"
          >
            <div className="bg-dark rounded-2xl p-6 h-64 flex flex-col justify-between hover:bg-dark/90 transition-colors">
              <Briefcase size={30} className="text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-white leading-snug">
                  Office Organizing
                </h3>
                <p className="text-white/45 text-sm mt-2">Workspaces that work</p>
              </div>
            </div>
          </CardLink>

          {/* Card E — Large image: Shelving & Storage */}
          <motion.div variants={staggerItem} className="sm:col-span-2 lg:col-span-6">
            <ImageCard
              slug="shelving-and-storage"
              title="Shelving & Storage"
              price={6000}
              image="/images/services/shelving-after-1.jpg"
              height="h-64"
            />
          </motion.div>

          {/* Card F — Muted: Online Coaching */}
          <CardLink
            slug="online-coaching"
            className="lg:col-span-3"
          >
            <div className="bg-muted rounded-2xl p-6 h-64 flex flex-col justify-between hover:bg-dark/5 transition-colors">
              <Video size={30} className="text-primary" aria-hidden="true" />
              <div>
                <h3 className="font-display text-xl text-dark leading-snug">
                  Online Coaching
                </h3>
                <p className="text-dark/45 text-sm mt-2">Transform your space remotely</p>
                <p className="font-mono text-primary text-sm mt-4">{formatPrice(3000)}</p>
              </div>
            </div>
          </CardLink>
        </motion.div>

        {/* ── View all services CTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={row2InView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4, ease: EASE_STANDARD }}
          className="flex justify-center mt-10"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-dark/50 hover:text-dark text-sm font-medium transition-colors group"
          >
            View all {' '}
            <span className="text-primary font-semibold">11 services</span>
            <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
