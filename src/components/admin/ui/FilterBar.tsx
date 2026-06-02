'use client'

import { cn } from '@/lib/utils'

export interface FilterOption<T extends string = string> {
  id: T
  label: string
}

interface FilterBarProps<T extends string> {
  options: FilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  ariaLabel?: string
}

export default function FilterBar<T extends string>({
  options,
  value,
  onChange,
  className,
  ariaLabel = 'Filter',
}: FilterBarProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('inline-flex flex-wrap gap-1 p-1 bg-muted rounded-xl', className)}
    >
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            value === opt.id
              ? 'bg-white text-dark shadow-sm'
              : 'text-dark/50 hover:text-dark',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
