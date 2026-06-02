import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ChartCard from './ChartCard'

export interface QuickActionItem {
  label: string
  description?: string
  href: string
}

interface QuickActionsCardProps {
  actions: readonly QuickActionItem[]
  title?: string
}

export default function QuickActionsCard({
  actions,
  title = 'Quick actions',
}: QuickActionsCardProps) {
  return (
    <ChartCard title={title} subtitle="Shortcuts to common tasks" bodyClassName="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.href + action.label}
            href={action.href}
            className="flex items-center justify-between gap-3 rounded-xl border border-dark/8 px-4 py-3 hover:border-primary/30 hover:bg-primary/[0.02] transition-colors group"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark group-hover:text-primary transition-colors">
                {action.label}
              </p>
              {action.description && (
                <p className="text-xs text-dark/45 mt-0.5">{action.description}</p>
              )}
            </div>
            <ArrowRight
              size={16}
              className="text-dark/25 group-hover:text-primary flex-shrink-0 transition-colors"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </ChartCard>
  )
}
