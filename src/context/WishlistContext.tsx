'use client'

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/types'

// ─── State ────────────────────────────────────────────────────────────────────

interface WishlistState {
  items: Product[]
}

type WishlistAction =
  | { type: 'ADD';    product: Product }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' }

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'ADD':
      if (state.items.find((i) => i.id === action.product.id)) return state
      return { items: [...state.items, action.product] }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.productId) }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface WishlistContextValue {
  items:             Product[]
  totalItems:        number
  addItem:           (product: Product) => void
  removeItem:        (productId: string) => void
  isInWishlist:      (productId: string) => boolean
  toggleWishlist:    (product: Product) => void
  clearWishlist:     () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] })

  const value = useMemo<WishlistContextValue>(() => ({
    items:          state.items,
    totalItems:     state.items.length,
    addItem:        (product)   => dispatch({ type: 'ADD',    product }),
    removeItem:     (productId) => dispatch({ type: 'REMOVE', productId }),
    isInWishlist:   (productId) => state.items.some((i) => i.id === productId),
    toggleWishlist: (product)   =>
      state.items.find((i) => i.id === product.id)
        ? dispatch({ type: 'REMOVE', productId: product.id })
        : dispatch({ type: 'ADD', product }),
    clearWishlist:  ()          => dispatch({ type: 'CLEAR' }),
  }), [state.items])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside <WishlistProvider>')
  return ctx
}
