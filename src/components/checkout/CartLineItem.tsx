'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

interface CartLineItemProps {
  item: CartItem
  onUpdateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void
  onRemove: (productId: string, variantId: string | undefined) => void
  compact?: boolean
}

export default function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: CartLineItemProps) {
  const unitPrice =
    (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0)
  const imageSize = compact ? 'w-16 h-16' : 'w-20 h-20'

  return (
    <li className="flex gap-4 py-4 border-b border-dark/8 last:border-b-0">
      <Link href={`/shop/${item.product.slug}`} className="shrink-0" tabIndex={-1}>
        <div className={cn('relative rounded-xl overflow-hidden bg-muted', imageSize)}>
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes={compact ? '64px' : '80px'}
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          href={`/shop/${item.product.slug}`}
          className="font-medium text-dark text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
        >
          {item.product.name}
        </Link>
        {item.variant && <p className="text-dark/45 text-xs">{item.variant.value}</p>}
        <p className="font-mono text-sm font-semibold text-primary">
          {formatPrice(unitPrice * item.quantity)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
        <div className="flex items-center border border-dark/12 rounded-button overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            className="flex items-center justify-center w-9 h-9 hover:bg-muted text-dark/50"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-dark border-x border-dark/12">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stockCount}
            aria-label="Increase quantity"
            className="flex items-center justify-center w-9 h-9 hover:bg-muted text-dark/50 disabled:opacity-40"
          >
            <Plus size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.product.id, item.variant?.id)}
          aria-label={`Remove ${item.product.name}`}
          className="flex items-center gap-1 text-xs text-dark/40 hover:text-danger transition-colors"
        >
          <Trash2 size={13} aria-hidden="true" />
          {!compact && 'Remove'}
        </button>
      </div>
    </li>
  )
}
