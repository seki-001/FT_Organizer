import ChartCard from './ChartCard'
import type { LucideIcon } from 'lucide-react'
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  Receipt,
  Package,
  ListChecks,
} from 'lucide-react'
import type { DashboardActivity, DashboardActivityType } from '@/lib/admin-dashboard-data'

const ICONS: Record<DashboardActivityType, { icon: LucideIcon; className: string }> = {
  order: { icon: ShoppingBag, className: 'bg-primary/10 text-primary' },
  booking: { icon: Calendar, className: 'bg-success/10 text-success' },
  payment: { icon: CreditCard, className: 'bg-accent/15 text-dark' },
  invoice: { icon: Receipt, className: 'bg-danger/10 text-danger' },
  stock: { icon: Package, className: 'bg-muted text-dark/50' },
  follow_up: { icon: ListChecks, className: 'bg-primary/10 text-primary' },
}

interface ActivityFeedCardProps {
  title?: string
  items: DashboardActivity[]
  maxItems?: number
}

export default function ActivityFeedCard({
  title = 'Recent activity',
  items,
  maxItems = 8,
}: ActivityFeedCardProps) {
  const visible = items.slice(0, maxItems)

  return (
    <ChartCard title={title} subtitle="Latest updates across the business" bodyClassName="p-0">
      <ul className="divide-y divide-dark/5 max-h-[420px] overflow-y-auto">
        {visible.map((item) => {
          const { icon: Icon, className } = ICONS[item.type]
          return (
            <li key={item.id} className="flex gap-3 px-5 py-4 hover:bg-muted/30 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${className}`}>
                <Icon size={16} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-dark">{item.message}</p>
                {item.detail && <p className="text-xs text-dark/45 mt-0.5 truncate">{item.detail}</p>}
              </div>
              <time className="text-[11px] text-dark/35 whitespace-nowrap flex-shrink-0">{item.timeAgo}</time>
            </li>
          )
        })}
      </ul>
    </ChartCard>
  )
}
