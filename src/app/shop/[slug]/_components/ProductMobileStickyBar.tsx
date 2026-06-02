'use client'

import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { Product, ProductVariant } from '@/lib/types'
import MobileStickyBar from '@/components/ui/MobileStickyBar'
import { formatPrice } from '@/lib/utils'

interface ProductMobileStickyBarProps {
  product: Product
  selectedVariant?: ProductVariant
  quantity: number
}

export default function ProductMobileStickyBar({
  product,
  selectedVariant,
  quantity,
}: ProductMobileStickyBarProps) {
  const { addItem, openCart, updateQuantity } = useCart()

  const price =
    (product.salePrice ?? product.price) + (selectedVariant?.priceModifier ?? 0)
  const lineTotal = price * quantity

  function handleAdd() {
    if (!product.inStock) return
    addItem(product, selectedVariant)
    if (quantity > 1) {
      updateQuantity(product.id, selectedVariant?.id, quantity)
    }
    openCart()
  }

  if (!product.inStock) return null

  return (
    <MobileStickyBar>
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wide text-dark/45 font-medium">Total</p>
          <p className="font-mono font-bold text-dark text-lg leading-tight">
            {formatPrice(lineTotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 min-h-[48px] max-w-[220px]',
            'rounded-button bg-primary text-white font-semibold text-sm hover:bg-danger transition-colors',
          )}
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Add to cart
        </button>
      </div>
    </MobileStickyBar>
  )
}
