'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingCart, Lock, Shield, Tag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice, cn } from '@/lib/utils'

// ─── Promo codes ─────────────────────────────────────────────────────────────

const PROMO_CODES: Record<string, number> = {
  FIRSTORDER: 0.10,
  FAITH20:    0.20,
}

// ─── Cart Item Row ────────────────────────────────────────────────────────────

function CartItemRow({
  item,
}: {
  item: ReturnType<typeof useCart>['items'][number]
}) {
  const { updateQuantity, removeItem } = useCart()
  const linePrice = (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0)

  return (
    <div className="flex items-start gap-4 py-5 border-b border-dark/8 last:border-b-0">
      {/* Thumbnail */}
      <Link href={`/shop/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Link
          href={`/shop/${item.product.slug}`}
          className="font-medium text-dark text-sm leading-snug hover:text-primary transition-colors duration-150 line-clamp-2"
        >
          {item.product.name}
        </Link>
        {item.variant && (
          <p className="text-dark/50 text-xs">{item.variant.name}: {item.variant.value}</p>
        )}
        <p className="font-mono text-sm font-semibold text-dark">
          {formatPrice(linePrice * item.quantity)}
        </p>
      </div>

      {/* Quantity + remove */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        {/* Quantity adjuster */}
        <div className="flex items-center gap-0">
          <button
            type="button"
            onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="flex items-center justify-center w-8 h-8 rounded-l-lg border border-dark/15 hover:bg-muted disabled:opacity-40 transition-colors duration-150"
          >
            <Minus size={13} />
          </button>
          <div className="flex items-center justify-center w-10 h-8 border-t border-b border-dark/15 text-dark font-semibold text-sm">
            {item.quantity}
          </div>
          <button
            type="button"
            onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stockCount}
            aria-label="Increase quantity"
            className="flex items-center justify-center w-8 h-8 rounded-r-lg border border-dark/15 hover:bg-muted disabled:opacity-40 transition-colors duration-150"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={() => removeItem(item.product.id, item.variant?.id)}
          aria-label={`Remove ${item.product.name} from cart`}
          className="flex items-center gap-1 text-dark/40 hover:text-danger text-xs transition-colors duration-150"
        >
          <Trash2 size={13} aria-hidden="true" /> Remove
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { items, totalItems, totalPrice } = useCart()

  const [promoInput, setPromoInput]       = useState('')
  const [appliedPromo, setAppliedPromo]   = useState<string | null>(null)
  const [promoError, setPromoError]       = useState('')

  const discount     = appliedPromo ? PROMO_CODES[appliedPromo] ?? 0 : 0
  const discountAmt  = Math.round(totalPrice * discount)
  const finalTotal   = totalPrice - discountAmt

  function applyPromo() {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code] !== undefined) {
      setAppliedPromo(code)
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Invalid promo code. Try FIRSTORDER or FAITH20.')
    }
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-6">
          <ShoppingCart size={64} className="text-dark/15" aria-hidden="true" />
          <div>
            <h1 className="font-display text-3xl text-dark mb-2">Your cart is empty</h1>
            <p className="text-dark/50">Add some products to get started.</p>
          </div>
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    )
  }

  // ── Filled cart ─────────────────────────────────────────────────────────
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl md:text-4xl text-dark mb-8">
          Your Cart
          <span className="ml-3 font-sans font-normal text-dark/40 text-xl">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-dark/8 px-4 sm:px-6">
              {items.map((item) => (
                <CartItemRow key={`${item.product.id}-${item.variant?.id ?? 'no-variant'}`} item={item} />
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/shop"
                className="text-sm text-dark/50 hover:text-primary transition-colors duration-150 flex items-center gap-1"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* RIGHT — Order summary */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-dark/8 p-6 flex flex-col gap-4">
              <h2 className="font-display text-xl text-dark">Order Summary</h2>

              {/* Line items */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/60">Subtotal</span>
                  <span className="font-mono font-semibold text-dark">{formatPrice(totalPrice)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <Tag size={13} aria-hidden="true" />
                      {appliedPromo} ({Math.round(discount * 100)}% off)
                    </span>
                    <span className="font-mono">−{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark/60">Delivery</span>
                  <span className="text-dark/60 italic">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-dark/8 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-dark">Total</span>
                  <span className="font-mono text-2xl font-bold text-dark">{formatPrice(finalTotal)}</span>
                </div>
                {appliedPromo && (
                  <p className="text-success text-xs mt-1 text-right">
                    You&apos;re saving {formatPrice(discountAmt)}!
                  </p>
                )}
              </div>

              {/* Promo code */}
              <div className="flex flex-col gap-2">
                <label htmlFor="promo" className="text-sm font-medium text-dark">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="Enter code"
                    disabled={!!appliedPromo}
                    className={cn(
                      'flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm text-dark placeholder:text-dark/30 outline-none focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50',
                    )}
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => { setAppliedPromo(null); setPromoInput('') }}
                      className="text-sm text-danger/70 hover:text-danger px-2 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="bg-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-dark/80 transition-colors duration-200 whitespace-nowrap"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && <p className="text-danger text-xs">{promoError}</p>}
              </div>

              {/* Checkout options */}
              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout?mode=account"
                  className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-semibold text-base py-4 rounded-xl transition-colors duration-200 min-h-[54px] shadow-sm shadow-primary/20"
                >
                  Create Account &amp; Checkout
                </Link>
                <Link
                  href="/checkout?mode=guest"
                  className="flex items-center justify-center w-full bg-white border-2 border-dark/12 hover:border-primary text-dark font-semibold text-sm py-3.5 rounded-xl transition-colors duration-200"
                >
                  Continue as Guest
                </Link>
              </div>
              <p className="text-center text-dark/40 text-xs">
                Accounts track orders, promos, and organizing tips — guest checkout is still quick.
              </p>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-6 pt-1">
                <div className="flex items-center gap-1.5 text-dark/40 text-xs">
                  <Lock size={13} aria-hidden="true" />
                  Secure checkout
                </div>
                <div className="flex items-center gap-1.5 text-dark/40 text-xs">
                  <Shield size={13} aria-hidden="true" />
                  Confidentiality guaranteed
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
