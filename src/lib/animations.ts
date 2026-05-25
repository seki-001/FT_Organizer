/**
 * Animation constants — single source of truth for all motion values.
 *
 * Import from here rather than defining durations/easings inline.
 * Every value here is intentional: subtle, purposeful, never decorative.
 */

import type { Variants } from 'framer-motion'

// ─── Shared easing curves ─────────────────────────────────────────────────────

/** Standard ease — snappy entrance, smooth exit. Matches CSS ease equivalent. */
export const EASE_STANDARD = [0.25, 0.1, 0.25, 1] as const

/** Spring-like entrance for larger elements */
export const EASE_SPRING = [0.16, 1, 0.3, 1] as const

// ─── Page & section entry ─────────────────────────────────────────────────────

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_STANDARD },
  },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export const fadeDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_STANDARD },
  },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: EASE_STANDARD },
  },
}

// ─── Staggered children ───────────────────────────────────────────────────────

/** Parent container: apply to a wrapping motion element */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08 },
  },
}

/** Each child inside a staggerContainer */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_STANDARD },
  },
}

/** Slower stagger for hero/large sections */
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12 },
  },
}

// ─── Hover states ─────────────────────────────────────────────────────────────

/** Subtle lift — cards, product tiles */
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
} as const

/** Scale — images, thumbnails */
export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.3 } },
} as const

/** Image zoom — used inside .img-zoom containers */
export const imageZoom = {
  whileHover: { scale: 1.05, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

// ─── Slide animations (modals, drawers, slide-overs) ─────────────────────────

export const slideFromRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_STANDARD },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

export const slideFromBottom: Variants = {
  initial: { y: '100%', opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_STANDARD },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

// ─── Overlay / backdrop ───────────────────────────────────────────────────────

export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

// ─── Convenience bundle (for components that spread all props) ────────────────

/**
 * Combined animation object.
 * Matches the original spec shape for backwards compatibility.
 */
export const animations = {
  fadeUp,
  fadeIn,
  staggerContainer,
  staggerItem,
  hoverLift,
  hoverScale,
  imageZoom,
} as const
