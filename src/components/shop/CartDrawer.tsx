'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import CartLineItem from '@/components/checkout/CartLineItem'

export default function CartDrawer() {
  const { items, totalItems, totalPrice, isCartOpen, closeCart, removeItem, updateQuantity } =
    useCart()

  useEffect(() => {
    if (!isCartOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isCartOpen, closeCart])

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/40 z-40"
            onClick={closeCart}
            aria-hidden="true"
          />

          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col border-l border-dark/10"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark/8 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" aria-hidden="true" />
                <h2 className="font-display text-lg text-dark">
                  Your cart
                  <span className="font-sans font-normal text-dark/45 text-sm ml-2">
                    ({totalItems})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="flex items-center justify-center w-10 h-10 rounded-button text-dark/45 hover:text-dark hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-16 px-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag size={28} className="text-dark/25" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-xl text-dark">Your cart is empty</p>
                    <p className="text-dark/50 text-sm mt-1">Curated organizers for every room.</p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-button bg-primary text-white text-sm font-semibold hover:bg-danger transition-colors"
                  >
                    Browse shop
                  </Link>
                </div>
              ) : (
                <ul role="list">
                  {items.map((item) => (
                    <CartLineItem
                      key={`${item.product.id}-${item.variant?.id ?? 'base'}`}
                      item={item}
                      compact
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-dark/8 px-5 py-5 flex flex-col gap-4 flex-shrink-0 bg-white">
                <p className="text-xs text-dark/50 text-center">
                  Free delivery in Nairobi CBD · dispatch before 2 pm
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark/60">Subtotal</span>
                  <span className="font-mono font-bold text-lg text-dark">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full min-h-[48px] rounded-button bg-primary text-white font-semibold text-sm hover:bg-danger transition-colors"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center w-full min-h-[44px] rounded-button border border-dark/12 text-dark text-sm font-medium hover:bg-muted transition-colors"
                  >
                    View full cart
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
