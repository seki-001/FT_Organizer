'use client'

import { motion } from 'framer-motion'
import { Shield, Star, MapPin } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

const TRUST_ITEMS = [
  {
    icon: Shield,
    heading: 'Confidentiality Agreement',
    body: 'Signed on every job, no exceptions. Your home and its contents remain private.',
  },
  {
    icon: Star,
    heading: 'NAPO Code of Ethics',
    body: 'We follow international organizing standards for professionalism and best practice.',
  },
  {
    icon: MapPin,
    heading: 'Nairobi-Based',
    body: 'We come to you, anywhere in the city — from Karen to Eastlands and beyond.',
  },
]

export default function ServicesTrust() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.2 })

  return (
    <section className="pt-6 pb-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref} className="bg-muted rounded-3xl p-10 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {TRUST_ITEMS.map(({ icon: Icon, heading, body }, i) => (
              <motion.div
                key={heading}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: EASE_STANDARD, delay: i * 0.12 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm">
                  <Icon size={26} className="text-dark/50" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl text-dark">{heading}</h3>
                <p className="text-dark/60 text-sm leading-relaxed max-w-xs mx-auto">{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
