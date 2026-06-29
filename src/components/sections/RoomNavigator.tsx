'use client'

import Image from 'next/image'
import Link  from 'next/link'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Room data ────────────────────────────────────────────────────────────────

import { IMG } from '@/lib/image-placeholders'

const ROOMS = [
  {
    label:        'Kitchen',
    serviceSlug:  'general-decluttering',
    serviceCount: 3,
    image:        IMG.rooms.kitchen,
  },
  {
    label:        'Living Room',
    serviceSlug:  'whole-house-organizing',
    serviceCount: 4,
    image:        IMG.rooms.livingRoom,
  },
  {
    label:        'Bedroom',
    serviceSlug:  'shelving-and-storage',
    serviceCount: 3,
    image:        IMG.rooms.bedroom,
  },
  {
    label:        'Home Office',
    serviceSlug:  'office-organizing',
    serviceCount: 2,
    image:        IMG.rooms.office,
  },
  {
    label:        'Moving Home',
    serviceSlug:  'moving-house',
    serviceCount: 3,
    image:        IMG.rooms.moving,
  },
  {
    label:        'Whole Home',
    serviceSlug:  'whole-house-organizing',
    serviceCount: 5,
    image:        IMG.rooms.wholeHome,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function RoomNavigator() {
  const { ref, isInView } = useScrollAnimation({ amount: 0.1 })

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="font-display text-2xl md:text-3xl text-dark text-center mb-8"
        >
          Organize Your Space
        </motion.h2>

        {/* Horizontal scroll container */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          {ROOMS.map(room => (
            <motion.div
              key={room.label}
              variants={staggerItem}
              className="flex-none w-[160px] sm:w-[180px] lg:w-auto snap-start"
            >
              <RoomCard room={room} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

// ─── Room card ────────────────────────────────────────────────────────────────

function RoomCard({ room }: { room: typeof ROOMS[0] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer group"
    >
      <Link href={`/services/${room.serviceSlug}`} className="block">
        <div className="border border-white/50 rounded-3xl overflow-hidden hover:border-primary/25 transition-colors duration-200 hover:shadow-md transition-shadow glass-subtle">

          {/* Portrait image — 2:3 ratio */}
          <div className="relative img-zoom" style={{ aspectRatio: '2 / 3' }}>
            <Image
              src={room.image}
              alt={`${room.label} room navigator card — Faith The Organizer`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, calc((100vw - 128px) / 6)"
            />
          </div>

          {/* Label area */}
          <div className="glass-subtle px-4 py-3 group-hover:border-b-2 group-hover:border-b-primary transition-all duration-200">
            <p className="font-medium text-dark text-sm leading-snug">{room.label}</p>
            <p className="text-dark/40 text-xs mt-0.5">{room.serviceCount} services</p>
          </div>

        </div>
      </Link>
    </motion.div>
  )
}
