'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isCartOpen, closeCart, removeItem, updateQuantity } = useCart()

  // Close on Escape
  useEffect(() => {
    if (!isCartOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isCartOpen, closeCart])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-dark/30 z-40"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark/8 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-dark/50" aria-hidden="true" />
                <h2 className="font-display text-lg text-dark">
                  Your Cart
                  <span className="font-sans font-normal text-dark/40 text-sm ml-2">
                    ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-dark/40 hover:text-dark hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
                    <ShoppingBag size={32} className="text-dark/20" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-xl text-dark">Your cart is empty</p>
                    <p className="text-dark/50 text-sm mt-1">Add products to get started</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="bg-dark hover:bg-dark/80 text-white text-sm font-medium px-6 py-3 rounded-xl transition-colors"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-dark/6" role="list">
                  {items.map((item) => {
                    const effectivePrice = (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0)
                    const key = `${item.product.id}-${item.variant?.id ?? 'no-variant'}`

                    return (
                      <li key={key} className="flex gap-4 py-4">
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <p className="text-dark text-sm font-medium leading-snug line-clamp-2">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-dark/45 text-xs">{item.variant.value}</p>
                          )}
                          <p className="font-mono text-sm font-semibold text-primary">
                            {formatPrice(effectivePrice * item.quantity)}
                          </p>
                        </div>

                        {/* Qty + remove */}
                        <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                          {/* Quantity controls */}
                          <div className="flex items-center border border-dark/15 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex items-center justify-center w-7 h-7 hover:bg-muted transition-colors text-dark/50"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-7 h-7 flex items-center justify-center text-dark text-xs font-semibold border-x border-dark/15">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex items-center justify-center w-7 h-7 hover:bg-muted transition-colors text-dark/50"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id, item.variant?.id)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-dark/25 hover:text-danger transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer — subtotal + CTAs */}
            {items.length > 0 && (
              <div className="border-t border-dark/8 px-5 py-5 flex flex-col gap-4 flex-shrink-0 bg-white">
                {/* Free delivery note */}
                <p className="text-xs text-dark/50 text-center">
                  🚚 Free delivery in Nairobi CBD
                </p>

                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-dark/60 text-sm">Subtotal</span>
                  <span className="font-mono font-bold text-dark text-lg">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/checkout?mode=guest"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
                  >
                    Checkout as Guest
                  </Link>
                  <Link
                    href="/checkout?mode=account"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full border border-dark/15 text-dark hover:bg-muted font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    Create Account &amp; Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full border border-dark/15 text-dark hover:bg-muted font-medium py-3 rounded-xl transition-colors text-sm"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
