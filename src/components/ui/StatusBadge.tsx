import { cn } from '@/lib/utils'

export type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary'

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-accent/15 text-dark',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-primary/10 text-primary',
  neutral: 'bg-muted text-dark/70',
  primary: 'bg-primary/10 text-primary',
}

interface StatusBadgeProps {
  label: string
  variant?: StatusBadgeVariant
  className?: string
}

export default function StatusBadge({ label, variant = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
