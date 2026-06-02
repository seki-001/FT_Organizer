'use client'

import { cn } from '@/lib/utils'
import type { ProductCategory } from '@/lib/types'

export interface ShopCategoryTab {
  slug: ProductCategory | 'all'
  label: string
}

interface ShopCategoryTabsProps {
  tabs: ShopCategoryTab[]
  active: ProductCategory | 'all'
  onChange: (slug: ProductCategory | 'all') => void
}

export default function ShopCategoryTabs({ tabs, active, onChange }: ShopCategoryTabsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
      role="tablist"
      aria-label="Product categories"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.slug
        return (
          <button
            key={tab.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.slug)}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]',
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-dark/10 text-dark/65 hover:text-dark hover:border-dark/20',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
