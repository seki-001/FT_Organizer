'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

const PREVIEW_ITEMS = [
  {
    id: 1,
    location: 'Karen, Nairobi',
    service: 'Organizing',
    before: '/images/services/whole-house-before-1.jpg',
    after: '/images/services/whole-house-after-1.jpg',
  },
  {
    id: 2,
    location: 'Westlands, Nairobi',
    service: 'Decluttering',
    before: '/images/services/decluttering-before-1.jpg',
    after: '/images/services/decluttering-after-1.jpg',
  },
  {
    id: 3,
    location: 'Kilimani, Nairobi',
    service: 'Storage',
    before: '/images/services/shelving-before-1.jpg',
    after: '/images/services/shelving-after-1.jpg',
  },
  {
    id: 4,
    location: 'Runda, Nairobi',
    service: 'Relocation',
    before: '/images/services/moving-before-1.jpg',
    after: '/images/services/moving-after-1.jpg',
  },
] as const

export default function HomePortfolioPreview() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({ amount: 0.3 })
  const { ref: stripRef, isInView: stripInView } = useScrollAnimation({ amount: 0.1 })
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <section className="section-padding bg-muted overflow-hidden">
      <div className="section-container">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          <SectionHeading
            eyebrow="Portfolio"
            title="Before & after preview"
            subtitle="Sample project imagery from our work across Nairobi. More transformations on the portfolio page."
            align="center"
          />
          <p className="text-center text-xs text-dark/45 -mt-6 mb-8 max-w-md mx-auto">
            Illustrative preview — not a guarantee of specific outcomes for every project.
          </p>
        </motion.div>

        <motion.div
          ref={stripRef}
          initial={{ opacity: 0, y: 12 }}
          animate={stripInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE_STANDARD }}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {PREVIEW_ITEMS.map((t) => (
              <article
                key={t.id}
                className="w-[min(85vw,320px)] sm:w-80 flex-shrink-0 card-surface p-4 snap-start"
              >
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1.5">Before</p>
                    <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
                      <Image src={t.before} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-dark/40 mb-1.5">After</p>
                    <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
                      <Image src={t.after} alt="" fill className="object-cover" sizes="160px" />
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-dark">{t.location}</p>
                <span className="inline-block mt-2 text-xs bg-muted text-dark/55 rounded-full px-3 py-1">
                  {t.service}
                </span>
              </article>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-danger transition-colors"
            >
              View full portfolio
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
