'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { cn, formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'
import { SHOP_CATEGORIES } from '@/lib/constants'

interface ShopProductCardProps {
  product: Product
  variant?: 'grid' | 'carousel'
  showAddToCart?: boolean
  className?: string
}

function categoryLabel(slug: string) {
  return SHOP_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug.replace(/-/g, ' ')
}

export default function ShopProductCard({
  product,
  variant = 'grid',
  showAddToCart = true,
  className,
}: ShopProductCardProps) {
  const { addItem, openCart } = useCart()
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)

  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price
  const discount = isOnSale ? discountPercent(product.price, product.salePrice!) : 0
  const price = product.salePrice ?? product.price

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <motion.article
      className={cn(
        'sfs-card group flex flex-col h-full',
        variant === 'carousel' && 'min-w-[220px] sm:min-w-[260px] snap-start',
        className,
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ y: hovered ? -4 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/shop/${product.slug}`} className="flex flex-col flex-1">
        <div className="relative m-3 mb-0 aspect-[4/5] img-frame-lg bg-muted img-zoom">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes={variant === 'carousel' ? '260px' : '(max-width: 640px) 50vw, 33vw'}
          />
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-0 bg-dark/40 flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider">
              Sold out
            </span>
          )}
          {showAddToCart && product.inStock && (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                'absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sfs-md',
                added
                  ? 'bg-success text-white opacity-100'
                  : 'bg-white text-dark opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white',
              )}
            >
              <ShoppingBag size={16} />
            </button>
          )}
        </div>

        <div className="p-4 pt-3 flex flex-col flex-1 gap-1.5">
          <p className="sfs-label text-dark/40">{categoryLabel(product.category)}</p>
          <h3 className="font-medium text-sm text-dark line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <Star size={11} className="fill-accent text-accent" aria-hidden="true" />
            <span className="text-xs text-dark/45">{(product.rating ?? 0).toFixed(1)}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto pt-1">
            <span className="font-mono font-semibold text-dark text-sm">{formatPrice(price)}</span>
            {isOnSale && (
              <span className="font-mono text-xs text-dark/35 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
