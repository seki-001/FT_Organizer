'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE_STANDARD } from '@/lib/animations'

// ─── Animation variants ───────────────────────────────────────────────────────

const FADE_IN  = { initial: { opacity: 0 },         animate: { opacity: 1 } }
const FADE_UP  = { initial: { opacity: 0, y: 24 },  animate: { opacity: 1, y: 0 } }

function transition(duration: number, delay = 0) {
  return { duration, ease: EASE_STANDARD, delay }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, -50])

  return (
    <section className="relative bg-surface overflow-hidden">

      {/* ── Two-panel layout ───────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row min-h-[88vh] lg:min-h-[92vh]">

        {/* ── Left panel — content (55%) ──────────────────────────────────── */}
        <div className="flex-[55] flex items-center px-6 sm:px-12 lg:px-16 xl:px-20 py-20 lg:py-28 order-2 lg:order-1">
          <div className="w-full max-w-xl">

            {/* Label */}
            <motion.p
              {...FADE_IN}
              transition={transition(0.3)}
              className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-5"
            >
              Nairobi&apos;s #1 Home Organizer
            </motion.p>

            {/* Headline */}
            <motion.h1
              {...FADE_UP}
              transition={transition(0.5, 0.1)}
              className="font-display text-5xl lg:text-6xl xl:text-7xl text-dark leading-[1.05] font-bold"
            >
              From Clutter
              <br />
              <span className="text-primary">to Order.</span>
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              {...FADE_UP}
              transition={transition(0.5, 0.2)}
              className="text-dark/60 text-lg mt-6 max-w-sm leading-relaxed"
            >
              We transform Nairobi homes and offices into calm, functional spaces. 
              Professional organizing, decluttering and more.
            </motion.p>

            {/* CTA row */}
            <motion.div
              {...FADE_UP}
              transition={transition(0.5, 0.3)}
              className="flex flex-wrap items-center gap-2 mt-8"
            >
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/book"
                  className="inline-flex items-center bg-primary hover:bg-primary/90 text-white font-medium px-7 py-3.5 rounded-lg transition-colors duration-200 text-sm"
                >
                  Book a Service
                </Link>
              </motion.div>

              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-dark/70 hover:text-primary font-medium px-4 py-3.5 transition-colors duration-200 text-sm"
              >
                Shop Products
                <ArrowRight
                  size={15}
                  className="translate-x-0 group-hover:translate-x-1.5 transition-transform duration-200"
                />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              {...FADE_IN}
              transition={transition(0.5, 0.5)}
              className="flex items-center gap-0 mt-12 flex-wrap"
            >
              {[
                '500+ Homes',
                '7 Years',
                '4.9★ Rating',
              ].map((item, i) => (
                <span key={item} className="flex items-center gap-0">
                  {i > 0 && <span className="w-px h-3.5 bg-dark/15 mx-4 flex-shrink-0" aria-hidden="true" />}
                  <span className="text-xs text-dark/50 uppercase tracking-wider font-medium whitespace-nowrap">
                    {item}
                  </span>
                </span>
              ))}
            </motion.div>

          </div>
        </div>

        {/* ── Right panel — image (45%) ────────────────────────────────────── */}
        <div className="flex-[45] relative overflow-hidden order-1 lg:order-2 min-h-[55vw] sm:min-h-[420px] lg:min-h-0">

          {/* Hero image — slides in from right, parallax on scroll */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ y: imageY }}
            transition={{ duration: 0.7, ease: EASE_STANDARD }}
          >
            <Image
              src="/images/hero/hero-main.jpg"
              alt="Organized living room background — Faith The Organizer"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </motion.div>

          {/* Floating transformation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_STANDARD, delay: 0.6 }}
            className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-10 bg-white rounded-2xl p-4 shadow-xl max-w-[220px]"
          >
            <p className="text-[10px] font-semibold text-dark/40 uppercase tracking-widest mb-2.5">
              Latest Transformation
            </p>
            {/* Before / After thumbnails */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src="/images/hero/transformation-before.jpg"
                  alt="Cluttered room before Faith The Organizer service"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <ArrowRight size={12} className="text-dark/25 flex-shrink-0" />
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src="/images/hero/transformation-after.jpg"
                  alt="Clean organized room after Faith The Organizer service"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </div>
            <p className="text-xs font-medium text-dark leading-snug">Karen, Nairobi</p>
            <p className="text-[11px] text-dark/45 mt-0.5">3-bedroom home</p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
