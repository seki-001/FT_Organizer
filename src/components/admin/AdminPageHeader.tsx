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
    'flex items-center gap-2 font-medium text-sm px-4 py-2.5 rounded-lg transition-all duration-200 flex-shrink-0 min-h-[40px]',
    action?.variant === 'outline'
      ? 'border border-[#ECEEF2] text-dark hover:border-primary/30 hover:text-primary bg-white'
      : 'bg-primary hover:bg-primary/90 text-white',
  )

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="text-2xl md:text-[1.75rem] text-dark font-semibold leading-tight tracking-tight">
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
