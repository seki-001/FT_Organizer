import { Facebook, Instagram, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

function TikTokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  )
}

const LINKS = [
  { href: COMPANY.instagram, label: 'Instagram', icon: Instagram },
  { href: COMPANY.facebook, label: 'Facebook', icon: Facebook },
  { href: COMPANY.youtube, label: 'YouTube', icon: Youtube },
  { href: COMPANY.tiktok, label: 'TikTok', icon: TikTokIcon },
] as const

interface SocialLinksProps {
  variant?: 'dark' | 'light'
  className?: string
}

export default function SocialLinks({ variant = 'dark', className }: SocialLinksProps) {
  const btnClass =
    variant === 'dark'
      ? 'glass-icon-btn glass-icon-btn-dark'
      : 'glass-icon-btn text-dark/50 hover:text-dark'

  return (
    <div className={cn('flex items-center gap-2.5 flex-wrap', className)}>
      {LINKS.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={btnClass}
        >
          <Icon size={15} />
        </a>
      ))}
    </div>
  )
}
