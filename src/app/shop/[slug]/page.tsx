'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2, XCircle, Truck, Package, Clock,
  Heart, Star, X, Minus, Plus, ChevronRight, ShoppingCart, Shield,
} from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { SHOP_CATEGORIES } from '@/lib/constants'
import { formatPrice, discountPercent, cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import ProductCard from '@/components/shop/ProductCard'
import type { ProductVariant } from '@/lib/types'

// ─── Mock reviews ─────────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  { id: 'r1', author: 'Amina K.',    date: '2024-11-10', rating: 5, title: 'Exactly what I needed',  body: 'Great quality and arrived quickly. Really transformed my kitchen — everything has a place now!',   verified: true  },
  { id: 'r2', author: 'Brian M.',    date: '2024-10-22', rating: 4, title: 'Good value',              body: 'Sturdy and well-made. Took a few minutes to set up but very happy with the result.',              verified: true  },
  { id: 'r3', author: "Carol W.",    date: '2024-09-05', rating: 5, title: 'Would buy again',         body: "Bought this on Faith's recommendation. Does exactly what it says. Highly recommend.",            verified: false },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categoryLabel(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}
function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} aria-hidden="true"
          className={i < Math.round(rating) ? 'fill-accent text-accent' : 'text-dark/20'}
        />
      ))}
    </span>
  )
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  const [hovered, setHovered] = useState(0)
  const [chosen,  setChosen]  = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-dark/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Write a review"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 sm:p-8 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-dark">Write a Review</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-dark/40 hover:text-dark">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-dark">Your Rating</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button"
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setChosen(i + 1)}
                aria-label={`${i + 1} star${i !== 0 ? 's' : ''}`}
              >
                <Star size={28} className={cn('transition-colors duration-100',
                  i < (hovered || chosen) ? 'fill-accent text-accent' : 'text-dark/20'
                )} />
              </button>
            ))}
          </div>
        </div>

        {(['title', 'body'] as const).map((field) => (
          <div key={field} className="flex flex-col gap-1.5">
            <label htmlFor={`review-${field}`} className="text-sm font-medium text-dark">
              {field === 'title' ? 'Review Title' : 'Review'}
            </label>
            {field === 'title' ? (
              <input id="review-title" type="text" placeholder="Sum up your experience"
                className="bg-muted rounded-xl px-4 py-2.5 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <textarea id="review-body" rows={4} placeholder="What did you love about the product?"
                className="bg-muted rounded-xl px-4 py-2.5 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            )}
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-name" className="text-sm font-medium text-dark">Your Name</label>
          <input id="review-name" type="text" placeholder="e.g. Amina K."
            className="bg-muted rounded-xl px-4 py-2.5 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <button type="button"
          className="bg-dark hover:bg-dark/80 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Submit Review
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Add-to-cart button states ────────────────────────────────────────────────

type CartBtnState = 'idle' | 'adding' | 'added'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = 'description' | 'specs' | 'reviews'
const TABS: { id: Tab; label: string }[] = [
  { id: 'description', label: 'Description'    },
  { id: 'specs',       label: 'Specifications' },
  { id: 'reviews',     label: 'Reviews'        },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const params  = useParams()
  const slug    = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug)

  const { addItem, openCart } = useCart()

  const [activeImage,     setActiveImage]     = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined)
  const [quantity,        setQuantity]        = useState(1)
  const [wishlisted,      setWishlisted]      = useState(false)
  const [cartState,       setCartState]       = useState<CartBtnState>('idle')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [notifyEmail,     setNotifyEmail]     = useState('')
  const [activeTab,       setActiveTab]       = useState<Tab>('description')

  useEffect(() => {
    if (product?.variants?.[0]) setSelectedVariant(product.variants[0])
  }, [product])

  if (!product) {
    notFound()
  }

  const isOnSale    = product.salePrice !== undefined && product.salePrice < product.price
  const activePrice = isOnSale ? product.salePrice! : product.price
  const variantPrice = activePrice + (selectedVariant?.priceModifier ?? 0)
  const discount    = isOnSale ? discountPercent(product.price, product.salePrice!) : 0

  const relatedProducts = MOCK_PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = star >= 4 ? Math.round(product.reviewCount * (star === 5 ? 0.6 : 0.3)) : Math.round(product.reviewCount * 0.05)
    return { star, count, pct: product.reviewCount ? Math.round((count / product.reviewCount) * 100) : 0 }
  })

  function handleAddToCart() {
    if (!product!.inStock || cartState !== 'idle') return
    setCartState('adding')
    addItem(product!, selectedVariant)
    openCart()
    setTimeout(() => setCartState('added'), 300)
    setTimeout(() => setCartState('idle'), 1800)
  }

  return (
    <>
      <main className="bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 1. BREADCRUMB ─────────────────────────────────────────────── */}
          <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-dark/40 text-sm mb-8">
            <Link href="/"      className="hover:text-dark transition-colors">Home</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href="/shop"  className="hover:text-dark transition-colors">Shop</Link>
            <ChevronRight size={14} aria-hidden="true" />
            <Link href={`/shop/${product.category}`} className="hover:text-dark transition-colors">
              {categoryLabel(product.category)}
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="text-dark/70">{product.name}</span>
          </nav>

          {/* 2. PRODUCT LAYOUT ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* LEFT — Image gallery ─────────────────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* Main image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white cursor-zoom-in group">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                {isOnSale && (
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full pointer-events-none z-10">
                    −{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`View image ${idx + 1}`}
                      aria-pressed={activeImage === idx}
                      className={cn(
                        'relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0 border-2 transition-all duration-150',
                        activeImage === idx ? 'border-primary' : 'border-transparent hover:border-dark/20'
                      )}
                    >
                      <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Product info (sticky on desktop) ────────────── */}
            <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">

              {/* Category + name */}
              <div className="flex flex-col gap-2">
                <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                  {categoryLabel(product.category)}
                </span>
                <h1 className="font-display text-3xl md:text-4xl text-dark leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <StarRow rating={product.rating} />
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-sm text-dark/50 hover:text-primary transition-colors underline underline-offset-2"
                >
                  ({product.reviewCount} reviews)
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 flex-wrap">
                {isOnSale ? (
                  <>
                    <span className="font-mono text-3xl font-bold text-primary">
                      {formatPrice(variantPrice)}
                    </span>
                    <span className="font-mono text-lg text-dark/40 line-through">
                      {formatPrice(product.price + (selectedVariant?.priceModifier ?? 0))}
                    </span>
                    <span className="bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Save {discount}%
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-3xl font-bold text-dark">
                    {formatPrice(variantPrice)}
                  </span>
                )}
              </div>

              {/* Stock status */}
              {product.inStock ? (
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <CheckCircle2 size={16} aria-hidden="true" />
                  In Stock ({product.stockCount} remaining)
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-danger text-sm font-medium">
                    <XCircle size={16} aria-hidden="true" />
                    Out of Stock
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Enter your email for restock alert"
                      className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button type="button"
                      className="bg-dark text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-dark/80 transition-colors whitespace-nowrap"
                    >
                      Notify Me
                    </button>
                  </div>
                </div>
              )}

              {/* Variant selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-dark">
                    {product.variants[0].name}:{' '}
                    <span className="font-normal text-dark/60">{selectedVariant?.value}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        disabled={!v.inStock}
                        onClick={() => setSelectedVariant(v)}
                        aria-pressed={selectedVariant?.id === v.id}
                        className={cn(
                          'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-150',
                          !v.inStock && 'opacity-40 cursor-not-allowed line-through',
                          selectedVariant?.id === v.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-dark/15 text-dark hover:border-dark/30'
                        )}
                      >
                        {v.value}
                        {v.priceModifier && v.priceModifier !== 0 && (
                          <span className="ml-1 text-xs opacity-70">
                            {v.priceModifier > 0 ? `+${formatPrice(v.priceModifier)}` : formatPrice(v.priceModifier)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              {product.inStock && (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-dark">Quantity</p>
                  <div className="flex items-center w-fit">
                    <button type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="flex items-center justify-center w-10 h-10 rounded-l-xl border border-dark/15 hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <div
                      className="flex items-center justify-center w-14 h-10 border-t border-b border-dark/15 text-dark font-semibold text-sm"
                      aria-live="polite"
                      aria-label={`Quantity: ${quantity}`}
                    >
                      {quantity}
                    </div>
                    <button type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      disabled={quantity >= product.stockCount}
                      aria-label="Increase quantity"
                      className="flex items-center justify-center w-10 h-10 rounded-r-xl border border-dark/15 hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart — morphs on state */}
              <motion.button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                layout
                className={cn(
                  'flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-semibold transition-colors duration-300',
                  product.inStock
                    ? cartState === 'added'
                      ? 'bg-success text-white'
                      : 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-dark/10 text-dark/30 cursor-not-allowed'
                )}
              >
                <AnimatePresence mode="wait">
                  {cartState === 'added' ? (
                    <motion.span key="added"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 size={20} aria-hidden="true" />
                      Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={20} aria-hidden="true" />
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist + returns */}
              <div className="flex items-center justify-between gap-4">
                <button type="button"
                  onClick={() => setWishlisted((w) => !w)}
                  aria-pressed={wishlisted}
                  className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors"
                >
                  <Heart size={15} aria-hidden="true" className={wishlisted ? 'fill-primary text-primary' : ''} />
                  {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
                <span className="flex items-center gap-1.5 text-dark/40 text-xs">
                  <Shield size={13} aria-hidden="true" />
                  Covered by our returns policy
                </span>
              </div>

              {/* Delivery info */}
              <div className="bg-white rounded-2xl border border-dark/8 p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-dark/70">
                  <Truck size={15} className="text-dark/40 flex-shrink-0" aria-hidden="true" />
                  <span><span className="font-medium text-dark">Free delivery</span> — Nairobi CBD &amp; surrounds</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-dark/70">
                  <Package size={15} className="text-dark/40 flex-shrink-0" aria-hidden="true" />
                  <span><span className="font-medium text-dark">KSh 300</span> — Standard nationwide delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-dark/70">
                  <Clock size={15} className="text-dark/40 flex-shrink-0" aria-hidden="true" />
                  Same-day dispatch on orders placed before 2 pm
                </div>
              </div>

            </div>
          </div>

          {/* 3. TABBED DETAILS ──────────────────────────────────────────── */}
          <div className="mt-16">

            {/* Tab bar */}
            <div className="flex border-b border-dark/10 mb-8" role="tablist">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative px-6 py-3 text-sm font-medium transition-colors',
                    activeTab === tab.id ? 'text-dark' : 'text-dark/40 hover:text-dark'
                  )}
                >
                  {tab.label}
                  {/* Sliding underline indicator */}
                  {activeTab === tab.id && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'description' && (
                  <div className="max-w-2xl">
                    <p className="text-dark/70 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'specs' && (
                  product.specs && Object.keys(product.specs).length > 0 ? (
                    <table className="w-full max-w-lg text-sm border-collapse">
                      <tbody>
                        {Object.entries(product.specs).map(([key, val]) => (
                          <tr key={key} className="border-b border-dark/8 last:border-b-0">
                            <td className="py-3 pr-6 text-dark/50 font-medium w-2/5">{key}</td>
                            <td className="py-3 text-dark">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-dark/40 text-sm">No specifications available.</p>
                  )
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                      <h2 className="font-display text-2xl text-dark">Customer Reviews</h2>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(true)}
                        className="border-2 border-dark/20 text-dark/60 hover:border-dark hover:text-dark font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
                      >
                        Write a Review
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      {/* Rating breakdown */}
                      <div className="flex flex-col gap-4">
                        <div className="text-center">
                          <p className="font-mono text-6xl font-bold text-dark">{product.rating.toFixed(1)}</p>
                          <StarRow rating={product.rating} size={20} />
                          <p className="text-dark/50 text-sm mt-1">{product.reviewCount} reviews</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {ratingBreakdown.map(({ star, count, pct }) => (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="text-dark/50 w-4 text-right">{star}</span>
                              <Star size={12} className="fill-accent text-accent flex-shrink-0" aria-hidden="true" />
                              <div className="flex-1 h-1.5 bg-dark/10 rounded-full overflow-hidden">
                                <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-dark/40 w-6">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Review cards */}
                      <div className="lg:col-span-2 flex flex-col gap-5">
                        {MOCK_REVIEWS.map((review) => (
                          <article key={review.id} className="bg-white rounded-2xl border border-dark/8 p-5 flex flex-col gap-3">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                              <div className="flex flex-col gap-1">
                                <StarRow rating={review.rating} size={14} />
                                <p className="font-semibold text-dark text-sm">{review.title}</p>
                              </div>
                              {review.verified && (
                                <span className="flex items-center gap-1 bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0">
                                  <CheckCircle2 size={12} aria-hidden="true" /> Verified Purchase
                                </span>
                              )}
                            </div>
                            <p className="text-dark/70 text-sm leading-relaxed">{review.body}</p>
                            <p className="text-dark/40 text-xs">{review.author} &middot; {formatReviewDate(review.date)}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 4. RELATED PRODUCTS ────────────────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-8 border-t border-dark/10">
              <h2 className="font-display text-2xl md:text-3xl text-dark mb-8">
                Customers Also Bought
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Review modal */}
      <AnimatePresence>
        {reviewModalOpen && <ReviewModal onClose={() => setReviewModalOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
