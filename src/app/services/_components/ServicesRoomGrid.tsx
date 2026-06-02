'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SERVICES, SERVICE_GROUPS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

function RoomCard({
  slug,
  title,
  priceFrom,
  categoryLabel,
  image,
}: {
  slug: string
  title: string
  priceFrom: number
  categoryLabel: string
  image: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      variants={staggerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '16 / 9' }}
    >
      <Link href={`/services/${slug}`} className="absolute inset-0 z-10" aria-label={`View ${title}`} />

      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 60%)',
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
        <p className="text-white/60 text-[10px] uppercase tracking-wider font-medium mb-1.5">
          {categoryLabel}
        </p>
        <h2 className="font-display text-xl sm:text-2xl text-white font-bold leading-snug">{title}</h2>
        <p className="text-white/75 text-sm font-mono mt-1">From {formatPrice(priceFrom)}</p>

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

export default function ServicesRoomGrid() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.05 })

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div ref={ref}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: EASE_STANDARD }}
            className="text-dark/40 text-[11px] font-semibold uppercase tracking-[0.18em] text-center mb-4"
          >
            Our Services
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: EASE_STANDARD, delay: 0.05 }}
            className="text-dark/55 text-center text-sm max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Nine integrated services across East Africa — from organizing and storage to relocation,
            events, training, and curated products.
          </motion.p>

          <div className="flex flex-col gap-14">
            {SERVICE_GROUPS.map((group) => {
              const groupServices = SERVICES.filter((s) => s.groupId === group.id)
              return (
                <div key={group.id}>
                  <h3 className="font-display text-2xl text-dark mb-6">{group.label}</h3>
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate={isInView ? 'animate' : 'initial'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {groupServices.map((service) => (
                      <RoomCard
                        key={service.slug}
                        slug={service.slug}
                        title={service.title}
                        priceFrom={service.priceFrom}
                        categoryLabel={service.categoryLabel}
                        image={service.image}
                      />
                    ))}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
