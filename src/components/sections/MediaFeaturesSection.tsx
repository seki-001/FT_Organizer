'use client'

import { motion } from 'framer-motion'
import { MEDIA_FEATURES } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

export default function MediaFeaturesSection() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.2 })

  return (
    <section className="bg-dark border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: EASE_STANDARD }}
          className="text-center section-label text-white/40 mb-8"
        >
          As Seen In
        </motion.p>

        {/* Logo strip — staggered */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap sm:justify-center items-center gap-x-12 gap-y-8"
        >
          {MEDIA_FEATURES.map((feature) => (
            <motion.div
              key={feature.name}
              variants={staggerItem}
              className="flex items-center justify-center"
              aria-label={feature.name}
            >
              <span className="font-bold text-white/25 text-xl whitespace-nowrap select-none hover:text-white/45 transition-colors duration-200">
                {feature.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
