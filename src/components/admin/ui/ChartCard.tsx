import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  subtitle?: string
  href?: string
  hrefLabel?: string
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  headerRight?: React.ReactNode
}

export default function ChartCard({
  title,
  subtitle,
  href,
  hrefLabel = 'View details',
  children,
  className,
  bodyClassName = 'p-4 sm:p-6',
  headerRight,
}: ChartCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-dark/6">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-dark">{title}</h2>
          {subtitle && <p className="text-dark/40 text-xs mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {headerRight}
          {href && (
            <Link
              href={href}
              className="flex items-center gap-1 text-primary text-xs font-medium hover:underline whitespace-nowrap"
            >
              {hrefLabel} <ArrowRight size={12} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
