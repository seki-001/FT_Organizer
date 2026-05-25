'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Eye, X, Star, Truck, Clock } from 'lucide-react'
import { cn, formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'
import { SHOP_CATEGORIES } from '@/lib/constants'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function categoryLabel(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          aria-hidden="true"
          className={i < Math.round(rating) ? 'fill-accent text-accent' : 'text-dark/20'}
        />
      ))}
    </span>
  )
}

// ─── Quick View Modal ─────────────────────────────────────────────────────────

function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem, openCart } = useCart()
  const [added, setAdded] = useState(false)
  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleAdd() {
    if (!product.inStock) return
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] bg-dark/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-5 right-5 text-dark/30 hover:text-dark transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 300px"
            />
            {isOnSale && (
              <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium rounded-full px-3 py-1">
                −{discountPercent(product.price, product.salePrice!)}%
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">
              {categoryLabel(product.category)}
            </p>
            <h2 className="font-display text-xl text-dark leading-snug">{product.name}</h2>

            <div className="flex items-center gap-2">
              <StarRow rating={product.rating} />
              <span className="text-dark/40 text-xs">({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {isOnSale ? (
                <>
                  <span className="font-mono font-semibold text-primary text-lg">
                    {formatPrice(product.salePrice!)}
                  </span>
                  <span className="font-mono text-sm text-dark/40 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-mono font-semibold text-dark text-lg">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-dark/60 text-sm leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Delivery */}
            <div className="bg-muted rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-dark/60">
                <Truck size={13} className="text-dark/40 flex-shrink-0" aria-hidden="true" />
                Free delivery in Nairobi CBD
              </div>
              <div className="flex items-center gap-2 text-xs text-dark/60">
                <Clock size={13} className="text-dark/40 flex-shrink-0" aria-hidden="true" />
                Same-day dispatch before 2 pm
              </div>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAdd}
              disabled={!product.inStock}
              className={cn(
                'w-full py-3 rounded-xl font-medium text-sm transition-colors',
                product.inStock
                  ? added
                    ? 'bg-success text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-dark/10 text-dark/30 cursor-not-allowed'
              )}
            >
              {product.inStock ? (added ? '✓ Added to Cart' : 'Add to Cart') : 'Out of Stock'}
            </button>

            <Link
              href={`/shop/${product.slug}`}
              onClick={onClose}
              className="text-center text-dark/50 text-sm font-medium hover:text-dark"
            >
              View Full Details →
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart()
  const [wishlisted, setWishlisted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price
  const discount = isOnSale ? discountPercent(product.price, product.salePrice!) : 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!product.inStock) return
    addItem(product)
    openCart()
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 1800)
  }

  return (
    <>
      <motion.article
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)' }}
        transition={{ duration: 0.2 }}
      >
        {/* Image container */}
        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
          <Link href={`/shop/${product.slug}`} tabIndex={-1} aria-hidden="true">
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </motion.div>
          </Link>

          {/* Sale badge */}
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium rounded-full px-3 py-1 z-10 pointer-events-none">
              −{discount}%
            </span>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-dark/40 flex items-center justify-center z-10 pointer-events-none">
              <span className="bg-white text-dark text-xs font-semibold px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Hover quick actions — slide in from right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <AnimatePresence>
              {hovered && (
                <>
                  <motion.button
                    key="wishlist"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    type="button"
                    onClick={() => setWishlisted((w) => !w)}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    aria-pressed={wishlisted}
                    className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={15}
                      className={wishlisted ? 'fill-primary text-primary' : 'text-dark/40'}
                    />
                  </motion.button>

                  <motion.button
                    key="quickview"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.18, delay: 0.06 }}
                    type="button"
                    onClick={() => setQuickViewOpen(true)}
                    aria-label={`Quick view ${product.name}`}
                    className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Eye size={15} className="text-dark/40" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Card content */}
        <div className="flex flex-col gap-1.5 pt-4 px-1 pb-2 flex-1">
          <p className="text-dark/40 text-[10px] font-semibold uppercase tracking-wider">
            {categoryLabel(product.category)}
          </p>

          <Link
            href={`/shop/${product.slug}`}
            className="font-medium text-dark text-sm leading-snug hover:text-primary transition-colors duration-150 line-clamp-2"
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-1.5">
            <StarRow rating={product.rating} />
            <span className="text-dark/35 text-[10px]">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-0.5">
            {isOnSale ? (
              <>
                <span className="font-mono text-sm font-semibold text-primary">
                  {formatPrice(product.salePrice!)}
                </span>
                <span className="font-mono text-xs text-dark/35 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-mono text-sm font-semibold text-dark">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart — slides up on hover */}
          <div className="mt-1.5 min-h-[0px]">
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={cn(
                    'w-full py-2.5 rounded-lg text-sm font-medium transition-colors',
                    product.inStock
                      ? addedFeedback
                        ? 'bg-success text-white'
                        : 'bg-primary hover:bg-primary/90 text-white'
                      : 'bg-dark/10 text-dark/30 cursor-not-allowed'
                  )}
                >
                  {addedFeedback ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.article>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewOpen && (
          <QuickViewModal product={product} onClose={() => setQuickViewOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
