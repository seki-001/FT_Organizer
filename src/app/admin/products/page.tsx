'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import {
  Search, ChevronDown, Pencil, Trash2, PlusCircle, Download,
  Star, StarOff,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { cn, formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/lib/types'

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; class: string }> = {
  'kitchen-organization': { label: 'Kitchen',  class: 'bg-orange-100 text-orange-700' },
  'closet-and-bedroom':   { label: 'Closet',   class: 'bg-purple-100 text-purple-700' },
  'office-and-desk':      { label: 'Office',   class: 'bg-blue-100 text-blue-700'    },
  'storage-solutions':    { label: 'Storage',  class: 'bg-emerald-100 text-emerald-700' },
  'bundles':              { label: 'Bundle',   class: 'bg-primary/10 text-primary'   },
}

const CATEGORIES = [
  { value: 'all',                  label: 'All Categories' },
  { value: 'kitchen-organization', label: 'Kitchen'       },
  { value: 'closet-and-bedroom',   label: 'Closet'        },
  { value: 'office-and-desk',      label: 'Office'        },
  { value: 'storage-solutions',    label: 'Storage'       },
  { value: 'bundles',              label: 'Bundles'       },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stockBadge(p: Product): { label: string; class: string } {
  if (!p.inStock || p.stockCount === 0) return { label: 'Out of Stock', class: 'bg-danger/10 text-danger'        }
  if (p.stockCount < 5)                 return { label: 'Low Stock',    class: 'bg-amber-100 text-amber-700'     }
  return                                       { label: 'In Stock',     class: 'bg-success/10 text-success'     }
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap', colorClass)}>
      {label}
    </span>
  )
}

function SelectFilter({
  value, onChange, label, children,
}: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-dark/15 rounded-lg pl-3 pr-8 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" aria-hidden="true" />
    </div>
  )
}

// ─── Featured toggle switch ───────────────────────────────────────────────────

function FeaturedToggle({ featured, onToggle }: { featured: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={featured}
      aria-label={featured ? 'Remove from featured' : 'Mark as featured'}
      onClick={onToggle}
      className={cn(
        'w-10 h-5 rounded-full relative flex-shrink-0 transition-colors duration-200',
        featured ? 'bg-primary' : 'bg-dark/20',
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200',
        featured ? 'right-0.5' : 'left-0.5',
      )} />
    </button>
  )
}

// ─── Delete confirm dialog ────────────────────────────────────────────────────

function DeleteDialog({
  product, onConfirm, onCancel,
}: { product: Product; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-danger" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-dark">Delete Product?</h3>
            <p className="text-sm text-dark/60 mt-1">
              <strong className="text-dark">{product.name}</strong> will be permanently removed from
              your shop. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-dark/15 text-dark text-sm font-medium rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-danger text-white text-sm font-medium rounded-lg hover:bg-danger/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products,        setProducts]        = useState<Product[]>(MOCK_PRODUCTS)
  const [selectedIds,     setSelectedIds]     = useState<Set<string>>(new Set())
  const [deleteSlug,      setDeleteSlug]      = useState<string | null>(null)
  const [search,          setSearch]          = useState('')
  const [categoryFilter,  setCategoryFilter]  = useState('all')
  const [stockFilter,     setStockFilter]     = useState('all')
  const [sortBy,          setSortBy]          = useState('newest')

  // Select-all checkbox ref (for indeterminate state)
  const selectAllRef = useRef<HTMLInputElement>(null)

  // ── Filtering & sorting ──────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let list = [...products]
    const q = search.toLowerCase().trim()
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.slug.includes(q))
    if (categoryFilter !== 'all') list = list.filter(p => p.category === categoryFilter)
    if (stockFilter === 'in-stock')     list = list.filter(p =>  p.inStock && p.stockCount >= 5)
    if (stockFilter === 'low-stock')    list = list.filter(p =>  p.inStock && p.stockCount > 0 && p.stockCount < 5)
    if (stockFilter === 'out-of-stock') list = list.filter(p => !p.inStock || p.stockCount === 0)
    if (sortBy === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'price-low')  list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    if (sortBy === 'stock-low')  list.sort((a, b) => a.stockCount - b.stockCount)
    return list
  }, [products, search, categoryFilter, stockFilter, sortBy])

  // ── Select-all indeterminate state ───────────────────────────────────────

  const allSelected  = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.has(p.slug))
  const someSelected = filteredProducts.some(p => selectedIds.has(p.slug))

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected && !allSelected
    }
  }, [someSelected, allSelected])

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(filteredProducts.map(p => p.slug)) : new Set())
  }

  function handleSelectRow(slug: string, checked: boolean) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      checked ? next.add(slug) : next.delete(slug)
      return next
    })
  }

  function handleToggleFeatured(slug: string) {
    setProducts(prev => prev.map(p => p.slug === slug ? { ...p, featured: !p.featured } : p))
    fetch(`/api/admin/products/${slug}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featuredToggle: true }),
    }).catch(() => {})
  }

  function handleDeleteConfirm() {
    if (!deleteSlug) return
    setProducts(prev => prev.filter(p => p.slug !== deleteSlug))
    setSelectedIds(prev => { const n = new Set(prev); n.delete(deleteSlug); return n })
    fetch(`/api/admin/products/${deleteSlug}`, { method: 'DELETE' }).catch(() => {})
    setDeleteSlug(null)
  }

  // ── Bulk actions ─────────────────────────────────────────────────────────

  function handleBulkDelete() {
    setProducts(prev => prev.filter(p => !selectedIds.has(p.slug)))
    setSelectedIds(new Set())
  }

  function handleBulkFeatured() {
    setProducts(prev => prev.map(p => selectedIds.has(p.slug) ? { ...p, featured: true } : p))
    setSelectedIds(new Set())
  }

  function handleBulkExport() {
    const selected = products.filter(p => selectedIds.has(p.slug))
    const rows = [
      ['Name', 'Slug', 'Category', 'Price', 'Sale Price', 'Stock', 'Featured', 'Status'],
      ...selected.map(p => [
        `"${p.name}"`, p.slug, p.category,
        p.price, p.salePrice ?? '',
        p.stockCount, p.featured ? 'Yes' : 'No',
        p.inStock ? 'In Stock' : 'Out of Stock',
      ]),
    ]
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'products-export.csv'; a.click()
    URL.revokeObjectURL(url)
    setSelectedIds(new Set())
  }

  const deleteProduct = deleteSlug ? products.find(p => p.slug === deleteSlug) : null

  // ── Stats for header summary ──────────────────────────────────────────────

  const inStockCount    = products.filter(p =>  p.inStock && p.stockCount >= 5).length
  const lowStockCount   = products.filter(p =>  p.inStock && p.stockCount > 0 && p.stockCount < 5).length
  const outOfStockCount = products.filter(p => !p.inStock || p.stockCount === 0).length

  return (
    <>
      <div className="flex flex-col gap-6">

        <AdminPageHeader
          title="Products"
          subtitle="Manage your shop inventory"
          action={{ label: 'Add Product', href: '/admin/products/new', icon: PlusCircle }}
        />

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Products', count: products.length,  color: 'text-dark'          },
            { label: 'In Stock',       count: inStockCount,      color: 'text-success'        },
            { label: 'Low Stock',      count: lowStockCount,     color: 'text-amber-600'      },
            { label: 'Out of Stock',   count: outOfStockCount,   color: 'text-danger'         },
          ].map(({ label, count, color }) => (
            <div key={label} className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 text-center">
              <p className={cn('font-display text-2xl font-bold', color)}>{count}</p>
              <p className="text-dark/50 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-sm font-semibold text-primary flex-1">
              {selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleBulkFeatured}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dark/15 text-dark text-xs font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Star size={12} aria-hidden="true" />
                Mark as Featured
              </button>
              <button
                type="button"
                onClick={handleBulkExport}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-dark/15 text-dark text-xs font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Download size={12} aria-hidden="true" />
                Export Selected
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-danger/8 border border-danger/20 text-danger text-xs font-medium rounded-lg hover:bg-danger hover:text-white transition-colors"
              >
                <Trash2 size={12} aria-hidden="true" />
                Delete Selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-dark/40 hover:text-dark transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search products by name or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
            />
          </div>

          <SelectFilter value={categoryFilter} onChange={setCategoryFilter} label="Filter by category">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </SelectFilter>

          <SelectFilter value={stockFilter} onChange={setStockFilter} label="Filter by stock status">
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock ({'<'} 5)</option>
            <option value="out-of-stock">Out of Stock</option>
          </SelectFilter>

          <SelectFilter value={sortBy} onChange={setSortBy} label="Sort products">
            <option value="newest">Newest First</option>
            <option value="name-asc">Name A → Z</option>
            <option value="price-low">Price: Low → High</option>
            <option value="stock-low">Stock: Low → High</option>
          </SelectFilter>

          {(search || categoryFilter !== 'all' || stockFilter !== 'all' || sortBy !== 'newest') && (
            <button
              type="button"
              onClick={() => { setSearch(''); setCategoryFilter('all'); setStockFilter('all'); setSortBy('newest') }}
              className="text-xs text-primary hover:underline whitespace-nowrap self-center"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-dark/8 bg-muted/30">
                  <th className="px-4 py-3 w-10">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      aria-label="Select all products"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary cursor-pointer"
                    />
                  </th>
                  {['Product', 'Category', 'Price', 'Sale', 'Stock', 'Featured', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-dark/40 text-sm">
                      No products match your filters.{' '}
                      <button
                        type="button"
                        onClick={() => { setSearch(''); setCategoryFilter('all'); setStockFilter('all') }}
                        className="text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, i) => {
                    const cat    = CATEGORY_META[product.category]
                    const badge  = stockBadge(product)
                    const isSelected = selectedIds.has(product.slug)

                    return (
                      <tr
                        key={product.id}
                        className={cn(
                          'border-b border-dark/5 transition-colors',
                          i % 2 !== 0 ? 'bg-muted/10' : '',
                          isSelected && 'bg-primary/5',
                          'hover:bg-primary/5',
                        )}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={`Select ${product.name}`}
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(product.slug, e.target.checked)}
                            className="w-4 h-4 rounded accent-primary cursor-pointer"
                          />
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-dark text-sm truncate max-w-[180px]">{product.name}</p>
                              <p className="text-dark/35 text-xs font-mono mt-0.5 truncate max-w-[180px]">{product.slug}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3">
                          <Badge label={cat?.label ?? product.category} colorClass={cat?.class ?? 'bg-muted text-dark/60'} />
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 font-mono text-sm text-dark whitespace-nowrap">
                          {formatPrice(product.price)}
                        </td>

                        {/* Sale price */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {product.salePrice != null ? (
                            <span className="flex flex-col">
                              <span className="font-mono text-sm text-primary font-semibold">{formatPrice(product.salePrice)}</span>
                              <span className="text-[10px] text-dark/40">
                                {discountPercent(product.price, product.salePrice)}% off
                              </span>
                            </span>
                          ) : (
                            <span className="text-dark/25">—</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-3">
                          <span className={cn(
                            'font-mono text-sm font-semibold',
                            product.stockCount === 0      ? 'text-danger' :
                            product.stockCount  < 5       ? 'text-amber-600' :
                                                            'text-dark',
                          )}>
                            {product.stockCount}
                          </span>
                        </td>

                        {/* Featured toggle */}
                        <td className="px-4 py-3">
                          <FeaturedToggle
                            featured={product.featured}
                            onToggle={() => handleToggleFeatured(product.slug)}
                          />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge label={badge.label} colorClass={badge.class} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/products/${product.slug}/edit`}
                              aria-label={`Edit ${product.name}`}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors"
                            >
                              <Pencil size={14} aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              aria-label={`Delete ${product.name}`}
                              onClick={() => setDeleteSlug(product.slug)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-danger hover:bg-danger/8 transition-colors"
                            >
                              <Trash2 size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filteredProducts.length > 0 && (
            <div className="px-5 py-3 border-t border-dark/5 flex items-center justify-between gap-4">
              <p className="text-xs text-dark/40">
                Showing <span className="font-medium text-dark">{filteredProducts.length}</span> of{' '}
                <span className="font-medium text-dark">{products.length}</span> products
              </p>
              <div className="flex items-center gap-2">
                <StarOff size={12} className="text-dark/25" aria-hidden="true" />
                <p className="text-xs text-dark/40">
                  <span className="font-medium text-dark">{products.filter(p => p.featured).length}</span> featured
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Delete confirm dialog */}
      {deleteSlug && deleteProduct && (
        <DeleteDialog
          product={deleteProduct}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteSlug(null)}
        />
      )}
    </>
  )
}
