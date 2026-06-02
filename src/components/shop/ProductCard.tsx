'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import type { Product } from '@/lib/types'
import { categoryLabel } from '@/lib/shop-utils'
import ProductPrice from './ProductPrice'
import StockBadge from './StockBadge'

interface ProductCardProps {
  product: Product
  /** Always show Add to Cart (shop grid). Set false for compact related rows if needed. */
  showCta?: boolean
}

export default function ProductCard({ product, showCta = true }: ProductCardProps) {
  const { addItem, openCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [addedFeedback, setAddedFeedback] = useState(false)

  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price
  const discount = isOnSale ? discountPercent(product.price, product.salePrice!) : 0
  const wishlisted = isInWishlist(product.id)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem(product)
    openCart()
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 1800)
  }

  return (
    <article className="card-surface border border-dark/8 overflow-hidden flex flex-col group hover:shadow-card-hover transition-shadow duration-200">
      <Link href={`/shop/${product.slug}`} className="block relative aspect-[4/5] bg-muted overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {isOnSale && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 z-10">
            −{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-dark/35 flex items-center justify-center z-10">
            <span className="bg-white/95 text-dark text-xs font-semibold px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product)
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/95 shadow-sm hover:scale-105 transition-transform"
        >
          <Heart
            size={16}
            className={wishlisted ? 'fill-primary text-primary' : 'text-dark/45'}
          />
        </button>
      </Link>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-dark/45">
          {categoryLabel(product.category)}
        </p>

        <Link
          href={`/shop/${product.slug}`}
          className="font-medium text-dark text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between gap-2 flex-wrap mt-auto pt-1">
          <ProductPrice product={product} size="sm" />
          <StockBadge inStock={product.inStock} stockCount={product.stockCount} />
        </div>

        {showCta && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'mt-2 w-full flex items-center justify-center gap-2 min-h-[44px] rounded-button text-sm font-medium transition-colors',
              product.inStock
                ? addedFeedback
                  ? 'bg-success text-white'
                  : 'bg-primary text-white hover:bg-danger'
                : 'bg-muted text-dark/35 cursor-not-allowed',
            )}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {addedFeedback ? 'Added to cart' : product.inStock ? 'Add to cart' : 'Unavailable'}
          </button>
        )}
      </div>
    </article>
  )
}
