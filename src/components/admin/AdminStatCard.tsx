import { cn } from '@/lib/utils'

interface AdminStatCardProps {
  icon:      React.ElementType
  iconBg:    string
  iconColor: string
  value:     string
  label:     string
  sub?:      React.ReactNode
  className?: string
}

export default function AdminStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  sub,
  className,
}: AdminStatCardProps) {
  return (
    <div className={cn('admin-stat-card', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
          <Icon size={20} className={iconColor} aria-hidden="true" />
        </div>
        {sub && <div className="text-right">{sub}</div>}
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <p className="font-mono text-2xl font-bold text-dark tracking-tight leading-none">{value}</p>
        <p className="text-dark/50 text-sm">{label}</p>
      </div>
    </div>
  )
}
