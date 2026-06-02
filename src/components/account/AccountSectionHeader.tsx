import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AccountSectionHeaderProps {
  title: string
  subtitle?: string
  href?: string
  linkLabel?: string
}

export default function AccountSectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'View all',
}: AccountSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 className="font-display text-lg text-dark">{title}</h2>
        {subtitle && <p className="text-sm text-dark/55 mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
        >
          {linkLabel}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
