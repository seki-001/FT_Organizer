import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const BRAND_LOGO_PATH = '/images/brand/fto-logo.png'

interface BrandLogoProps {
  className?: string
  /** Tailwind height class, e.g. h-12 */
  heightClass?: string
  priority?: boolean
  href?: string
  onClick?: () => void
}

export default function BrandLogo({
  className,
  heightClass = 'h-12 md:h-14',
  priority = false,
  href = '/',
  onClick,
}: BrandLogoProps) {
  const image = (
    <Image
      src={BRAND_LOGO_PATH}
      alt="Faith The Organizer — From Clutter to Order"
      width={320}
      height={96}
      priority={priority}
      className={cn('w-auto max-w-[min(100%,280px)] object-contain object-left', heightClass, className)}
    />
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="inline-flex shrink-0 items-center py-2 pr-2 focus-visible:outline-offset-4"
      >
        {image}
      </Link>
    )
  }

  return <span className="inline-flex shrink-0 items-center py-2">{image}</span>
}
