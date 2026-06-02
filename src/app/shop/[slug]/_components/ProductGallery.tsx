'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  name: string
  images: string[]
  activeIndex: number
  onSelect: (index: number) => void
  saleBadge?: string
}

export default function ProductGallery({
  name,
  images,
  activeIndex,
  onSelect,
  saleBadge,
}: ProductGalleryProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square rounded-card overflow-hidden bg-muted border border-dark/8">
        <Image
          src={images[activeIndex]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {saleBadge && (
          <span className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {saleBadge}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-pressed={activeIndex === idx}
              className={cn(
                'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors',
                activeIndex === idx ? 'border-primary' : 'border-transparent hover:border-dark/20',
              )}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
