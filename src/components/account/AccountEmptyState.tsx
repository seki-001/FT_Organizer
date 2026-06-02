import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface AccountEmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function AccountEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: AccountEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Icon size={22} className="text-dark/30" aria-hidden="true" />
      </div>
      <div>
        <p className="font-medium text-dark text-sm">{title}</p>
        <p className="text-dark/50 text-xs mt-1 max-w-xs">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-sm font-medium text-primary hover:underline mt-1"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
