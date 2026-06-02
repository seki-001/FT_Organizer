'use client'

import { Search } from 'lucide-react'
import FilterBar, { type FilterOption } from '@/components/admin/ui/FilterBar'
import { cn } from '@/lib/utils'

interface AdminListToolbarProps<T extends string = string> {
  search: string
  onSearchChange: (v: string) => void
  searchPlaceholder?: string
  filters?: FilterOption<T>[]
  filter?: T
  onFilterChange?: (v: T) => void
  onClear?: () => void
  children?: React.ReactNode
}

export default function AdminListToolbar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  filter,
  onFilterChange,
  onClear,
  children,
}: AdminListToolbarProps<T>) {
  const hasFilters = filters && filter !== undefined && onFilterChange

  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-4 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
        />
      </div>
      {hasFilters && (
        <FilterBar options={filters} value={filter} onChange={onFilterChange} ariaLabel="Filter records" />
      )}
      {children}
      {onClear && (search || (hasFilters && filter !== filters[0]?.id)) && (
        <button type="button" onClick={onClear} className="text-xs text-primary font-medium hover:underline">
          Clear
        </button>
      )}
    </div>
  )
}

export function AdminTableShell({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden min-w-0')}>
      <p className="mobile-scroll-hint px-5 pt-3 pb-0 border-b border-dark/5 md:hidden">
        Swipe horizontally to see more columns
      </p>
      <div className="mobile-table-scroll md:overflow-visible">
        {children}
      </div>
      {footer && <div className="px-5 py-3 border-t border-dark/5 text-xs text-dark/40">{footer}</div>}
    </div>
  )
}
