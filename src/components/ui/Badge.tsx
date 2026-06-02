import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-muted text-dark',
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-dark',
  success: 'bg-success/10 text-success',
  warning: 'bg-accent/15 text-dark',
  danger: 'bg-danger/10 text-danger',
  muted: 'bg-muted text-dark/60',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export type { BadgeVariant }
