'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

// ─── Mock transformations ─────────────────────────────────────────────────────

const TRANSFORMATIONS = [
  {
    id: 1,
    location: 'Karen, Nairobi',
    service: 'Whole House',
    before: '/images/services/whole-house-before-1.jpg',
    after:  '/images/services/whole-house-after-1.jpg',
  },
  {
    id: 2,
    location: 'Westlands, Nairobi',
    service: 'Kitchen',
    before: '/images/services/decluttering-before-1.jpg',
    after:  '/images/services/decluttering-after-1.jpg',
  },
  {
    id: 3,
    location: 'Kilimani, Nairobi',
    service: 'Closet',
    before: '/images/services/shelving-before-1.jpg',
    after:  '/images/services/shelving-after-1.jpg',
  },
  {
    id: 4,
    location: 'Runda, Nairobi',
    service: 'Moving House',
    before: '/images/services/moving-before-1.jpg',
    after:  '/images/services/moving-after-1.jpg',
  },
  {
    id: 5,
    location: 'Lavington, Nairobi',
    service: 'Shelving',
    before: '/images/services/shelving-before-1.jpg',
    after:  '/images/services/shelving-after-1.jpg',
  },
  {
    id: 6,
    location: 'Parklands, Nairobi',
    service: 'Office',
    before: '/images/services/office-before-1.jpg',
    after:  '/images/services/office-after-1.jpg',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransformationShowcase() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({ amount: 0.4 })
  const { ref: stripRef,  isInView: stripInView  } = useScrollAnimation({ amount: 0.1 })
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full bg-muted py-16 md:py-24 overflow-hidden">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: EASE_STANDARD }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12"
      >
        <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight">
          The Results Speak
          <br />
          for Themselves
        </h2>
        <p className="text-dark/50 mt-4 text-base max-w-md mx-auto">
          Real Nairobi homes, real transformations.
        </p>
      </motion.div>

      {/* ── Scroll strip ─────────────────────────────────────────────────── */}
      <motion.div
        ref={stripRef}
        initial={{ opacity: 0, y: 16 }}
        animate={stripInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: EASE_STANDARD }}
        className="relative"
      >
        {/* Fade-out edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20
                        bg-gradient-to-r from-muted to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20
                        bg-gradient-to-l from-muted to-transparent z-10" />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-8 pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {TRANSFORMATIONS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={stripInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.05 * i, ease: EASE_STANDARD }}
              className="w-72 sm:w-80 flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Before / After images */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-dark/35 font-medium mb-1.5">
                    Before
                  </p>
                  <div className="relative h-44 rounded-xl overflow-hidden bg-muted">
                    <Image src={t.before} alt={`Before — ${t.location}`} fill className="object-cover"
                           sizes="150px" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-dark/35 font-medium mb-1.5">
                    After
                  </p>
                  <div className="relative h-44 rounded-xl overflow-hidden bg-muted">
                    <Image src={t.after} alt={`After — ${t.location}`} fill className="object-cover"
                           sizes="150px" />
                  </div>
                </div>
              </div>

              {/* Meta */}
              <p className="text-sm text-dark/60 font-medium">{t.location}</p>
              <div className="mt-2">
                <span className="inline-block bg-dark/8 text-dark/50 text-xs font-medium
                                 rounded-full px-3 py-1">
                  {t.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint on mobile */}
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1 justify-center mt-6 md:hidden text-dark/30"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronRight size={14} />
        </motion.div>
      </motion.div>

    </section>
  )
}
