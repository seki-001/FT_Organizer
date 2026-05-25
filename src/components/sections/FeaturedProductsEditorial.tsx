'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Truck, CheckCircle2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { staggerContainer, staggerItem, EASE_STANDARD } from '@/lib/animations'

// ─── Pick 5 products ──────────────────────────────────────────────────────────

const [productA, productB1, productB2, productC, productD] = MOCK_PRODUCTS.slice(0, 5)

// ─── Large featured card ──────────────────────────────────────────────────────

function LargeProductCard({ product }: { product: typeof MOCK_PRODUCTS[number] }) {
  const [hovered, setHovered] = useState(false)
  const [added,   setAdded]   = useState(false)
  const { addItem, openCart } = useCart()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const price    = product.salePrice ?? product.price
  const hasDiscount = !!product.salePrice

  return (
    <Link href={`/shop/${product.slug}`}>
      <div
        className="rounded-2xl overflow-hidden border border-dark/8 bg-white h-full
                   hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative h-52 sm:h-60 bg-muted overflow-hidden">
          {hasDiscount && (
            <span className="absolute top-3 left-3 z-10 bg-primary text-white text-xs font-semibold
                             rounded-full px-2.5 py-1">
              Sale
            </span>
          )}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Image src={product.images[0]} alt={product.name} fill className="object-cover"
                   sizes="(max-width: 1024px) 100vw, 58vw" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="bg-white p-5 relative overflow-hidden">
          <p className="text-dark/40 text-xs uppercase tracking-widest font-medium mb-1">
            {product.category.replace(/-/g, ' ')}
          </p>
          <h3 className="font-display text-xl text-dark leading-snug">{product.name}</h3>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-primary font-semibold">{formatPrice(price)}</span>
              {hasDiscount && (
                <span className="font-mono text-dark/35 text-xs line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to cart — slides up on hover */}
            <div className="relative h-9 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {hovered ? (
                  <motion.button
                    key="add"
                    initial={{ y: 36 }}
                    animate={{ y: 0 }}
                    exit={{ y: 36 }}
                    transition={{ duration: 0.22, ease: EASE_STANDARD }}
                    onClick={handleAdd}
                    className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-colors
                                ${added
                                  ? 'bg-green-500 text-white'
                                  : 'bg-dark text-white hover:bg-dark/85'}`}
                  >
                    {added ? <CheckCircle2 size={14} /> : <ShoppingCart size={14} />}
                    {added ? 'Added!' : 'Add to Cart'}
                  </motion.button>
                ) : (
                  <motion.div
                    key="price-idle"
                    initial={{ y: -36 }}
                    animate={{ y: 0 }}
                    exit={{ y: -36 }}
                    transition={{ duration: 0.22, ease: EASE_STANDARD }}
                    className="h-9 flex items-center"
                  >
                    <span className="text-dark/30 text-xs">{product.reviewCount} reviews</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Small horizontal card ────────────────────────────────────────────────────

function SmallProductCard({ product }: { product: typeof MOCK_PRODUCTS[number] }) {
  const { addItem, openCart } = useCart()

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    openCart()
  }

  return (
    <Link href={`/shop/${product.slug}`}>
      <div className="flex rounded-2xl overflow-hidden border border-dark/8 bg-white h-[9.5rem]
                      hover:shadow-md transition-shadow duration-200 group">
        {/* Image */}
        <div className="relative w-32 shrink-0 bg-muted overflow-hidden">
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="128px" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between p-4 min-w-0 flex-1">
          <div>
            <p className="text-xs text-dark/35 uppercase tracking-wider font-medium truncate">
              {product.category.replace(/-/g, ' ')}
            </p>
            <h3 className="font-display text-sm text-dark leading-snug mt-0.5 line-clamp-2">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-primary text-sm font-semibold">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-dark/5 hover:bg-primary hover:text-white
                         flex items-center justify-center transition-colors"
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeaturedProductsEditorial() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation({ amount: 0.3 })
  const { ref: row1Ref,   isInView: row1InView   } = useScrollAnimation({ amount: 0.1 })
  const { ref: row2Ref,   isInView: row2InView   } = useScrollAnimation({ amount: 0.1 })

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <h2 className="font-display text-4xl md:text-5xl text-dark leading-tight">
            Shop Our Products
          </h2>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-medium
                       animated-link hover:opacity-80 transition-opacity group"
          >
            View all products
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* ── Row 1: Large + Two stacked ─────────────────────────────────── */}
        <motion.div
          ref={row1Ref}
          variants={staggerContainer}
          initial="initial"
          animate={row1InView ? 'animate' : 'initial'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4"
        >
          {/* Product A — large */}
          <motion.div variants={staggerItem} className="lg:col-span-7">
            <LargeProductCard product={productA} />
          </motion.div>

          {/* Products B1 + B2 — stacked */}
          <motion.div variants={staggerItem} className="lg:col-span-5 flex flex-col gap-4">
            <SmallProductCard product={productB1} />
            <SmallProductCard product={productB2} />
          </motion.div>
        </motion.div>

        {/* ── Row 2: Promo + Product C + Product D ──────────────────────── */}
        <motion.div
          ref={row2Ref}
          variants={staggerContainer}
          initial="initial"
          animate={row2InView ? 'animate' : 'initial'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4"
        >
          {/* Red promo card */}
          <motion.div
            variants={staggerItem}
            className="lg:col-span-4"
          >
            <div className="bg-primary rounded-2xl p-7 sm:p-8 h-52 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-widest uppercase text-white/55 font-medium">
                  Free Delivery
                </p>
                <h3 className="font-display text-2xl sm:text-3xl text-white leading-snug mt-2">
                  In Nairobi CBD
                </h3>
              </div>
              <Truck size={44} className="text-white/30 self-end" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Product C */}
          <motion.div variants={staggerItem} className="lg:col-span-4">
            <LargeProductCard product={productC} />
          </motion.div>

          {/* Product D */}
          <motion.div variants={staggerItem} className="lg:col-span-4">
            <LargeProductCard product={productD} />
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
