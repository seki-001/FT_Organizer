'use client'

import Link from 'next/link'
import { motion, useMotionValue, useTransform, useInView, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedStat({ value, suffix = '', duration = 1.8 }: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref      = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const isInView  = useInView(ref, { once: true, margin: '-40px' })
  const isDecimal = !Number.isInteger(value)

  const display = useTransform(motionVal, (v) =>
    (isDecimal ? v.toFixed(1) : Math.round(v).toString()) + suffix
  )

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [isInView, motionVal, value, duration])

  return (
    <span ref={ref} className="font-display text-4xl text-white tabular-nums">
      <motion.span>{display}</motion.span>
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const STATS = [
  { label: 'Homes Organized',  value: 500,  suffix: '+' },
  { label: 'Years Experience', value: 7,    suffix: '+' },
  { label: 'Client Rating',    value: 4.9,  suffix: '★' },
]

export default function BoldStatsBlock() {
  const { ref: leftRef,  isInView: leftInView  } = useScrollAnimation({ amount: 0.2 })
  const { ref: rightRef, isInView: rightInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <section className="w-full bg-dark py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-20">

          {/* ── Left: Headline ──────────────────────────────────────────── */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -24 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
            className="flex-1"
          >
            <h2 className="font-display text-5xl md:text-6xl text-white leading-[1.05]">
              500+ Homes
              <br />
              <span className="text-primary">Transformed</span>
              <br />
              in Nairobi.
            </h2>

            <p className="text-white/40 mt-6 max-w-sm text-base leading-relaxed">
              From Westlands to Karen, Runda to Kilimani — we&apos;ve organized
              homes across the city.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm mt-8 animated-link transition-colors group"
            >
              Read Our Story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* ── Right: Stat cards ────────────────────────────────────────── */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 24 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_STANDARD }}
            className="flex-1 space-y-4"
          >
            {STATS.map(({ label, value, suffix }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={rightInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: EASE_STANDARD }}
                className="bg-white/5 rounded-2xl px-6 py-5 flex justify-between items-center
                           border border-white/5 hover:bg-white/8 transition-colors"
              >
                <span className="text-white/50 text-sm font-medium">{label}</span>
                <AnimatedStat value={value} suffix={suffix} duration={1.6 + i * 0.1} />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
