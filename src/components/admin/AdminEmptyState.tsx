import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminEmptyStateProps {
  icon:       LucideIcon
  title:      string
  message:    string
  action?:    {
    label:    string
    href?:    string
    onClick?: () => void
    variant?: 'primary' | 'outline' | 'copy'
    copyText?: string
  }
}

export default function AdminEmptyState({ icon: Icon, title, message, action }: AdminEmptyStateProps) {
  const btnBase = 'inline-flex items-center gap-2 font-medium text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm'

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
        <Icon size={36} className="text-primary/25" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-bold text-dark mb-2">{title}</h3>
      <p className="text-dark/50 text-sm max-w-xs leading-relaxed mb-6">{message}</p>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            className={cn(btnBase,
              action.variant === 'outline'
                ? 'border border-dark/20 text-dark hover:border-primary hover:text-primary bg-white'
                : 'bg-primary hover:bg-primary/90 text-white',
            )}
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            className={cn(btnBase,
              action.variant === 'outline'
                ? 'border border-dark/20 text-dark hover:border-primary hover:text-primary bg-white'
                : 'bg-primary hover:bg-primary/90 text-white',
            )}
          >
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
