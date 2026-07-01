'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'
import { WHY_CHOOSE_US } from '@/lib/service-content'

export default function ServicesTrust() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.2 })

  return (
    <section className="pt-6 pb-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} className="bg-muted rounded-3xl p-10 sm:p-12">
          <h2 className="font-display text-2xl sm:text-3xl text-dark text-center mb-8">
            {WHY_CHOOSE_US.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE_STANDARD, delay: i * 0.08 }}
                className="flex items-start gap-3"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                  <Check size={16} className="text-primary" aria-hidden="true" />
                </span>
                <p className="text-dark/70 text-sm leading-relaxed pt-1">{item}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-dark/55 text-sm leading-relaxed text-center mt-8 max-w-2xl mx-auto">
            {WHY_CHOOSE_US.closing}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
