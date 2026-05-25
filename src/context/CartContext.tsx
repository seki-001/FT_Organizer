'use client'

import { createContext, useContext, useReducer, useState, useMemo, useCallback, type ReactNode } from 'react'
import type { CartItem, Product, ProductVariant } from '@/lib/types'

// ─── State & Actions ─────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; variant?: ProductVariant }
  | { type: 'REMOVE_ITEM'; productId: string; variantId?: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; variantId: string | undefined; quantity: number }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) =>
          i.product.id === action.product.id &&
          i.variant?.id === action.variant?.id
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id && i.variant?.id === action.variant?.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return {
        items: [...state.items, { product: action.product, quantity: 1, variant: action.variant }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) =>
            !(i.product.id === action.productId && i.variant?.id === action.variantId)
        ),
      }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (i) =>
              !(i.product.id === action.productId && i.variant?.id === action.variantId)
          ),
        }
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId && i.variant?.id === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      }
    }

    case 'CLEAR_CART':
      return { items: [] }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product, variant?: ProductVariant) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const openCart  = useCallback(() => setIsCartOpen(true),  [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const totalItems = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  )

  const totalPrice = useMemo(
    () =>
      state.items.reduce((sum, i) => {
        const base = i.product.salePrice ?? i.product.price
        const mod  = i.variant?.priceModifier ?? 0
        return sum + (base + mod) * i.quantity
      }, 0),
    [state.items]
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalItems,
      totalPrice,
      addItem:        (product, variant)               => dispatch({ type: 'ADD_ITEM', product, variant }),
      removeItem:     (productId, variantId)           => dispatch({ type: 'REMOVE_ITEM', productId, variantId }),
      updateQuantity: (productId, variantId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', productId, variantId, quantity }),
      clearCart:      ()                               => dispatch({ type: 'CLEAR_CART' }),
      isCartOpen,
      openCart,
      closeCart,
    }),
    [state.items, totalItems, totalPrice, isCartOpen, openCart, closeCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
