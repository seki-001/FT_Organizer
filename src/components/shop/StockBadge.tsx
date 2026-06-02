import { cn } from '@/lib/utils'

interface StockBadgeProps {
  inStock: boolean
  stockCount?: number
  size?: 'sm' | 'md'
  className?: string
}

export default function StockBadge({
  inStock,
  stockCount,
  size = 'sm',
  className,
}: StockBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        inStock ? 'bg-success/12 text-success' : 'bg-dark/8 text-dark/50',
        className,
      )}
    >
      {inStock
        ? stockCount !== undefined && stockCount <= 5
          ? `Low stock · ${stockCount} left`
          : 'In stock'
        : 'Out of stock'}
    </span>
  )
}
