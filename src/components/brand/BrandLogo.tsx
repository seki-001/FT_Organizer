import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  /** `on-light` — horizontal wordmark for light backgrounds; `on-dark` — house lockup for dark surfaces */
  variant?: 'on-dark' | 'on-light'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  priority?: boolean
  href?: string | null
}

/** Dimensions match output of scripts/process-brand-logos.py — re-run script after source changes */
const LOGO = {
  'on-light': {
    src: '/images/brand/fto-logo-on-light.png',
    width: 470,
    height: 176,
  },
  'on-dark': {
    src: '/images/brand/fto-logo-on-dark.png',
    width: 360,
    height: 316,
  },
} as const

const SIZE_CLASS = {
  sm: 'h-8 w-auto max-w-[140px]',
  md: 'h-10 sm:h-11 w-auto max-w-[200px] sm:max-w-[230px]',
  lg: 'h-12 sm:h-14 w-auto max-w-[240px] sm:max-w-[280px]',
  xl: 'h-16 sm:h-[4.5rem] w-auto max-w-[200px] sm:max-w-[220px]',
} as const

export default function BrandLogo({
  variant = 'on-light',
  size,
  className,
  priority = false,
  href = '/',
}: BrandLogoProps) {
  const meta = LOGO[variant]
  const sizeClass = size ?? (variant === 'on-dark' ? 'xl' : 'md')

  const img = (
    <Image
      src={meta.src}
      alt="Faith The Organizer — From Clutter to Order"
      width={meta.width}
      height={meta.height}
      priority={priority}
      className={cn(
        'w-auto object-contain object-left select-none',
        SIZE_CLASS[sizeClass],
        className,
      )}
    />
  )

  if (!href) return img

  return (
    <Link
      href={href}
      className="flex-shrink-0 inline-flex items-center"
      aria-label="Faith The Organizer — Home"
    >
      {img}
    </Link>
  )
}
