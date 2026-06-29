'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { PickerImage } from '@/lib/site-image-picker'

interface SiteImagePickerProps {
  label: string
  images: PickerImage[]
  onSelect: (src: string) => void
  selected?: string[]
  className?: string
}

/** Horizontal thumbnail strip for choosing site images in admin forms */
export default function SiteImagePicker({
  label,
  images,
  onSelect,
  selected = [],
  className,
}: SiteImagePickerProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <p className="text-xs font-semibold text-dark/45 uppercase tracking-widest">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {images.map((img) => {
          const isSelected = selected.includes(img.src)
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => onSelect(img.src)}
              title={img.label}
              className={cn(
                'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-dark/10 hover:border-primary/40',
              )}
            >
              <Image src={img.src} alt={img.label} fill className="object-cover" sizes="64px" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
