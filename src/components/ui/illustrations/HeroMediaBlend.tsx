import Image from 'next/image'
import { cn } from '@/lib/utils'
import DecorativeBlobs from './DecorativeBlobs'

interface HeroMediaBlendProps {
  photo: string
  illustration: string
  photoAlt: string
  illustrationAlt: string
  className?: string
  dark?: boolean
}

/** Homepage hero: full-bleed photo with floating illustration card */
export default function HeroMediaBlend({
  photo,
  illustration,
  photoAlt,
  illustrationAlt,
  className,
  dark = true,
}: HeroMediaBlendProps) {
  return (
    <div className={cn('relative w-full min-h-[88vh] overflow-hidden', dark ? 'bg-dark' : 'bg-surface', className)}>
      <div className="absolute inset-0">
        <Image src={photo} alt={photoAlt} fill priority className="object-cover object-center" sizes="100vw" />
        <div
          className={cn(
            'absolute inset-0',
            dark
              ? 'bg-gradient-to-r from-dark/85 via-dark/45 to-dark/15'
              : 'bg-gradient-to-r from-white/90 via-white/50 to-transparent',
          )}
        />
      </div>

      <DecorativeBlobs variant="brand" />

      {/* Floating illustration — desktop */}
      <div className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 w-[min(42vw,480px)] z-10">
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[2rem] p-5 shadow-sfs-lg border border-white/80 cartoon-float">
          <Image
            src={illustration}
            alt={illustrationAlt}
            width={480}
            height={360}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Mobile: illustration strip at bottom */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-dark/80 to-transparent z-[1] pointer-events-none" />
      <div className="lg:hidden absolute bottom-4 right-4 w-40 z-10 opacity-90">
        <Image src={illustration} alt="" width={160} height={120} className="w-full h-auto drop-shadow-lg" aria-hidden />
      </div>
    </div>
  )
}
