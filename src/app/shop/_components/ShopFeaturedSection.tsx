import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import ProductCard from '@/components/shop/ProductCard'

interface ShopFeaturedSectionProps {
  products: Product[]
}

export default function ShopFeaturedSection({ products }: ShopFeaturedSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="mb-12" aria-labelledby="shop-featured-heading">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            Faith&apos;s picks
          </p>
          <h2 id="shop-featured-heading" className="font-display text-2xl text-dark">
            Featured essentials
          </h2>
          <p className="text-sm text-dark/55 mt-1 max-w-md">
            Curated staples for kitchens, closets, and workspaces — the pieces we reach for on site.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
