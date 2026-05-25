'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface StatItem {
  value:  number
  suffix: string
  label:  string
}

const STATS: StatItem[] = [
  { value: 500, suffix: '+', label: 'Homes Organized' },
  { value: 7,   suffix: '+', label: 'Years Experience' },
  { value: 4.9, suffix: '★', label: 'Client Rating'   },
]

// ─── Animated counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const motionValue = useMotionValue(0)
  const ref         = useRef<HTMLSpanElement>(null)
  const isInView    = useInView(ref, { once: true, margin: '-80px' })
  const isDecimal   = !Number.isInteger(value)

  const display = useTransform(motionValue, (latest) =>
    isDecimal ? latest.toFixed(1) : Math.round(latest).toString()
  )

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionValue, value, {
      duration: 1.8,
      ease: EASE_SPRING_ARRAY,
    })
    return controls.stop
  }, [isInView, motionValue, value])

  return (
    <span ref={ref} className="font-display text-5xl font-bold text-white tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// Framer-motion animate() requires a plain array, not a const tuple
const EASE_SPRING_ARRAY: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Section ─────────────────────────────────────────────────────────────────

export default function StatsSection() {
  // useScrollAnimation drives the section reveal
  const { ref: sectionRef, isInView } = useScrollAnimation({ amount: 0.2 })

  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading fades up when it enters the viewport */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
        >
          {/* Stagger each stat card */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center"
            variants={staggerContainer}
            initial="initial"
            animate={isInView ? 'animate' : 'initial'}
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="flex flex-col items-center gap-3"
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                <p className="text-white/70 text-sm uppercase tracking-widest font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
