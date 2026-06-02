'use client'

import { cn } from '@/lib/utils'
import { SHOP_SORT_OPTIONS, SHOP_MAX_PRICE, type ShopSortOption } from '@/lib/shop-utils'
import type { ProductCategory } from '@/lib/types'
import type { ShopCategoryTab } from './ShopCategoryTabs'

export interface ShopFiltersState {
  sort: ShopSortOption
  activeCategory: ProductCategory | 'all'
  priceMin: number
  priceMax: number
  inStockOnly: boolean
}

interface ShopFiltersProps extends ShopFiltersState {
  categories: ShopCategoryTab[]
  setSort: (v: ShopSortOption) => void
  setActiveCategory: (v: ProductCategory | 'all') => void
  setPriceMin: (v: number) => void
  setPriceMax: (v: number) => void
  setInStockOnly: (v: boolean) => void
  onClearAll: () => void
}

export default function ShopFilters({
  sort,
  setSort,
  activeCategory,
  setActiveCategory,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  inStockOnly,
  setInStockOnly,
  categories,
  onClearAll,
}: ShopFiltersProps) {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Sort</p>
        <div className="flex flex-col gap-1.5">
          {SHOP_SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="shop-sort"
                checked={sort === opt.value}
                onChange={() => setSort(opt.value)}
                className="accent-primary"
              />
              <span
                className={cn(
                  'transition-colors',
                  sort === opt.value ? 'text-dark font-medium' : 'text-dark/60 group-hover:text-dark',
                )}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-dark/8" />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Category</p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="shop-category"
                checked={activeCategory === cat.slug}
                onChange={() => setActiveCategory(cat.slug)}
                className="accent-primary"
              />
              <span
                className={cn(
                  'transition-colors',
                  activeCategory === cat.slug
                    ? 'text-dark font-medium'
                    : 'text-dark/60 group-hover:text-dark',
                )}
              >
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-dark/8" />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Price (KSh)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(Math.max(0, Number(e.target.value)))}
            aria-label="Minimum price"
            className="input-base flex-1 min-h-[40px] text-xs py-2"
          />
          <span className="text-dark/30">—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(Math.min(SHOP_MAX_PRICE, Number(e.target.value)))}
            aria-label="Maximum price"
            className="input-base flex-1 min-h-[40px] text-xs py-2"
          />
        </div>
      </div>

      <div className="border-t border-dark/8" />

      <label className="flex items-center justify-between gap-3 cursor-pointer">
        <span className="text-dark/70">In stock only</span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
      </label>

      <button
        type="button"
        onClick={onClearAll}
        className="text-dark/45 text-sm font-medium hover:text-dark text-left"
      >
        Clear all filters
      </button>
    </div>
  )
}
