import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label: string
  title: string
  titleAccent?: string
  description?: string
  action?: { label: string; href: string }
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeader({
  label,
  title,
  titleAccent,
  description,
  action,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 mb-8 md:mb-10',
        centered && 'items-center text-center max-w-2xl mx-auto',
        !centered && 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('flex flex-col gap-2', centered && 'items-center')}>
        <p className="sfs-label">{label}</p>
        <h2 className="font-display text-3xl md:text-4xl text-dark leading-tight">
          <span className="block">{title}</span>
          {titleAccent && (
            <span className="block head-serif italic text-primary">{titleAccent}</span>
          )}
        </h2>
        {description && (
          <p className={cn('text-dark/55 text-sm md:text-base leading-relaxed max-w-lg', centered && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium text-dark/50 hover:text-primary transition-colors flex-shrink-0',
            centered && 'mt-1',
          )}
        >
          {action.label}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  )
}
