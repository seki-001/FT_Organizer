'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Star, TrendingUp, Grid3X3 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { SHOP_CATEGORIES } from '@/lib/constants'
import { useEffect, useState } from 'react'

// 6 curated featured picks (first 6 with featured flag)
const FEATURED = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 6)

// Best sellers: pick one top product from each popular category
const POPULAR_CATS = ['kitchen', 'bathroom', 'storage-containers', 'closet-bedroom', 'fridge', 'baskets', 'pantry', 'laundry-cleaning']
const BEST_SELLERS = POPULAR_CATS.map(cat =>
  MOCK_PRODUCTS.find(p => p.category === cat)
).filter(Boolean).slice(0, 6) as typeof MOCK_PRODUCTS

// Top 8 categories for quick browse
const BROWSE_CATEGORIES = SHOP_CATEGORIES.slice(0, 8)

function ProductCard({ product, dark = true }: { product: (typeof MOCK_PRODUCTS)[0]; dark?: boolean }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`group rounded-2xl overflow-hidden transition-all ${
        dark
          ? 'bg-white/4 border border-white/8 hover:border-white/18'
          : 'bg-white border border-dark/8 hover:border-primary/20 hover:shadow-sm'
      }`}
    >
      <div className="relative h-44 overflow-hidden img-zoom">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {product.salePrice && (
          <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            SALE
          </span>
        )}
      </div>
      <div className="p-4">
        <p className={`text-[10px] uppercase tracking-widest mb-1 ${dark ? 'text-white/35' : 'text-dark/40'}`}>
          {product.category.replace(/-/g, ' ')}
        </p>
        <p className={`font-semibold text-sm mb-2 line-clamp-1 ${dark ? 'text-white group-hover:text-accent/90' : 'text-dark group-hover:text-primary'} transition-colors`}>
          {product.name}
        </p>
        <p className={`font-mono text-sm ${dark ? 'text-white' : 'text-dark'}`}>
          {formatPrice(product.salePrice ?? product.price)}
        </p>
      </div>
    </Link>
  )
}

export default function FeaturedProductsEditorial() {
  const [suggestedCat, setSuggestedCat] = useState<string | null>(null)
  const [suggestedProducts, setSuggestedProducts] = useState<typeof MOCK_PRODUCTS>([])

  // Personalisation: surface products from last-browsed category (stored in localStorage)
  useEffect(() => {
    try {
      const lastCat = localStorage.getItem('fto_last_category')
      if (lastCat) {
        const catProducts = MOCK_PRODUCTS.filter(p => p.category === lastCat).slice(0, 3)
        if (catProducts.length > 0) {
          setSuggestedCat(lastCat)
          setSuggestedProducts(catProducts)
        }
      }
    } catch {}
  }, [])

  return (
    <div className="bg-dark">
      {/* ── FEATURED PICKS ────────────────────────────────── */}
      <section className="py-16 md:py-20 border-t border-white/6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label text-white/40 mb-2 flex items-center gap-1.5">
                <Star size={11} className="text-accent/70" />
                Featured Picks
              </p>
              <h2 className="text-white text-3xl md:text-4xl">
                <span className="head-sans block">Curated For</span>
                <span className="head-serif italic text-accent/90">Your Space</span>
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURED.map(p => <ProductCard key={p.slug} product={p} dark />)}
          </div>
        </div>
      </section>

      {/* ── PERSONALISED SUGGESTION (if user has browsed) ─ */}
      {suggestedCat && suggestedProducts.length > 0 && (
        <section className="pb-16 border-t border-white/6">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label text-white/40 mb-2">Continue Browsing</p>
                <h2 className="text-white text-2xl md:text-3xl head-sans capitalize">
                  More in {suggestedCat.replace(/-/g, ' ')}
                </h2>
              </div>
              <Link href={`/shop?category=${suggestedCat}`} className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-1">
                See All <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestedProducts.map(p => <ProductCard key={p.slug} product={p} dark />)}
            </div>
          </div>
        </section>
      )}

      {/* ── BEST SELLERS ──────────────────────────────────── */}
      <section className="bg-white border-t border-dark/8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label text-dark/40 mb-2 flex items-center gap-1.5">
                <TrendingUp size={11} className="text-primary/70" />
                Most Popular
              </p>
              <h2 className="text-dark text-3xl md:text-4xl">
                <span className="head-sans block">Best</span>
                <span className="head-serif italic text-primary">Sellers</span>
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-1.5 text-dark/50 hover:text-dark text-sm transition-colors">
              Shop All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {BEST_SELLERS.map(p => <ProductCard key={p.slug} product={p} dark={false} />)}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BROWSE ───────────────────────────────── */}
      <section className="bg-surface border-t border-dark/8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="section-label text-dark/40 mb-2 flex items-center gap-1.5">
                <Grid3X3 size={11} className="text-primary/70" />
                Browse By Room
              </p>
              <h2 className="text-dark text-3xl md:text-4xl">
                <span className="head-sans block">Shop by</span>
                <span className="head-serif italic text-primary">Category</span>
              </h2>
            </div>
            <Link href="/shop" className="hidden md:inline-flex items-center gap-1.5 text-dark/50 hover:text-dark text-sm transition-colors">
              All Categories <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BROWSE_CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden h-36 block"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-semibold text-sm">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors">
              Browse All {MOCK_PRODUCTS.length} Products <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
