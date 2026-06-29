'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { IMG } from '@/lib/image-placeholders'
import { OfferBadge } from '@/components/ui/commerce'

const HERO_AVATARS = IMG.avatars

export default function HeroSection() {
  return (
    <section className="hero-section relative w-full min-h-[min(88vh,820px)] overflow-hidden bg-dark">
      <div className="absolute inset-0">
        <Image
          src={IMG.heroBg}
          alt="Bright, organized modern living room in Nairobi"
          fill
          priority
          className="object-cover object-[center_42%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7F8] via-dark/25 to-dark/15" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[min(88vh,820px)] flex items-end lg:items-center pb-14 sm:pb-16 lg:pb-0 pt-28 lg:pt-24">
        <div className="w-full max-w-xl lg:max-w-2xl">
          <OfferBadge variant="glass-dark" className="mb-5 w-fit">
            Nairobi&apos;s Premier Organizing Service
          </OfferBadge>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-white mb-5 sm:mb-6"
          >
            <span className="block head-sans text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.02] tracking-tight">
              From Clutter
            </span>
            <span className="block head-serif text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.02] text-accent">
              to Order.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/75 text-sm sm:text-base leading-relaxed max-w-md mb-7 sm:mb-8"
          >
            Professional home &amp; office organizing in Nairobi — real results, friendly service,
            and spaces that finally work for your life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Link href="/book" className="sfs-btn-primary text-sm sm:text-base px-6 py-3.5">
              Book Your Transformation <ArrowUpRight size={16} />
            </Link>
            <Link href="/shop" className="glass-btn-ghost-light text-sm sm:text-base px-6 py-3.5">
              Shop Organizing Products
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="avatar-cluster">
              {HERO_AVATARS.map((src, i) => (
                <div key={src} style={{ zIndex: HERO_AVATARS.length - i }}>
                  <Image src={src} alt="" width={40} height={40} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">500+</p>
              <p className="text-white/55 text-xs">
                Homes <span className="font-display italic">Transformed</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
