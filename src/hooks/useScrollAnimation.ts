'use client'

import { useRef } from 'react'
import { useInView, type UseInViewOptions } from 'framer-motion'

interface UseScrollAnimationOptions {
  /** Fraction of element that must be visible before triggering (default 0.15) */
  amount?: number
  /** Only trigger once — element won't re-animate on scroll back up (default true) */
  once?: boolean
  /** Optional root margin — must match framer-motion's MarginType e.g. "-50px 0px" */
  margin?: UseInViewOptions['margin']
}

interface UseScrollAnimationReturn {
  ref:      React.RefObject<HTMLDivElement>
  isInView: boolean
}

/**
 * Returns a ref and a boolean that becomes true once the element enters the viewport.
 *
 * Usage:
 *
 *   const { ref, isInView } = useScrollAnimation()
 *
 *   <motion.div
 *     ref={ref}
 *     initial={{ opacity: 0, y: 24 }}
 *     animate={isInView ? { opacity: 1, y: 0 } : {}}
 *     transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
 *   />
 */
export function useScrollAnimation({
  amount = 0.15,
  once   = true,
  margin,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  const ref = useRef<HTMLDivElement>(null)

  const isInView = useInView(ref, {
    amount,
    once,
    ...(margin !== undefined ? { margin } : {}),
  })

  return { ref, isInView }
}
