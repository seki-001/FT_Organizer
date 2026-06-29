import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  /** `on-dark` for header/footer; `on-light` for white backgrounds */
  variant?: 'on-dark' | 'on-light'
  className?: string
  priority?: boolean
  href?: string
}

const LOGO_SRC = {
  'on-dark': '/images/brand/fto-logo-on-dark.png',
  'on-light': '/images/brand/fto-logo-on-light.png',
} as const

export default function BrandLogo({
  variant = 'on-dark',
  className,
  priority = false,
  href = '/',
}: BrandLogoProps) {
  const img = (
    <Image
      src={LOGO_SRC[variant]}
      alt="Faith The Organizer"
      width={160}
      height={56}
      priority={priority}
      className={cn('h-9 sm:h-10 w-auto object-contain object-left', className)}
    />
  )

  if (!href) return img

  return (
    <Link href={href} className="flex-shrink-0 inline-flex items-center" aria-label="Faith The Organizer — Home">
      {img}
    </Link>
  )
}
