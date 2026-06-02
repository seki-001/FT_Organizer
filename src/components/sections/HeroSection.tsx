'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SITE_VISIT } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { EASE_STANDARD } from '@/lib/animations'

export default function HeroSection() {
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 500], [0, -40])

  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16 py-14 md:py-20 lg:py-24 min-h-0 lg:min-h-[85vh]">
          <div className="flex-1 order-2 lg:order-1 max-w-xl lg:max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_STANDARD }}
              className="text-dark/50 text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              {SITE_VISIT.serviceArea} · Professional Organizing
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE_STANDARD }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] text-dark leading-[1.08] font-bold"
            >
              From Clutter
              <br />
              to Order.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: EASE_STANDARD }}
              className="mt-5 text-dark/65 text-lg leading-relaxed max-w-lg"
            >
              Premium home and office organizing across East Africa — calm spaces, practical systems,
              and support from first site visit through follow-up.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: EASE_STANDARD }}
              className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-7 min-h-[48px] rounded-button hover:bg-danger transition-colors shadow-soft"
              >
                Book Site Visit
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border-2 border-dark/15 bg-white text-dark font-medium text-sm px-7 min-h-[48px] rounded-button hover:border-dark/30 transition-colors"
              >
                Explore Services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28, ease: EASE_STANDARD }}
              className="mt-8 rounded-card border border-dark/8 bg-surface/80 p-4 sm:p-5 flex flex-col gap-2"
            >
              <p className="text-sm font-medium text-dark flex items-center gap-2">
                <MapPin size={16} className="text-primary shrink-0" aria-hidden="true" />
                Site visit fee: {formatPrice(SITE_VISIT.feeKsh)}
              </p>
              <p className="text-sm text-dark/60 leading-relaxed">
                {SITE_VISIT.redeemablePercent}% redeemable toward your project if you retain us. Site
                visits are mainly on {SITE_VISIT.primaryDays}; weekends closed.
              </p>
            </motion.div>
          </div>

          <div className="flex-1 order-1 lg:order-2 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[480px] rounded-card overflow-hidden">
            <motion.div className="absolute inset-0" style={{ y: imageY }}>
              <Image
                src="/images/hero/hero-main.jpg"
                alt="Calm, organized living space — Faith The Organizer"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/25 via-transparent to-transparent lg:bg-gradient-to-l lg:from-cream/20 lg:via-transparent lg:to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE_STANDARD }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-[240px] bg-white/95 backdrop-blur-sm rounded-card p-4 shadow-card border border-dark/5"
            >
              <p className="text-[10px] font-semibold text-dark/40 uppercase tracking-widest mb-2">
                Portfolio preview
              </p>
              <div className="flex items-center gap-2 mb-2">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src="/images/hero/transformation-before.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <ArrowRight size={12} className="text-dark/25 shrink-0" aria-hidden="true" />
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src="/images/hero/transformation-after.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
              <p className="text-xs text-dark/55 leading-relaxed">
                Sample before & after imagery.{' '}
                <Link href="/portfolio" className="text-primary font-medium hover:underline">
                  View portfolio →
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
