'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { EASE_STANDARD } from '@/lib/animations'

function YouTubeEmbed({ url }: { url: string }) {
  const videoMatch = url.match(/[?&]v=([^&#]+)/) ?? url.match(/youtu\.be\/([^?&#]+)/)
  if (videoMatch?.[1]) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed/${videoMatch[1]}`}
          title="Faith The Organizer — YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  const channelMatch = url.match(/\/channel\/(UC[^/?&#]+)/)
  if (channelMatch?.[1]) {
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-sm">
        <iframe
          src={`https://www.youtube.com/embed?listType=user_uploads&list=${channelMatch[1]}`}
          title="Faith The Organizer — YouTube Channel"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center aspect-video w-full rounded-xl bg-muted text-dark/50 text-sm hover:text-dark transition-colors duration-200">
      Watch on YouTube →
    </a>
  )
}

export default function AboutTeaser() {
  const { ref: leftRef,  isInView: leftInView  } = useScrollAnimation({ amount: 0.2 })
  const { ref: rightRef, isInView: rightInView } = useScrollAnimation({ amount: 0.2 })

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — image + video */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -24 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_STANDARD }}
            className="flex flex-col gap-6"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              <div className="text-center text-dark/30 select-none">
                <p className="font-display text-2xl font-bold">Faith</p>
                <p className="text-sm mt-1">Photo coming soon</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-dark/5 rounded-xl -z-10" aria-hidden="true" />
            </div>
            <p className="text-dark/50 text-sm text-center italic">
              Faith, founder &amp; lead organizer — transforming Nairobi homes since 2017
            </p>
            <YouTubeEmbed url={COMPANY.youtube} />
          </motion.div>

          {/* Right — text */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 24 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_STANDARD, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              About Faith
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-dark leading-tight">
              The Story Behind The Organizer
            </h2>
            <p className="text-dark/60 leading-relaxed">
              Faith started her organizing journey after realizing that a clutter-free space
              isn&apos;t a luxury — it&apos;s a necessity. Growing up in Nairobi, she saw firsthand
              how disorganized homes created stress and lost time. She turned her passion for
              order and beautiful spaces into a business that has since transformed over 500
              homes and offices across the city.
            </p>
            <p className="text-dark/60 leading-relaxed">
              With a trained eye for space planning and a gentle, judgment-free approach,
              Faith and her team work alongside you — not just for you. Every organizing
              project is bespoke: from a single overstuffed wardrobe to a complete whole-house
              transformation before a big move. The result is always the same: a space that
              works for your life, and a system that lasts.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex border-2 border-dark text-dark hover:bg-dark hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
              >
                Read Our Story
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
