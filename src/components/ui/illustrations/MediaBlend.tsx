import Image from 'next/image'
import { cn } from '@/lib/utils'
import DecorativeBlobs from './DecorativeBlobs'

interface MediaBlendProps {
  photo: string
  illustration: string
  photoAlt: string
  illustrationAlt: string
  className?: string
  /** photo on left vs right on desktop */
  photoPosition?: 'left' | 'right'
  blobVariant?: 'warm' | 'cool' | 'brand'
}

/**
 * Sweet Flower / M3-style split: real photo + flat cartoon illustration
 * with shared rounded frame and soft blob accents.
 */
export default function MediaBlend({
  photo,
  illustration,
  photoAlt,
  illustrationAlt,
  className,
  photoPosition = 'left',
  blobVariant = 'brand',
}: MediaBlendProps) {
  const photoFirst = photoPosition === 'left'

  return (
    <div className={cn('relative', className)}>
      <DecorativeBlobs variant={blobVariant} />
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-stretch">
        <div
          className={cn(
            'relative aspect-[4/3] md:aspect-auto md:min-h-[320px] rounded-[2.25rem] overflow-hidden shadow-sfs-md border border-white/50 img-zoom',
            !photoFirst && 'md:order-2',
          )}
        >
          <Image src={photo} alt={photoAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/25 via-transparent to-transparent" />
        </div>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-[2.25rem] overflow-hidden p-4 md:p-6 min-h-[240px] glass-subtle',
            !photoFirst && 'md:order-1',
          )}
        >
          <Image
            src={illustration}
            alt={illustrationAlt}
            width={520}
            height={400}
            className="w-full h-auto max-h-[280px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
