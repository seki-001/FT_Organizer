'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { IMG } from '@/lib/image-placeholders'

const HERO_AVATARS = IMG.avatars

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden bg-dark">
      <div className="absolute inset-0">
        <Image
          src={IMG.heroBg}
          alt="Faith The Organizer — beautiful transformed home space"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-dark/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full min-h-[92vh] flex flex-col justify-end pb-16 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 inline-flex"
        >
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-medium px-3.5 py-1.5 rounded-full">
            <Sparkles size={11} className="text-accent" />
            Nairobi&apos;s Premier Organizing Service
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white mb-6"
            >
              <span className="block head-sans text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
                From Clutter
              </span>
              <span className="block head-serif text-5xl sm:text-6xl lg:text-7xl leading-none text-accent/90">
                to Order.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-white text-dark font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200"
              >
                Book Your Transformation
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="lg:max-w-xs flex flex-col gap-5">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/70 text-sm leading-relaxed"
            >
              A professional organizing service that transforms your home,
              office, and life — one space at a time. Based in Nairobi, serving
              all neighbourhoods.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="avatar-cluster">
                {HERO_AVATARS.map((src, i) => (
                  <div key={i} style={{ zIndex: HERO_AVATARS.length - i }}>
                    <Image src={src} alt="Happy client" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">500+</p>
                <p className="text-white/50 text-xs">
                  Homes <span className="font-display italic">Transformed</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
