'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { SHOP_CATEGORIES } from '@/lib/constants'
import type { ProductCategory } from '@/lib/types'
import {
  SHOP_MAX_PRICE,
  sortProducts,
  effectivePrice,
  type ShopSortOption,
} from '@/lib/shop-utils'
import ProductCard from '@/components/shop/ProductCard'
import ShopHero from './_components/ShopHero'
import ShopCategoryTabs from './_components/ShopCategoryTabs'
import ShopFilters from './_components/ShopFilters'
import ShopFeaturedSection from './_components/ShopFeaturedSection'
import ShopEmptyState from './_components/ShopEmptyState'
import { cn } from '@/lib/utils'

const CATEGORY_TABS = [
  { slug: 'all' as const, label: 'All' },
  ...SHOP_CATEGORIES.map((c) => ({ slug: c.slug as ProductCategory, label: c.label })),
]

const FILTER_CATEGORIES = [
  { slug: 'all' as const, label: 'All products' },
  ...SHOP_CATEGORIES.map((c) => ({ slug: c.slug as ProductCategory, label: c.label })),
]

export default function ShopCatalogClient() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as ProductCategory | null

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [sort, setSort] = useState<ShopSortOption>('featured')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(SHOP_MAX_PRICE)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (categoryParam && SHOP_CATEGORIES.some((c) => c.slug === categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam])

  const handleClearAll = useCallback(() => {
    setActiveCategory('all')
    setSort('featured')
    setPriceMin(0)
    setPriceMax(SHOP_MAX_PRICE)
    setInStockOnly(false)
  }, [])

  const hasActiveFilters =
    activeCategory !== 'all' ||
    inStockOnly ||
    priceMin > 0 ||
    priceMax < SHOP_MAX_PRICE ||
    sort !== 'featured'

  const filtered = useMemo(() => {
    let base =
      activeCategory === 'all'
        ? MOCK_PRODUCTS
        : MOCK_PRODUCTS.filter((p) => p.category === activeCategory)

    if (inStockOnly) base = base.filter((p) => p.inStock)

    base = base.filter((p) => {
      const price = effectivePrice(p)
      return price >= priceMin && price <= priceMax
    })

    return sortProducts(base, sort, MOCK_PRODUCTS)
  }, [activeCategory, sort, priceMin, priceMax, inStockOnly])

  const featuredProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.featured && p.inStock),
    [],
  )

  const showFeatured = activeCategory === 'all' && !hasActiveFilters

  const filterProps = {
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
    categories: FILTER_CATEGORIES,
    onClearAll: handleClearAll,
  }

  return (
    <main className="bg-surface overflow-x-hidden min-w-0">
      <ShopHero />

      <section className="bg-white border-b border-dark/8 sticky top-16 z-20">
        <div className="section-container py-4">
          <ShopCategoryTabs tabs={CATEGORY_TABS} active={activeCategory} onChange={setActiveCategory} />
        </div>
      </section>

      <div className="section-container py-10 md:py-12">
        <div className="flex gap-8 lg:gap-10">
          <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0">
            <div className="card-surface border border-dark/8 p-6 sticky top-36">
              <p className="font-display text-base text-dark mb-5">Filters</p>
              <ShopFilters {...filterProps} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {showFeatured && <ShopFeaturedSection products={featuredProducts} />}

            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-dark/12 bg-white text-dark text-sm font-medium px-4 py-2.5 rounded-button min-h-[44px] hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                <p className="text-sm text-dark/55">
                  <span className="font-semibold text-dark">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as ShopSortOption)}
                aria-label="Sort products"
                className="input-base w-auto min-h-[44px] text-sm py-2 pr-8 cursor-pointer"
              >
                {[
                  { value: 'featured', label: 'Featured' },
                  { value: 'newest', label: 'Newest' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                ].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {filtered.length > 0 ? (
              <div
                className={cn(
                  'grid gap-4 md:gap-5',
                  showFeatured
                    ? 'grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 lg:grid-cols-3',
                )}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ShopEmptyState onClearFilters={handleClearAll} />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto lg:hidden border-t border-dark/10"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-lg text-dark">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="text-dark/40 hover:text-dark p-2"
                >
                  <X size={20} />
                </button>
              </div>
              <ShopFilters {...filterProps} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-6 w-full min-h-[48px] bg-primary text-white font-medium rounded-button text-sm hover:bg-danger transition-colors"
              >
                Show {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
