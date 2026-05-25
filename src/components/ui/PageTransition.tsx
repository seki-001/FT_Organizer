'use client'

import { motion } from 'framer-motion'

/**
 * Wraps page content with a subtle fade-in on navigation.
 * Applied at layout level — every page beneath it fades in automatically.
 *
 * Keep this fast (0.3s) — it runs on every page visit.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
