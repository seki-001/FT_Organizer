'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Room image + category data mapped to each service ───────────────────────

const SERVICE_META: Record<string, { category: string; image: string }> = {
  'general-decluttering':   { category: 'Home & Living',    image: '/images/services/decluttering-after-1.jpg'     },
  'whole-house-organizing': { category: 'Full Home',         image: '/images/services/whole-house-after-1.jpg'      },
  'moving-house':           { category: 'Relocation',        image: '/images/services/moving-after-1.jpg'          },
  'shelving-and-storage':   { category: 'Bedroom & Closet',  image: '/images/services/shelving-after-1.jpg'         },
  'packing-and-removal':    { category: 'Relocation',        image: '/images/services/packing-after-1.jpg'          },
  'paperwork-management':   { category: 'Home Office',       image: '/images/services/paperwork-after-1.jpg'        },
  'online-coaching':        { category: 'Online',            image: '/images/services/coaching-hero.jpg'         },
  'online-consulting':      { category: 'Online',            image: '/images/services/coaching-hero.jpg'         },
  'home-staging':           { category: 'Interior',          image: '/images/services/staging-after-1.jpg'     },
  'space-planning':         { category: 'Design',            image: '/images/services/space-planning-hero.jpg'   },
  'office-organizing':      { category: 'Workplace',         image: '/images/services/office-after-1.jpg'           },
}

// ─── Single room card ─────────────────────────────────────────────────────────

function RoomCard({ slug, title, priceFrom }: { slug: string; title: string; priceFrom: number }) {
  const [hovered, setHovered] = useState(false)
  const meta = SERVICE_META[slug] ?? { category: 'Service', image: '/images/services/whole-house-after-1.jpg' }

  return (
    <motion.article
      variants={staggerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '16 / 9' }}
    >
      <Link href={`/services/${slug}`} className="absolute inset-0 z-10" aria-label={`View ${title}`} />

      {/* Background image with zoom */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src={meta.image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </motion.div>

      {/* Gradient overlay — darkens on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 60%)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Hover border ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ boxShadow: hovered ? 'inset 0 0 0 2px rgba(255,255,255,0.2)' : 'inset 0 0 0 0px transparent' }}
        transition={{ duration: 0.2 }}
      />

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
        <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium mb-1.5">
          {meta.category}
        </p>
        <h2 className="font-display text-xl sm:text-2xl text-white font-bold leading-snug">
          {title}
        </h2>
        <p className="text-white/75 text-sm font-mono mt-1">
          From {formatPrice(priceFrom)}
        </p>

        {/* Hover button — slides up */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="mt-4"
            >
              <span className="inline-flex items-center gap-1.5 bg-white text-dark text-sm font-medium rounded-lg px-4 py-2 pointer-events-none">
                Explore <ArrowRight size={13} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

export default function ServicesRoomGrid() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.05 })

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Wrapper drives scroll detection */}
        <motion.div ref={ref}>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease: EASE_STANDARD }}
          className="text-dark/40 text-[11px] font-semibold uppercase tracking-[0.18em] text-center mb-8"
        >
          Choose Your Space
        </motion.p>

        {/* Staggered card grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map(service => (
            <RoomCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              priceFrom={service.priceFrom}
            />
          ))}
        </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
