'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useInView, animate } from 'framer-motion'

interface UseCountUpOptions {
  /** Target number to count up to */
  end: number
  /** Animation duration in seconds (default 1.5) */
  duration?: number
  /** Number of decimal places to display (default 0) */
  decimals?: number
  /** String appended after the number, e.g. "+" or "★" */
  suffix?: string
}

/**
 * Counts from 0 to `end` once the ref element enters the viewport.
 *
 * Usage:
 *   const { ref, display } = useCountUp({ end: 500, suffix: '+' })
 *   <span ref={ref}>{display}</span>
 */
export function useCountUp({ end, duration = 1.5, decimals = 0, suffix = '' }: UseCountUpOptions) {
  const ref        = useRef<HTMLSpanElement>(null)
  const motionVal  = useMotionValue(0)
  const isInView   = useInView(ref, { once: true, margin: '-60px' })

  // We use a separate ref-based string display to avoid subscribing the component
  // to every frame — callers read `display` via a motion.span instead
  const display = motionVal

  useEffect(() => {
    if (!isInView) return
    const controls = animate(motionVal, end, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [isInView, motionVal, end, duration])

  // Transform the raw number to a formatted string with optional decimals + suffix
  function format(v: number): string {
    return (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()) + suffix
  }

  return { ref, motionVal, format }
}
