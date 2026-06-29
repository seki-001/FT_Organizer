'use client'

import { useState, useMemo, useCallback, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal, X, PackageX, ChevronDown } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import type { Product } from '@/lib/types'
import { SHOP_CATEGORIES } from '@/lib/constants'
import type { ProductCategory } from '@/lib/types'
import DarkProductCard from '@/components/shop/DarkProductCard'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',     label: 'Newest'              },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'rating',     label: 'Best Rated'          },
]

const MAX_PRICE = 20000

// Category images for the navigator cards
const CATEGORY_IMAGES: Record<string, string> = {
  all:                   '/images/shop/shop-hero.jpg',
  'kitchen-organization':'/images/shop/shop-hero.jpg',
  'closet-and-bedroom':  '/images/shop/shop-hero.jpg',
  'office-and-desk':     '/images/shop/shop-hero.jpg',
  'storage-solutions':   '/images/shop/shop-hero.jpg',
  'bundles':             '/images/shop/shop-hero.jpg',
}

// ─── Filter Sidebar content (shared for desktop sidebar + mobile drawer) ─────

interface FilterPanelProps {
  sort: SortOption
  setSort: (v: SortOption) => void
  activeCategory: ProductCategory | 'all'
  setActiveCategory: (v: ProductCategory | 'all') => void
  priceMin: number
  setPriceMin: (v: number) => void
  priceMax: number
  setPriceMax: (v: number) => void
  inStockOnly: boolean
  setInStockOnly: (v: boolean) => void
  onClearAll: () => void
}

function FilterPanel({
  sort, setSort,
  activeCategory, setActiveCategory,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  inStockOnly, setInStockOnly,
  onClearAll,
}: FilterPanelProps) {
  const allCategories = [
    { slug: 'all', label: 'All Products' },
    ...SHOP_CATEGORIES,
  ]

  return (
    <div className="flex flex-col gap-6 text-sm text-dark/70">

      {/* Sort By */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Sort By</p>
        <div className="flex flex-col gap-1.5">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <span
                onClick={() => setSort(opt.value)}
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
                  sort === opt.value
                    ? 'border-primary bg-primary'
                    : 'border-dark/20 group-hover:border-primary/60'
                )}
              >
                {sort === opt.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                )}
              </span>
              <span
                onClick={() => setSort(opt.value)}
                className={cn(
                  'transition-colors',
                  sort === opt.value ? 'text-dark font-medium' : 'text-dark/55 hover:text-dark'
                )}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-dark/8" />

      {/* Category */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Category</p>
        <div className="flex flex-col gap-1.5">
          {allCategories.map((cat) => (
            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setActiveCategory(cat.slug as ProductCategory | 'all')}
                className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
                  activeCategory === cat.slug
                    ? 'border-primary bg-primary'
                    : 'border-dark/20 group-hover:border-dark/40',
                )}
              >
                {activeCategory === cat.slug && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                onClick={() => setActiveCategory(cat.slug as ProductCategory | 'all')}
                className={cn(
                  'text-sm transition-colors',
                  activeCategory === cat.slug ? 'text-dark' : 'text-dark/50 group-hover:text-dark',
                )}
              >
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-dark/8" />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest">Price Range (KSh)</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => setPriceMin(Math.max(0, Number(e.target.value)))}
            placeholder="Min"
            aria-label="Minimum price"
            className="w-0 flex-1 bg-muted border border-dark/10 rounded-lg px-3 py-2 text-xs text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-dark/30 text-xs">—</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(Math.min(MAX_PRICE, Number(e.target.value)))}
            placeholder="Max"
            aria-label="Maximum price"
            className="w-0 flex-1 bg-muted border border-dark/10 rounded-lg px-3 py-2 text-xs text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {/* Visual range bar */}
        <div className="relative h-1.5 bg-dark/10 rounded-full mt-1">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${(priceMin / MAX_PRICE) * 100}%`,
              width: `${Math.max(0, ((priceMax - priceMin) / MAX_PRICE) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="border-t border-dark/8" />

      {/* Availability */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-dark/40 uppercase tracking-widest mb-0.5">Availability</p>
          <p className="text-dark/70 text-xs">In Stock Only</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={() => setInStockOnly(!inStockOnly)}
          className={cn(
            'relative w-10 h-5.5 rounded-full transition-colors duration-200 flex-shrink-0',
            inStockOnly ? 'bg-primary' : 'bg-dark/15'
          )}
          style={{ height: '22px' }}
        >
          <motion.span
            animate={{ x: inStockOnly ? 20 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      </div>

      <div className="border-t border-dark/8" />

      {/* Clear All */}
      <button
        type="button"
        onClick={onClearAll}
        className="text-dark/45 text-sm font-medium hover:text-dark text-left"
      >
        Clear All Filters
      </button>
    </div>
  )
}

// ─── Category Navigator Card ──────────────────────────────────────────────────

function CategoryCard({
  slug, label, active, onClick,
}: { slug: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all duration-150',
        active
          ? 'bg-primary text-white border-primary font-semibold'
          : 'border-dark/15 text-dark/55 hover:border-primary/30 hover:text-dark bg-white',
      )}
      aria-pressed={active}
    >
      {label}
    </motion.button>
  )
}

// ─── Page (inner — reads URL params) ─────────────────────────────────────────

function ShopCatalogueInner() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') as ProductCategory | null

  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(
    urlCategory && SHOP_CATEGORIES.some(c => c.slug === urlCategory) ? urlCategory : 'all'
  )

  // Sync when URL param changes (e.g. back/forward navigation)
  useEffect(() => {
    if (urlCategory && SHOP_CATEGORIES.some(c => c.slug === urlCategory)) {
      setActiveCategory(urlCategory)
    }
  }, [urlCategory])
  const [sort, setSort] = useState<SortOption>('newest')
  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(MAX_PRICE)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d: { products?: Product[] }) => {
        if (d.products?.length) setProducts(d.products)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleClearAll = useCallback(() => {
    setActiveCategory('all')
    setSort('newest')
    setPriceMin(0)
    setPriceMax(MAX_PRICE)
    setInStockOnly(false)
  }, [])

  const filtered = useMemo(() => {
    let base = activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

    if (inStockOnly) base = base.filter((p) => p.inStock)

    base = base.filter((p) => {
      const effective = p.salePrice ?? p.price
      return effective >= priceMin && effective <= priceMax
    })

    return [...base].sort((a, b) => {
      const aPrice = a.salePrice ?? a.price
      const bPrice = b.salePrice ?? b.price
      if (sort === 'price-asc')  return aPrice - bPrice
      if (sort === 'price-desc') return bPrice - aPrice
      if (sort === 'rating')     return b.rating - a.rating
      return products.indexOf(a) - products.indexOf(b)
    })
  }, [activeCategory, sort, priceMin, priceMax, inStockOnly, products])

  const filterPanelProps: FilterPanelProps = {
    sort, setSort,
    activeCategory, setActiveCategory,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    inStockOnly, setInStockOnly,
    onClearAll: handleClearAll,
  }

  const allCategoryItems = [
    { slug: 'all', label: 'All' },
    ...SHOP_CATEGORIES,
  ]

  return (
    <main className="bg-surface min-h-screen">

      {/* ── 1. HERO BANNER ─────────────────────────────────────────────────── */}
      <section className="relative h-56 sm:h-64 bg-white overflow-hidden flex items-center border-b border-dark/8">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/shop/shop-hero.jpg"
            alt="Shop Organizing Products — Faith The Organizer"
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
        </div>

        {/* Centered content */}
        <div className="relative z-10 w-full text-center px-4">
          <h1 className="font-display text-4xl sm:text-5xl text-dark font-bold leading-tight">
            Shop Organizing Products
          </h1>
          <p className="text-dark/55 mt-3 text-lg">Delivered across Nairobi</p>
        </div>

        {/* Floating pill badges */}
        <div className="absolute bottom-6 left-4 sm:left-8 flex items-center gap-3 flex-wrap z-10">
          <span className="bg-white text-dark text-xs font-medium rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            🚚 Free delivery in Nairobi CBD
          </span>
          <span className="bg-white text-dark text-xs font-medium rounded-full px-4 py-2 shadow-md whitespace-nowrap">
            ✓ Same-day dispatch before 2 pm
          </span>
        </div>
      </section>

      {/* ── 2. CATEGORY NAVIGATOR ──────────────────────────────────────────── */}
      <section className="bg-white py-6 border-b border-dark/8" aria-label="Filter by category">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {allCategoryItems.map((cat) => (
              <CategoryCard
                key={cat.slug}
                slug={cat.slug}
                label={cat.label}
                active={activeCategory === cat.slug}
                onClick={() => setActiveCategory(cat.slug as ProductCategory | 'all')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. MAIN CONTENT — Sidebar + Grid ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white border border-dark/8 rounded-2xl p-6 sticky top-24 shadow-sm">
              <p className="font-display text-base text-dark mb-5">Filters</p>
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* Product area */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 border border-dark/15 text-dark text-sm font-medium px-4 py-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>
                <p className="text-dark/50 text-sm">
                  <span className="font-semibold text-dark">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Sort dropdown (desktop only — sidebar has it on desktop, but show for mobile too) */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  aria-label="Sort products"
                  className="appearance-none bg-white border border-dark/15 text-dark text-sm font-medium pl-4 pr-9 py-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dark/40"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <p className="text-dark/50 text-sm">Loading products…</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <DarkProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <PackageX size={48} className="text-dark/20" aria-hidden="true" />
                <p className="font-display text-xl text-dark">No products found</p>
                <p className="text-dark/50 text-sm">Try adjusting your filters.</p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-2 bg-dark hover:bg-dark/80 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ───────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-dark/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-display text-lg text-dark">Filters</p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close filters"
                  className="text-dark/40 hover:text-dark"
                >
                  <X size={20} />
                </button>
              </div>
              <FilterPanel {...filterPanelProps} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="mt-6 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-xl transition-colors text-sm"
              >
                Show {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

export default function ShopCataloguePage() {
  return (
    <Suspense fallback={<div className="bg-surface min-h-screen" />}>
      <ShopCatalogueInner />
    </Suspense>
  )
}
