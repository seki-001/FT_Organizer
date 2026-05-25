'use client'

import { useCallback } from 'react'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Testimonial } from '@/lib/types'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Fransisca Wambui',
    location: 'Westlands, Nairobi',
    rating: 5,
    text: 'Incredible service! Faith and her team were punctual, courteous, and so thorough. My home feels like a completely different space. I cannot believe the transformation — every drawer, shelf and cabinet is now perfectly organized. Highly recommend!',
    service: 'Whole House Organizing',
  },
  {
    id: '2',
    name: 'Gladys A',
    location: 'Runda, Nairobi',
    rating: 5,
    text: 'Amazing, quick and thorough. Faith understood exactly what I needed and delivered beyond my expectations. She reorganized my kitchen and home office in a single day. The systems she put in place are so intuitive — everything has a home now.',
    service: 'Home Organizing',
  },
  {
    id: '3',
    name: 'George Omondi',
    location: 'Kyuna, Nairobi',
    rating: 5,
    text: "Exceptional service from start to finish. Professional, detailed and genuinely passionate about organizing. Faith transformed our office space into a productive, clutter-free environment. Our team's morale and efficiency have noticeably improved.",
    service: 'Office Organizing',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-accent' : 'text-dark/20'} aria-hidden="true">★</span>
      ))}
    </div>
  )
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const initials = parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0][0]
  return (
    <div
      className="w-12 h-12 rounded-full bg-muted text-dark/50 font-semibold text-sm flex items-center justify-center flex-shrink-0 uppercase"
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bg-white rounded-xl shadow-sm flex flex-col gap-4 p-6 h-full mx-2">
      <StarRating rating={testimonial.rating} />
      <blockquote className="text-dark/70 text-sm leading-relaxed flex-1">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-3 pt-2 border-t border-dark/5">
        <Initials name={testimonial.name} />
        <div>
          <p className="font-semibold text-dark text-sm">{testimonial.name}</p>
          <p className="text-dark/50 text-xs">{testimonial.location}</p>
        </div>
      </footer>
    </article>
  )
}

export default function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    breakpoints: { '(min-width: 768px)': { slidesToScroll: 1 } },
  })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const { ref, isInView } = useScrollAnimation({ amount: 0.15 })

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
            What Our Clients Say
          </h2>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">
            Real stories from Nairobi homeowners and offices we&apos;ve transformed
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
          className="relative"
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -mx-2 md:[&>*]:basis-1/2 lg:[&>*]:basis-1/3 [&>*]:min-w-0 [&>*]:flex-[0_0_100%] md:[&>*]:flex-[0_0_50%] lg:[&>*]:flex-[0_0_33.333%]">
              {TESTIMONIALS.map((testimonial) => (
                <motion.div key={testimonial.id} variants={staggerItem} className="px-2">
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button type="button" onClick={scrollPrev} aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dark/20 text-dark/60 hover:border-primary hover:text-primary transition-colors duration-200">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={scrollNext} aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dark/20 text-dark/60 hover:border-primary hover:text-primary transition-colors duration-200">
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
