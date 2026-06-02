'use client'

import { useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { categoryLabel } from '@/lib/shop-utils'
import { discountPercent } from '@/lib/utils'
import ProductCard from '@/components/shop/ProductCard'
import ProductGallery from './_components/ProductGallery'
import ProductPurchasePanel from './_components/ProductPurchasePanel'
import ProductDetailsTabs from './_components/ProductDetailsTabs'
import OrganizingTips from './_components/OrganizingTips'

export default function ProductDetailPage() {
  const params = useParams()
  const slug =
    typeof params.slug === 'string'
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : ''

  const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
  const [activeImage, setActiveImage] = useState(0)

  if (!product) {
    notFound()
    return null
  }

  const isOnSale = product.salePrice !== undefined && product.salePrice < product.price
  const saleBadge = isOnSale ? `−${discountPercent(product.price, product.salePrice!)}%` : undefined

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id && p.inStock,
  ).slice(0, 4)

  return (
    <main className="bg-surface">
      <div className="section-container py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-dark/40 text-sm mb-8">
          <Link href="/" className="hover:text-dark transition-colors">
            Home
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link href="/shop" className="hover:text-dark transition-colors">
            Shop
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <Link
            href={`/shop?category=${product.category}`}
            className="hover:text-dark transition-colors"
          >
            {categoryLabel(product.category)}
          </Link>
          <ChevronRight size={14} aria-hidden="true" />
          <span className="text-dark/70 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <ProductGallery
            name={product.name}
            images={product.images}
            activeIndex={activeImage}
            onSelect={setActiveImage}
            saleBadge={saleBadge}
          />
          <ProductPurchasePanel product={product} />
        </div>

        <ProductDetailsTabs product={product} />
        <OrganizingTips category={product.category} />

        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-dark/10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-2xl text-dark mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
