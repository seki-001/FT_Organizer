import Image from 'next/image'
import { cn } from '@/lib/utils'

interface IllustrationSpotProps {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Small cartoon spot illustration for empty states, cards, CTAs */
export default function IllustrationSpot({ src, alt, size = 'md', className }: IllustrationSpotProps) {
  const dims = size === 'sm' ? 120 : size === 'lg' ? 280 : 200

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-3xl p-3 glass-panel-light',
        className,
      )}
    >
      <Image src={src} alt={alt} width={dims} height={dims * 0.75} className="w-full h-auto object-contain" />
    </div>
  )
}
