'use client'

import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { WHY_CHOOSE_US } from '@/lib/service-content'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

export default function WhyChooseUsSection() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <section className="py-14 md:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <p className="sfs-label mb-4">Why Choose Us</p>
          <h2 className="text-dark text-3xl md:text-4xl font-sans font-medium mb-4">
            {WHY_CHOOSE_US.title}
          </h2>
          <p className="text-dark/60 text-base leading-relaxed">
            {WHY_CHOOSE_US.closing}
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {WHY_CHOOSE_US.items.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, ease: EASE_STANDARD, delay: i * 0.06 }}
              className="flex items-start gap-3 bg-white rounded-2xl border border-dark/6 px-5 py-4 shadow-sm"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check size={14} className="text-primary" aria-hidden="true" />
              </span>
              <span className="text-dark text-sm font-medium leading-snug">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
