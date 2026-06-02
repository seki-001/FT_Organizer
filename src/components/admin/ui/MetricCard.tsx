import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  iconClassName?: string
  iconBgClassName?: string
  trend?: { pct: number; label?: string }
  accentBorder?: string
  footer?: React.ReactNode
  className?: string
}

export default function MetricCard({
  label,
  value,
  icon: Icon,
  iconClassName = 'text-primary',
  iconBgClassName = 'bg-primary/10',
  trend,
  accentBorder = 'border-l-primary',
  footer,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-dark/8 shadow-sm p-5 md:p-6 flex flex-col gap-4 border-l-4',
        accentBorder,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', iconBgClassName)}>
          <Icon size={18} className={iconClassName} aria-hidden="true" />
        </div>
        <p className="font-mono text-2xl md:text-3xl font-bold text-dark leading-none text-right">{value}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-dark/55 text-sm font-medium">{label}</p>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold w-fit',
              trend.pct >= 0 ? 'text-success' : 'text-danger',
            )}
          >
            {trend.pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend.pct >= 0 ? '+' : ''}
            {trend.pct}% {trend.label ?? 'vs last month'}
          </span>
        )}
        {footer}
      </div>
    </div>
  )
}
