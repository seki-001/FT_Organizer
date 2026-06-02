'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Minus, Plus, ShoppingBag, Truck, Package, Clock, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import type { Product, ProductVariant } from '@/lib/types'
import { categoryLabel } from '@/lib/shop-utils'
import ProductPrice from '@/components/shop/ProductPrice'
import StockBadge from '@/components/shop/StockBadge'

type CartBtnState = 'idle' | 'adding' | 'added'

interface ProductPurchasePanelProps {
  product: Product
}

export default function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const router = useRouter()
  const { addItem, openCart, updateQuantity } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.inStock) ?? product.variants?.[0],
  )
  const [quantity, setQuantity] = useState(1)
  const [cartState, setCartState] = useState<CartBtnState>('idle')
  const [notifyEmail, setNotifyEmail] = useState('')

  const wishlisted = isInWishlist(product.id)
  function addWithQuantity() {
    if (!product.inStock || cartState !== 'idle') return
    setCartState('adding')
    addItem(product, selectedVariant)
    if (quantity > 1) {
      updateQuantity(product.id, selectedVariant?.id, quantity)
    }
    setTimeout(() => setCartState('added'), 250)
    setTimeout(() => setCartState('idle'), 2000)
  }

  function handleAddToCart() {
    addWithQuantity()
    openCart()
  }

  function handleBuyNow() {
    addWithQuantity()
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {categoryLabel(product.category)}
        </span>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-dark leading-tight">
          {product.name}
        </h1>
      </div>

      <ProductPrice product={product} priceModifier={selectedVariant?.priceModifier ?? 0} size="lg" />

      <StockBadge inStock={product.inStock} stockCount={product.stockCount} size="md" />

      {!product.inStock && (
        <div className="card-surface border border-dark/8 p-4 flex flex-col gap-2">
          <p className="text-sm text-dark/60">Get notified when this item is back.</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="Your email"
              className="input-base flex-1 text-sm"
            />
            <button
              type="button"
              className="shrink-0 px-4 rounded-button bg-dark text-white text-sm font-medium hover:bg-dark/90"
            >
              Notify me
            </button>
          </div>
          <p className="text-[10px] text-dark/40">Preview — alerts not sent yet.</p>
        </div>
      )}

      {product.variants && product.variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-dark">
            {product.variants[0].name}:{' '}
            <span className="font-normal text-dark/55">{selectedVariant?.value}</span>
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
                  'px-3 py-2 rounded-button border text-sm font-medium transition-colors min-h-[40px]',
                  !v.inStock && 'opacity-40 cursor-not-allowed line-through',
                  selectedVariant?.id === v.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-dark/12 text-dark hover:border-dark/25',
                )}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.inStock && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-dark">Quantity</p>
          <div className="flex items-center w-fit border border-dark/12 rounded-button overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex items-center justify-center w-11 h-11 hover:bg-muted disabled:opacity-40"
            >
              <Minus size={16} />
            </button>
            <span
              className="flex items-center justify-center w-12 h-11 text-sm font-semibold text-dark border-x border-dark/12"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
              disabled={quantity >= product.stockCount}
              aria-label="Increase quantity"
              className="flex items-center justify-center w-11 h-11 hover:bg-muted disabled:opacity-40"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 min-h-[52px] rounded-button text-base font-semibold transition-colors',
            product.inStock
              ? cartState === 'added'
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:bg-danger'
              : 'bg-muted text-dark/35 cursor-not-allowed',
          )}
        >
          <ShoppingBag size={20} aria-hidden="true" />
          {cartState === 'added' ? 'Added to cart' : product.inStock ? 'Add to cart' : 'Out of stock'}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!product.inStock}
          className={cn(
            'flex-1 min-h-[52px] rounded-button text-base font-semibold border-2 transition-colors',
            product.inStock
              ? 'border-dark text-dark hover:bg-dark hover:text-white'
              : 'border-dark/10 text-dark/30 cursor-not-allowed',
          )}
        >
          Buy now
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-pressed={wishlisted}
          className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors"
        >
          <Heart size={16} className={wishlisted ? 'fill-primary text-primary' : ''} />
          {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
        </button>
        <span className="flex items-center gap-1.5 text-dark/40 text-xs">
          <Shield size={13} aria-hidden="true" />
          Returns policy applies
        </span>
      </div>

      <div className="card-surface border border-dark/8 p-4 flex flex-col gap-3 text-sm text-dark/65">
        <p className="text-xs font-semibold uppercase tracking-widest text-dark/40">Delivery</p>
        <div className="flex items-start gap-3">
          <Truck size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong className="text-dark font-medium">Free</strong> — Nairobi CBD &amp; select areas
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Package size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong className="text-dark font-medium">KSh 300</strong> — Standard nationwide (2–4 days)
          </span>
        </div>
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <span>Same-day dispatch on orders before 2 pm</span>
        </div>
      </div>

      <p className="text-xs text-dark/40">
        Need help choosing?{' '}
        <Link href="/contact" className="text-primary hover:underline">
          Ask Faith&apos;s team
        </Link>
      </p>
    </div>
  )
}
