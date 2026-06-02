import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  message: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: 'primary' | 'outline'
  }
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
      role="status"
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream"
        aria-hidden="true"
      >
        <Icon className="h-8 w-8 text-dark/40" />
      </div>
      <h3 className="font-display text-xl font-semibold text-dark mb-2">{title}</h3>
      <p className="text-sm text-dark/60 max-w-md leading-relaxed mb-6">{message}</p>
      {action ? (
        action.href ? (
          <Link href={action.href}>
            <Button variant={action.variant === 'outline' ? 'outline' : 'primary'}>
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            variant={action.variant === 'outline' ? 'outline' : 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  )
}
