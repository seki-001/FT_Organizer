'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { EASE_STANDARD } from '@/lib/animations'

export default function ServicesHero() {
  return (
    <section className="bg-white pt-20 pb-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-5"
        >
          Services
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD, delay: 0.08 }}
          className="font-display text-5xl md:text-6xl text-dark font-bold leading-[1.05]"
        >
          Every Room.
          <br />
          Every Space.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD, delay: 0.18 }}
          className="text-dark/50 text-lg mt-5 max-w-lg leading-relaxed"
        >
          Nine integrated services across East Africa — organizing, storage, relocation, and calm
          home management. Site visits from KSh 3,000.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-12"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown size={28} className="text-dark/25" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
