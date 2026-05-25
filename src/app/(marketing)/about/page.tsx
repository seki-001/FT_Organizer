'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Award, MapPin } from 'lucide-react'
import { COMPANY, MEDIA_FEATURES } from '@/lib/constants'
import FooterCTABand from '@/components/sections/FooterCTABand'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── YouTube embed ────────────────────────────────────────────────────────────

function YouTubeEmbed({ url }: { url: string }) {
  const videoMatch   = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?&#]+)/)
  const channelMatch = url.match(/\/channel\/(UC[^/?&#]+)/)
  const src = videoMatch?.[1]
    ? `https://www.youtube.com/embed/${videoMatch[1]}`
    : channelMatch?.[1]
      ? `https://www.youtube.com/embed?listType=user_uploads&list=${channelMatch[1]}`
      : null

  if (!src) return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="flex items-center justify-center aspect-video w-full rounded-2xl bg-dark/5 text-dark/50 text-sm hover:text-dark transition-colors">
      Watch on YouTube →
    </a>
  )
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm">
      <iframe src={src} title="Faith The Organizer — YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen className="w-full h-full" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { ref: heroRef,    isInView: heroInView    } = useScrollAnimation({ amount: 0.15 })
  const { ref: storyRef,   isInView: storyInView   } = useScrollAnimation({ amount: 0.1  })
  const { ref: valuesRef,  isInView: valuesInView  } = useScrollAnimation({ amount: 0.08 })
  const { ref: mediaRef,   isInView: mediaInView   } = useScrollAnimation({ amount: 0.3  })

  return (
    <main>

      {/* ── 1. FULL-BLEED DARK HERO ─────────────────────────────────────── */}
      <section className="bg-dark min-h-[70vh] flex items-end px-4 sm:px-8 pb-16 sm:pb-20 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about/office-interior.jpg"
            alt="Organized office interior background — Faith The Organizer"
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
        </div>

        {/* Content */}
        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto w-full"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: EASE_STANDARD }}
            className="text-primary text-xs uppercase tracking-[0.3em] mb-6 font-medium"
          >
            Our Story
          </motion.p>

          {['Turning Nairobi', 'Homes Into'].map((line, i) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, y: 24 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.08 + i * 0.1, ease: EASE_STANDARD }}
              className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-none"
            >
              {line}
            </motion.h1>
          ))}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE_STANDARD }}
            className="font-display text-5xl sm:text-6xl md:text-7xl leading-none"
          >
            <span className="text-primary">Sanctuaries.</span>
          </motion.h1>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="absolute bottom-0 right-0 flex items-center gap-3"
          >
            <span className="text-white/30 text-xs tracking-wider">Scroll</span>
            <motion.div
              animate={{ scaleY: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-10 bg-white/20 origin-top"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 2. FOUNDER STORY ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 md:py-24">

        {/* Pull quote */}
        <motion.div
          ref={storyRef}
          initial={{ opacity: 0, y: 20 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE_STANDARD }}
          className="border-t border-b border-dark/10 py-10 sm:py-14 my-8 text-center"
        >
          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-dark max-w-3xl mx-auto leading-relaxed">
            &ldquo;I believe every home deserves to be a calm, organized space — no matter its size.&rdquo;
          </blockquote>
          <p className="text-dark/40 text-sm tracking-wider mt-6">— Faith, Founder</p>
        </motion.div>

        {/* Two-column founder layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mt-12">

          {/* Image left */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_STANDARD }}
            className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-muted img-zoom"
          >
            {/* TODO: Replace with real Faith portrait photo */}
            <Image
              src="/images/about/faith-working.jpg"
              alt="Faith working — Faith The Organizer"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Content right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_STANDARD }}
            className="flex flex-col gap-6"
          >
            <p className="text-primary text-xs uppercase tracking-[0.2em] font-medium">
              Faith The Organizer
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-dark leading-snug">
              The Person Behind The Brand
            </h2>

            <p className="text-dark/65 leading-relaxed">
              I started my organizing journey after realizing that a clutter-free space
              isn&apos;t a luxury — it&apos;s a necessity. Growing up in Nairobi, I saw firsthand
              how disorganized homes created stress, lost time, and quiet frustration. I turned
              my passion for order and beautiful spaces into a business that has since
              transformed over 500 homes and offices across the city.
            </p>
            <p className="text-dark/65 leading-relaxed">
              With a trained eye for space planning and a warm, judgment-free approach, I work
              alongside you — not just for you. Every project is bespoke: from a single
              overstuffed wardrobe to a complete whole-house transformation.
            </p>
            <p className="text-dark/65 leading-relaxed">
              Whether it&apos;s a young professional wanting a serene home office, a busy mum
              reclaiming the family kitchen, or a business needing an organized filing system —
              I bring the same care, creativity, and commitment to every space I touch.
            </p>

            <YouTubeEmbed url={COMPANY.youtube} />
          </motion.div>

        </div>
      </section>

      {/* ── 3. VALUES BENTO ─────────────────────────────────────────────── */}
      <section className="bg-muted py-16 md:py-24 px-4 sm:px-8">
        <motion.div
          ref={valuesRef}
          variants={staggerContainer}
          initial="initial"
          animate={valuesInView ? 'animate' : 'initial'}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            variants={staggerItem}
            className="font-display text-4xl md:text-5xl text-dark mb-10"
          >
            What We Stand For
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

            {/* Large red card — Full Confidentiality */}
            <motion.div variants={staggerItem} className="lg:col-span-6">
              <div className="bg-primary rounded-3xl p-8 sm:p-12 h-72 flex flex-col justify-between">
                <Shield size={56} className="text-white/25" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-3xl sm:text-4xl text-white leading-snug">
                    Full Confidentiality
                  </h3>
                  <p className="text-white/55 mt-3 leading-relaxed text-sm">
                    A signed agreement on every job. Your privacy is sacred.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Two stacked small cards */}
            <motion.div variants={staggerItem} className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-3xl p-7 flex-1 flex flex-col justify-between">
                <Award size={28} className="text-dark/35" aria-hidden="true" />
                <h3 className="font-display text-lg sm:text-xl text-dark">NAPO Standards</h3>
              </div>
              <div className="bg-dark rounded-3xl p-7 flex-1 flex flex-col justify-between">
                <MapPin size={28} className="text-white/30" aria-hidden="true" />
                <h3 className="font-display text-lg sm:text-xl text-white">Proudly Nairobi</h3>
              </div>
            </motion.div>

            {/* Stat card */}
            <motion.div variants={staggerItem} className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 h-72 flex flex-col items-center justify-center text-center">
                <span className="font-display text-6xl sm:text-7xl text-dark">500+</span>
                <p className="text-dark/45 text-xs uppercase tracking-wider mt-3">Homes Organized</p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ── 4. MEDIA FEATURES ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 px-4 sm:px-8">
        <motion.div
          ref={mediaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={mediaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE_STANDARD }}
          className="max-w-7xl mx-auto"
        >
          <p className="text-[10px] tracking-[0.4em] text-dark/30 uppercase text-center mb-12">
            As Seen In
          </p>

          <div className="flex justify-center flex-wrap gap-10 sm:gap-16 items-center">
            {MEDIA_FEATURES.map(({ name }) => (
              <div
                key={name}
                className="grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300"
              >
                <span className="font-display text-xl text-dark tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 5. CTA ───────────────────────────────────────────────────────── */}
      <FooterCTABand />

    </main>
  )
}
