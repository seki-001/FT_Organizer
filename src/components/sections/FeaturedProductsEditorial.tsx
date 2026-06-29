'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SHOP_CATEGORIES } from '@/lib/constants'
import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import {
  SectionHeader,
  ShopProductCard,
  ImageCarousel,
} from '@/components/ui/commerce'

const POPULAR_CATS = ['kitchen', 'bathroom', 'storage-containers', 'closet-bedroom', 'fridge', 'baskets', 'pantry', 'laundry-cleaning']
const BROWSE_CATEGORIES = SHOP_CATEGORIES.slice(0, 8)

export default function FeaturedProductsEditorial() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [suggestedCat, setSuggestedCat] = useState<string | null>(null)
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (data.products?.length) setProducts(data.products)
      })
      .catch(() => {})
  }, [])

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const bestSellers = POPULAR_CATS.map((cat) =>
    products.find((p) => p.category === cat)
  ).filter(Boolean).slice(0, 6) as Product[]

  useEffect(() => {
    try {
      const lastCat = localStorage.getItem('fto_last_category')
      if (lastCat) {
        const catProducts = products.filter((p) => p.category === lastCat).slice(0, 3)
        if (catProducts.length > 0) {
          setSuggestedCat(lastCat)
          setSuggestedProducts(catProducts)
        }
      }
    } catch {}
  }, [products])

  return (
    <div>
      <section className="glass-grid-bg py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <SectionHeader
            label="Featured picks"
            title="Curated for"
            titleAccent="your space"
            action={{ label: 'View all', href: '/shop' }}
          />
          <ImageCarousel ariaLabel="Featured products">
            {featured.map((p) => (
              <ShopProductCard key={p.slug} product={p} variant="carousel" />
            ))}
          </ImageCarousel>
        </div>
      </section>

      {suggestedCat && suggestedProducts.length > 0 && (
        <section className="bg-surface py-14 md:py-16">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <SectionHeader
              label="Continue browsing"
              title={`More in ${suggestedCat.replace(/-/g, ' ')}`}
              action={{ label: 'See all', href: `/shop?category=${suggestedCat}` }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {suggestedProducts.map((p) => <ShopProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="glass-grid-bg py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <SectionHeader
            label="Most popular"
            title="Best"
            titleAccent="sellers"
            action={{ label: 'Shop all', href: '/shop' }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {bestSellers.map((p) => <ShopProductCard key={p.slug} product={p} showAddToCart={false} />)}
          </div>
        </div>
      </section>

      <section className="bg-surface py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <SectionHeader
            label="Browse by room"
            title="Shop by"
            titleAccent="category"
            align="center"
            description="Everything you need to organize every corner of your home."
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BROWSE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="sfs-card group p-4 flex flex-col gap-3 text-center"
              >
                <div className="relative aspect-square img-frame-lg bg-muted img-zoom mx-auto w-full max-w-[140px]">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
                <p className="text-sm font-medium text-dark group-hover:text-primary transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/shop" className="sfs-btn-outline inline-flex">
              Browse all products <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
