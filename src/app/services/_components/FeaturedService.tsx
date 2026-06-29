'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { IMG } from '@/lib/image-placeholders'
import { EASE_STANDARD } from '@/lib/animations'

const INCLUDES = [
  'Full home walkthrough',
  'All rooms organized',
  'Custom storage systems',
  'Follow-up session',
]

export default function FeaturedService() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <section className="py-10 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE_STANDARD }}
          className="bg-dark rounded-3xl overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Left — image (40%) */}
          <div className="relative lg:w-[40%] min-h-[260px] lg:min-h-0 flex-shrink-0">
            <Image
              src={IMG.gallery.transform1}
              alt="Whole House Organizing — before to after transformation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* subtle right fade into dark card */}
            <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-transparent lg:to-dark/60 hidden lg:block" />
          </div>

          {/* Right — content (60%) */}
          <div className="flex-1 p-8 sm:p-10 lg:p-14 flex flex-col justify-center gap-5">
            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-1.5 bg-white/15 text-white text-xs font-semibold rounded-full px-3 py-1">
              Most Popular
            </span>

            {/* Heading */}
            <h2 className="font-display text-3xl sm:text-4xl text-white font-bold leading-tight">
              Whole House Organizing
            </h2>

            {/* Description */}
            <p className="text-white/55 text-base leading-relaxed max-w-md">
              Our flagship service — a complete top-to-bottom transformation of your entire home,
              tailored to your lifestyle and the way you live.
            </p>

            {/* Includes pills */}
            <div className="flex flex-wrap gap-2">
              {INCLUDES.map(item => (
                <span
                  key={item}
                  className="bg-white/10 text-white text-sm rounded-full px-4 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Price */}
            <p className="font-mono text-white/70 text-xl font-medium">
              From {formatPrice(15000)}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/book"
                className="bg-primary hover:bg-primary/90 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Book This Service
              </Link>
              <Link
                href="/services/whole-house-organizing"
                className="text-white/60 hover:text-white font-medium text-sm transition-colors"
              >
                Learn More →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
