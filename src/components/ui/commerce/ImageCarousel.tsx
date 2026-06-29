'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  children: React.ReactNode
  className?: string
  itemClassName?: string
  showArrows?: boolean
  ariaLabel?: string
}

export default function ImageCarousel({
  children,
  className,
  itemClassName,
  showArrows = true,
  ariaLabel = 'Carousel',
}: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.85
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className={cn('relative group/carousel', className)}>
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full glass-icon-btn text-dark opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full glass-icon-btn text-dark opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          'flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1 -mx-1 px-1',
          itemClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
