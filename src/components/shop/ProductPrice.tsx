import { formatPrice, discountPercent } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductPriceProps {
  product: Product
  priceModifier?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProductPrice({
  product,
  priceModifier = 0,
  size = 'md',
  className,
}: ProductPriceProps) {
  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price
  const base = isOnSale ? product.salePrice! : product.price
  const display = base + priceModifier
  const compareAt = product.price + priceModifier

  const priceClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'md'
        ? 'text-base'
        : 'text-sm'

  return (
    <div className={cn('flex items-baseline flex-wrap gap-2', className)}>
      <span
        className={cn(
          'font-mono font-semibold',
          priceClass,
          isOnSale ? 'text-primary' : 'text-dark',
        )}
      >
        {formatPrice(display)}
      </span>
      {isOnSale && (
        <>
          <span className={cn('font-mono text-dark/40 line-through', size === 'lg' ? 'text-lg' : 'text-xs')}>
            {formatPrice(compareAt)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            −{discountPercent(product.price, product.salePrice!)}%
          </span>
        </>
      )}
    </div>
  )
}
