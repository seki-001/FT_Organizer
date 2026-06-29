import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminCardProps {
  title:        string
  subtitle?:    string
  href?:        string
  headerRight?: React.ReactNode
  children:     React.ReactNode
  className?:   string
  bodyClassName?: string
  noPadding?:   boolean
}

export default function AdminCard({
  title,
  subtitle,
  href,
  headerRight,
  children,
  className,
  bodyClassName,
  noPadding,
}: AdminCardProps) {
  return (
    <div className={cn('admin-card overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#ECEEF2]">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-dark tracking-tight">{title}</h2>
          {subtitle && <p className="text-dark/45 text-xs mt-0.5">{subtitle}</p>}
        </div>
        {headerRight}
        {href && !headerRight && (
          <Link href={href} className="flex items-center gap-1 text-primary text-xs font-medium hover:underline flex-shrink-0">
            View all <ArrowRight size={12} aria-hidden="true" />
          </Link>
        )}
      </div>
      <div className={cn(!noPadding && 'p-0', bodyClassName)}>{children}</div>
    </div>
  )
}
