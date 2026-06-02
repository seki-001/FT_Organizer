import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import ChartCard from './ChartCard'
import { cn } from '@/lib/utils'

export interface AlertListItem {
  id: string
  title: string
  subtitle?: string
  meta?: string
  href?: string
  hrefLabel?: string
  severity?: 'warning' | 'danger' | 'info'
}

interface AlertListCardProps {
  title: string
  subtitle?: string
  href?: string
  items: AlertListItem[]
  emptyMessage?: string
  badgeCount?: number
}

export default function AlertListCard({
  title,
  subtitle,
  href,
  items,
  emptyMessage = 'Nothing to show.',
  badgeCount,
}: AlertListCardProps) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      href={href}
      headerRight={
        badgeCount !== undefined && badgeCount > 0 ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-danger bg-danger/8 px-2.5 py-1 rounded-full">
            <AlertTriangle size={11} aria-hidden="true" />
            {badgeCount}
          </span>
        ) : undefined
      }
      bodyClassName="p-4 sm:p-5"
    >
      {items.length === 0 ? (
        <p className="text-dark/40 text-sm text-center py-6">{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const severity = item.severity ?? 'warning'
            const border =
              severity === 'danger'
                ? 'border-danger/15 bg-danger/[0.03]'
                : severity === 'info'
                  ? 'border-primary/15 bg-primary/[0.02]'
                  : 'border-accent/20 bg-accent/[0.04]'

            return (
              <li
                key={item.id}
                className={cn('flex items-start justify-between gap-3 rounded-xl border px-4 py-3', border)}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark">{item.title}</p>
                  {item.subtitle && <p className="text-xs text-dark/50 mt-0.5">{item.subtitle}</p>}
                  {item.meta && <p className="text-xs font-mono text-dark/40 mt-1">{item.meta}</p>}
                </div>
                {item.href && (
                  <Link
                    href={item.href}
                    className="text-xs font-semibold text-primary hover:underline whitespace-nowrap flex-shrink-0"
                  >
                    {item.hrefLabel ?? 'View'}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </ChartCard>
  )
}
