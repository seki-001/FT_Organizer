'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Lock, Shield, Tag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import CartLineItem from '@/components/checkout/CartLineItem'

const PROMO_CODES: Record<string, number> = {
  FIRSTORDER: 0.1,
  FAITH20: 0.2,
}

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [promoError, setPromoError] = useState('')

  const discount = appliedPromo ? PROMO_CODES[appliedPromo] ?? 0 : 0
  const discountAmt = Math.round(totalPrice * discount)
  const finalTotal = totalPrice - discountAmt

  function applyPromo() {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code] !== undefined) {
      setAppliedPromo(code)
      setPromoError('')
      setPromoInput('')
    } else {
      setPromoError('Invalid code. Try FIRSTORDER or FAITH20.')
    }
  }

  if (items.length === 0) {
    return (
      <main className="bg-surface min-h-[60vh] overflow-x-hidden">
        <div className="section-container py-20 flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag size={36} className="text-dark/20" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-dark">Your cart is empty</h1>
            <p className="text-dark/55 text-sm mt-2 max-w-sm">
              Explore our curated organizing essentials — kitchen, closet, office, and more.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center min-h-[48px] px-8 rounded-button bg-primary text-white font-semibold hover:bg-danger transition-colors"
          >
            Start shopping
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-surface overflow-x-hidden min-w-0">
      <div className="section-container py-8 md:py-14 min-w-0">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-dark/50 hover:text-dark mb-6 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Continue shopping
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-dark mb-8">
          Your cart
          <span className="ml-2 font-sans font-normal text-dark/40 text-xl">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="card-surface border border-dark/8 px-4 sm:px-6">
              <ul role="list">
                {items.map((item) => (
                  <CartLineItem
                    key={`${item.product.id}-${item.variant?.id ?? 'base'}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="card-surface border border-dark/8 p-6 flex flex-col gap-5 lg:sticky lg:top-24">
              <h2 className="font-display text-xl text-dark">Order summary</h2>

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-dark/60">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-dark">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-success">
                    <span className="flex items-center gap-1">
                      <Tag size={13} aria-hidden="true" />
                      {appliedPromo}
                    </span>
                    <span className="font-mono">−{formatPrice(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-dark/60">
                  <span>Delivery</span>
                  <span className="text-dark/45 italic text-xs">At checkout</span>
                </div>
              </div>

              <div className="border-t border-dark/8 pt-4 flex justify-between items-center">
                <span className="font-semibold text-dark">Estimated total</span>
                <span className="font-mono text-2xl font-bold text-dark">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="promo" className="text-sm font-medium text-dark">
                  Promo code
                </label>
                <div className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value)
                      setPromoError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    placeholder="Enter code"
                    disabled={!!appliedPromo}
                    className="input-base flex-1 text-sm disabled:opacity-50"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null)
                        setPromoInput('')
                      }}
                      className="text-sm text-danger px-3 hover:underline"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 rounded-button bg-dark text-white text-sm font-medium hover:bg-dark/90"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && <p className="text-xs text-danger">{promoError}</p>}
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center w-full min-h-[52px] rounded-button bg-primary text-white font-semibold hover:bg-danger transition-colors"
              >
                Proceed to checkout
              </Link>

              <div className="flex flex-col gap-2 text-xs text-dark/45 pt-1">
                <p className="flex items-center gap-2">
                  <Lock size={13} aria-hidden="true" />
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <Shield size={13} aria-hidden="true" />
                  Confidentiality on every order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
