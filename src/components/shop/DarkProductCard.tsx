import ShopProductCard from '@/components/ui/commerce/ShopProductCard'
import type { Product } from '@/lib/types'

interface DarkProductCardProps {
  product: Product
}

/** @deprecated Use ShopProductCard — kept for import compatibility */
export default function DarkProductCard({ product }: DarkProductCardProps) {
  return <ShopProductCard product={product} />
}
