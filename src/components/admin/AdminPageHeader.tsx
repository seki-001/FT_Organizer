import Link from 'next/link'
import { PlusCircle, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActionConfig {
  label:    string
  href?:    string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  icon?:    LucideIcon
}

interface AdminPageHeaderProps {
  title:     string
  subtitle?: string
  action?:   ActionConfig
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  const Icon = action?.icon ?? PlusCircle

  const buttonClass = cn(
    'flex items-center gap-2 font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-200 flex-shrink-0 min-h-[40px] shadow-sm',
    action?.variant === 'outline'
      ? 'border border-dark/20 text-dark hover:border-primary hover:text-primary bg-white hover:shadow-md'
      : 'bg-primary hover:bg-primary/90 text-white hover:shadow-md',
  )

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="font-display text-2xl md:text-3xl text-dark font-bold leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-dark/45 text-sm">{subtitle}</p>
        )}
      </div>

      {action && (
        action.href ? (
          <Link href={action.href} className={buttonClass}>
            <Icon size={16} aria-hidden="true" />
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className={buttonClass}>
            <Icon size={16} aria-hidden="true" />
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
