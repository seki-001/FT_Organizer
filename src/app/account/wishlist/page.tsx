'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { formatPrice, discountPercent } from '@/lib/utils'
import type { Product } from '@/lib/types'

// ─── Wishlist product card ────────────────────────────────────────────────────

function WishlistCard({ product }: { product: Product }) {
  const { removeItem } = useWishlist()
  const { addItem }    = useCart()
  const discount       = product.salePrice ? discountPercent(product.price, product.salePrice) : 0

  return (
    <article className="glass-card rounded-xl overflow-hidden flex flex-col group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/shop/${product.slug}`} tabIndex={-1} aria-hidden="true">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Sale badge */}
        {product.salePrice && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            -{discount}%
          </span>
        )}

        {/* Remove from wishlist */}
        <button
          type="button"
          onClick={() => removeItem(product.id)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-150 z-10"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <Heart size={14} fill="currentColor" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/shop/${product.slug}`}>
          <p className="font-medium text-dark text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.floor(product.rating) ? 'text-accent fill-current' : 'text-dark/20'}
              aria-hidden="true"
            />
          ))}
          <span className="text-dark/40 text-xs ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          {product.salePrice ? (
            <>
              <span className="font-mono font-bold text-primary text-sm">{formatPrice(product.salePrice)}</span>
              <span className="font-mono text-dark/40 text-xs line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-mono font-bold text-dark text-sm">{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          type="button"
          disabled={!product.inStock}
          onClick={() => addItem(product)}
          className="flex items-center justify-center gap-2 w-full bg-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 min-h-[40px] mt-1"
        >
          <ShoppingCart size={14} aria-hidden="true" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountWishlistPage() {
  const { items } = useWishlist()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-dark">
          Wishlist
          {items.length > 0 && (
            <span className="ml-2 text-base font-normal text-dark/40">({items.length})</span>
          )}
        </h1>
        {items.length > 0 && (
          <Link href="/shop" className="text-primary text-sm hover:underline">
            Browse more →
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center flex flex-col items-center gap-4">
          <Heart size={48} className="text-dark/20" aria-hidden="true" />
          <p className="text-dark/50">Your wishlist is empty.</p>
          <p className="text-dark/40 text-sm">Save products you love and come back to them later.</p>
          <Link
            href="/shop"
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <WishlistCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
