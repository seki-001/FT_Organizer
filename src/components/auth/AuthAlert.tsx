import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'error' | 'success' | 'info'

const STYLES: Record<Variant, string> = {
  error: 'bg-danger/10 border-danger/25 text-danger',
  success: 'bg-success/10 border-success/25 text-success',
  info: 'bg-primary/8 border-primary/20 text-dark/80',
}

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
} as const

interface AuthAlertProps {
  variant: Variant
  title?: string
  children: React.ReactNode
  className?: string
}

export default function AuthAlert({ variant, title, children, className }: AuthAlertProps) {
  const Icon = ICONS[variant]
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed', STYLES[variant], className)}
    >
      <Icon size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        {title ? <p className="font-semibold mb-0.5">{title}</p> : null}
        <div className={title ? 'text-[0.925em] opacity-90' : undefined}>{children}</div>
      </div>
    </div>
  )
}
