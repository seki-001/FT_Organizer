import { cn } from '@/lib/utils'
import { GlassBadge as GlassBadgePrimitive } from '@/components/ui/glass'

interface OfferBadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'accent' | 'outline' | 'glass-dark' | 'glass-light'
  className?: string
  dot?: boolean
}

export default function OfferBadge({
  children,
  variant = 'glass-dark',
  className,
  dot = true,
}: OfferBadgeProps) {
  if (variant === 'glass-dark' || variant === 'glass-light') {
    return (
      <GlassBadgePrimitive tone={variant === 'glass-dark' ? 'dark' : 'light'} dot={dot} className={className}>
        {children}
      </GlassBadgePrimitive>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full',
        variant === 'primary' && 'glass-panel-brand text-primary',
        variant === 'accent' && 'bg-accent/15 text-accent border border-accent/30',
        variant === 'outline' && 'glass-badge-light',
        className,
      )}
    >
      {children}
    </span>
  )
}
