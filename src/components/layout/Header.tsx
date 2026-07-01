'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Menu, X, ShoppingCart, Search, Phone, Mail,
  Heart, ArrowRight, ArrowUpRight, Truck, ChevronDown, ChevronUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS, SERVICES, SHOP_CATEGORIES, COMPANY } from '@/lib/constants'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { useCart } from '@/context/CartContext'
import BrandLogo from '@/components/brand/BrandLogo'
import ShopMemberCta from '@/components/shop/ShopMemberCta'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatPrice } from '@/lib/utils'
import { IMG } from '@/lib/image-placeholders'

// ─── Nav order (spec: Home | Services | Shop | Blog | About | Contact) ────────

const NAV_ORDER = ['Home', 'Services', 'Shop', 'Blog', 'About', 'Contact']
const ORDERED_NAV = NAV_ORDER
  .map(label => NAV_LINKS.find(n => n.label === label))
  .filter(Boolean) as typeof NAV_LINKS

// ─── Room cards for the Services mega menu ────────────────────────────────────

const ROOMS = [
  { label: 'Home Organization',    slug: 'professional-organizing',       image: IMG.rooms.kitchen },
  { label: 'Storage & Closets',    slug: 'storage-design-installation',   image: IMG.rooms.bedroom },
  { label: 'Cleaning Services',    slug: 'cleaning-housekeeping',         image: IMG.rooms.bathroom },
  { label: 'Relocation',           slug: 'relocation-transition',         image: IMG.rooms.moving },
  { label: 'Home Management',      slug: 'home-management',               image: IMG.rooms.livingRoom },
  { label: 'Staffing & Training',  slug: 'staffing-workforce',            image: IMG.rooms.office },
]

// ─── Search overlay ───────────────────────────────────────────────────────────

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState<{ services: typeof SERVICES; products: typeof MOCK_PRODUCTS } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!val.trim()) { setResults(null); return }
    timerRef.current = setTimeout(() => {
      const q = val.toLowerCase()
      setResults({
        services: SERVICES.filter(s => s.title.toLowerCase().includes(q)),
        products: MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0, 6),
      })
    }, 300)
  }

  const hasResults = results && (results.services.length > 0 || results.products.length > 0)
  const noResults  = results && results.services.length === 0 && results.products.length === 0

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-dark/40 z-[70] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[80] glass-panel-light shadow-2xl border-b border-white/50"
        role="dialog"
        aria-label="Search"
      >
        {/* Large input row */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 flex items-center gap-4 h-20 border-b border-dark/8">
          <Search size={22} className="text-dark/30 flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleChange}
            placeholder="Search services and products…"
            className="flex-1 text-dark text-xl sm:text-2xl outline-none placeholder:text-dark/25 bg-transparent font-display"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex items-center justify-center w-9 h-9 rounded-xl text-dark/40 hover:bg-muted hover:text-dark transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-5 max-h-[65vh] overflow-y-auto">
          {!query && (
            <p className="text-dark/30 text-sm py-8 text-center">
              Start typing to search services and products…
            </p>
          )}
          {noResults && (
            <p className="text-dark/40 text-sm py-8 text-center">
              No results for &ldquo;<strong className="text-dark">{query}</strong>&rdquo;
            </p>
          )}

          {hasResults && (
            <div className="flex flex-col gap-6">
              {results!.services.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-dark/35 uppercase tracking-widest mb-3">Services</p>
                  <div className="flex flex-col gap-1">
                    {results!.services.map((s, i) => (
                      <motion.div
                        key={s.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Link href={`/services/${s.slug}`} onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Search size={13} className="text-dark/40" />
                          </div>
                          <span className="text-dark text-sm group-hover:text-primary transition-colors">{s.title}</span>
                          <span className="ml-auto text-dark/30 text-xs font-mono">From {formatPrice(s.priceFrom)}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {results!.products.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-dark/35 uppercase tracking-widest mb-3">Products</p>
                  <div className="flex flex-col gap-1">
                    {results!.products.map((p, i) => (
                      <motion.div
                        key={p.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.04 }}
                      >
                        <Link href={`/shop/${p.slug}`} onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors group">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <span className="text-dark text-sm flex-1 group-hover:text-primary transition-colors line-clamp-1">{p.name}</span>
                          <span className="ml-auto text-dark/50 text-xs font-mono flex-shrink-0">{formatPrice(p.salePrice ?? p.price)}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-dark/20 text-xs text-center py-4 mt-2 border-t border-dark/5">
            Press{' '}
            <kbd className="bg-muted px-1.5 py-0.5 rounded text-dark/35 font-mono text-[11px]">Esc</kbd>
            {' '}to close
          </p>
        </div>
      </motion.div>
    </>
  )
}

// ─── Services mega menu ───────────────────────────────────────────────────────

function ServicesMegaMenu({
  onClose,
  onMouseEnter,
  onMouseLeave,
}: { onClose: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 glass-panel-dropdown shadow-sfs-lg rounded-b-3xl mt-2 mx-2"
    >
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-10">

          {/* Left 70% — Rooms grid */}
          <div className="flex-[7] min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-4">
              Organize by Room
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ROOMS.map(room => (
                <Link key={room.label} href={`/services/${room.slug}`} onClick={onClose}
                  className="group relative img-frame-lg h-28 block ring-1 ring-white/50 hover:ring-primary/35 transition-all duration-200 shadow-sm">
                  <Image
                    src={room.image} alt={room.label} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1280px) 200px, 250px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/15 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 px-3 pb-2 text-white text-sm font-semibold">
                    {room.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right 30% — Service list */}
          <div className="flex-[3] min-w-0 flex flex-col glass-subtle rounded-2xl p-4">
            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-4">
              Our Services
            </p>
            <div className="flex flex-col flex-1">
              {SERVICES.map(service => (
                <Link key={service.slug} href={`/services/${service.slug}`} onClick={onClose}
                  className="group flex items-center justify-between py-2 px-2 -mx-2 rounded-xl hover:bg-white/35 transition-colors duration-150">
                  <span className="flex items-center gap-2 text-sm text-dark/70 group-hover:text-primary transition-colors">
                    <ArrowRight size={11} className="text-dark/25 group-hover:text-primary transition-colors flex-shrink-0" />
                    {service.title}
                  </span>
                  <span className="text-dark/35 text-xs font-mono ml-2 flex-shrink-0">
                    {formatPrice(service.priceFrom)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA band */}
        <div className="mt-6 glass-subtle rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-sm text-dark/70">
            Not sure where to start?{' '}
            <span className="font-semibold text-dark">Get a free consultation.</span>
          </p>
          <Link href="/book" onClick={onClose}
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
            Book Free Consultation
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Shop mega menu ───────────────────────────────────────────────────────────

const SHOP_POPULAR_SLUGS = ['kitchen', 'pantry', 'closet-bedroom', 'bathroom', 'baskets', 'storage-containers'] as const

function ShopMegaMenu({
  onClose,
  onMouseEnter,
  onMouseLeave,
}: { onClose: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  const featured = MOCK_PRODUCTS.filter((p) => p.featured).slice(0, 3)
  const popular = SHOP_POPULAR_SLUGS.map((slug) => SHOP_CATEGORIES.find((c) => c.slug === slug)).filter(Boolean)
  const rest = SHOP_CATEGORIES.filter((c) => !SHOP_POPULAR_SLUGS.includes(c.slug as typeof SHOP_POPULAR_SLUGS[number]))

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute top-full left-0 right-0 z-50 glass-panel-dropdown shadow-sfs-lg rounded-b-3xl mt-2 mx-2"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex gap-8 lg:gap-12">

          {/* Categories — text-first, no image grid */}
          <div className="flex-[7] min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-3">
              Popular Categories
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {popular.map((cat) => cat && (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium glass-subtle text-dark/75 hover:bg-primary hover:border-primary hover:text-white border border-white/50 transition-colors duration-150"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-3">
              All Categories
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-0.5">
              {rest.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-2 py-2 text-sm text-dark/65 hover:text-primary transition-colors duration-150"
                >
                  <span className="w-1 h-1 rounded-full bg-dark/20 group-hover:bg-primary flex-shrink-0 transition-colors" />
                  <span className="line-clamp-1">{cat.label}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/shop"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 mt-5 transition-colors"
            >
              Browse all products <ArrowRight size={13} />
            </Link>
          </div>

          {/* Featured — compact list with small thumbs only */}
          <div className="flex-[3] min-w-[200px] max-w-xs flex flex-col border-l border-white/40 pl-8">
            <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-3">
              Featured
            </p>
            <div className="flex flex-col gap-1">
              {featured.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl hover:bg-white/35 transition-colors duration-150"
                >
                  <div className="relative w-11 h-11 img-frame overflow-hidden bg-muted flex-shrink-0 ring-1 ring-white/50">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="44px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-dark group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {product.name}
                    </p>
                    <p className="text-xs font-mono text-dark/45 mt-0.5">
                      {formatPrice(product.salePrice ?? product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-white/35 flex items-center gap-2.5 text-sm text-dark/60">
          <Truck size={15} className="text-success flex-shrink-0" />
          <span>
            <span className="font-semibold text-dark">Free delivery</span> in Nairobi CBD on orders over{' '}
            <span className="font-mono font-semibold text-dark">KSh 2,000</span>
          </span>
        </div>
        <ShopMemberCta variant="mega" />
      </div>
    </motion.div>
  )
}

// ─── Mobile menu (full-screen overlay) ────────────────────────────────────────

const MOBILE_NAV_ITEMS = [
  { label: 'Home',     href: '/',        hasSubmenu: false },
  { label: 'Services', href: '/services', hasSubmenu: true  },
  { label: 'Shop',     href: '/shop',    hasSubmenu: true  },
  { label: 'Blog',     href: '/blog',    hasSubmenu: false  },
  { label: 'About',    href: '/about',   hasSubmenu: false  },
  { label: 'Contact',  href: '/contact', hasSubmenu: false  },
]

const MOBILE_STAGGER = {
  animate: { transition: { staggerChildren: 0.06 } },
}

const MOBILE_ITEM = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit:    { opacity: 0, y: 8,  transition: { duration: 0.15 } },
}

function MobileMenu({
  onClose,
  pathname,
  openSearch,
}: { onClose: () => void; pathname: string; openSearch: () => void }) {
  const [servicesOpen, setServicesOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)

  return (
    <motion.div
      key="mobile-overlay"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-0 z-[60] glass-grid-bg backdrop-blur-xl flex flex-col overflow-y-auto"
      role="dialog"
      aria-label="Mobile navigation"
      aria-modal="true"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/40 flex-shrink-0 glass-panel-light mx-4 mt-4 rounded-2xl">
        <Link href="/" onClick={onClose} className="font-display text-xl font-bold text-primary">
          {COMPANY.name}
        </Link>
        <button type="button" onClick={onClose} aria-label="Close menu"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-dark/50 hover:bg-muted hover:text-dark transition-colors">
          <X size={22} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-6 pt-5 pb-2">
        <button type="button" onClick={() => { onClose(); openSearch() }}
          className="w-full flex items-center gap-3 glass-panel-light rounded-2xl px-4 py-3 text-dark/40 text-sm hover:bg-white/70 transition-colors">
          <Search size={16} />
          Search services and products…
        </button>
      </div>

      {/* Nav links */}
      <motion.nav
        className="flex flex-col px-4 py-4 flex-1"
        variants={MOBILE_STAGGER}
        initial="initial"
        animate="animate"
      >
        {MOBILE_NAV_ITEMS.map(item => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

          if (item.hasSubmenu && item.label === 'Services') {
            return (
              <motion.div key={item.label} variants={MOBILE_ITEM}>
                <div className="flex items-center justify-between px-3 py-4">
                  <Link href="/services" onClick={onClose}
                    className={cn(
                      'font-display text-2xl font-bold transition-colors',
                      isActive ? 'text-primary' : 'text-dark hover:text-primary',
                    )}
                  >
                    Services
                  </Link>
                  <button type="button"
                    onClick={() => setServicesOpen(o => !o)}
                    aria-label={servicesOpen ? 'Collapse services menu' : 'Expand services menu'}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-dark/40 hover:bg-muted"
                  >
                    <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                </div>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 flex flex-col gap-0">
                        {/* Rooms quick access */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {ROOMS.map(room => (
                            <Link key={room.label} href={`/services/${room.slug}`} onClick={onClose}
                              className="group relative rounded-xl overflow-hidden h-20 ring-1 ring-dark/8">
                              <Image src={room.image} alt={room.label} fill className="object-cover" sizes="160px" />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark/75 via-dark/10 to-transparent" />
                              <span className="absolute bottom-0 left-0 right-0 px-2.5 pb-2 text-white text-xs font-semibold">{room.label}</span>
                            </Link>
                          ))}
                        </div>
                        {/* All services list */}
                        {SERVICES.map(service => (
                          <Link key={service.slug} href={`/services/${service.slug}`} onClick={onClose}
                            className="flex items-center justify-between py-2.5 border-b border-dark/5 last:border-0 text-sm text-dark/70 hover:text-primary transition-colors">
                            <span>{service.title}</span>
                            <span className="text-xs font-mono text-dark/35">{formatPrice(service.priceFrom)}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          }

          if (item.hasSubmenu && item.label === 'Shop') {
            return (
              <motion.div key={item.label} variants={MOBILE_ITEM}>
                <div className="flex items-center justify-between px-3 py-4">
                  <Link href="/shop" onClick={onClose}
                    className={cn(
                      'font-display text-2xl font-bold transition-colors',
                      isActive ? 'text-primary' : 'text-dark hover:text-primary',
                    )}
                  >
                    Shop
                  </Link>
                  <button type="button"
                    onClick={() => setShopOpen((o) => !o)}
                    aria-label={shopOpen ? 'Collapse shop menu' : 'Expand shop menu'}
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-dark/40 hover:bg-muted"
                  >
                    <motion.span animate={{ rotate: shopOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                </div>

                <AnimatePresence>
                  {shopOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-4 flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                          {SHOP_POPULAR_SLUGS.map((slug) => {
                            const cat = SHOP_CATEGORIES.find((c) => c.slug === slug)
                            if (!cat) return null
                            return (
                              <Link
                                key={cat.slug}
                                href={`/shop?category=${cat.slug}`}
                                onClick={onClose}
                                className="inline-flex px-3 py-1.5 rounded-full text-xs font-medium border border-dark/12 bg-surface text-dark/75 hover:bg-primary hover:border-primary hover:text-white transition-colors"
                              >
                                {cat.label}
                              </Link>
                            )
                          })}
                        </div>
                        <Link href="/shop" onClick={onClose} className="text-sm font-medium text-primary">
                          View all products →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          }

          return (
            <motion.div key={item.label} variants={MOBILE_ITEM}>
              <Link href={item.href} onClick={onClose}
                className={cn(
                  'flex items-center px-3 py-4 rounded-xl font-display text-2xl font-bold transition-colors',
                  isActive ? 'text-primary' : 'text-dark hover:text-primary',
                )}
              >
                {item.label}
              </Link>
            </motion.div>
          )
        })}
      </motion.nav>

      {/* Bottom strip */}
      <div className="flex-shrink-0 bg-primary/5 border-t border-dark/6 px-6 py-5 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <a href={`tel:${COMPANY.phone}`}
            className="flex items-center gap-2 text-sm text-dark/60 hover:text-dark transition-colors">
            <Phone size={14} />
            {COMPANY.phone}
          </a>
          <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#25D366] font-medium">
            <span className="text-[13px]">WhatsApp</span>
          </a>
        </div>
        <Link href="/book" onClick={onClose}
          className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-semibold text-base min-h-[52px] rounded-xl transition-colors">
          Book Now
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { totalItems: wishlistCount } = useWishlist()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen,     setIsSearchOpen]     = useState(false)
  const [activeMenu,       setActiveMenu]       = useState<null | 'services' | 'shop'>(null)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openSearch  = useCallback(() => setIsSearchOpen(true),  [])
  const closeSearch = useCallback(() => setIsSearchOpen(false), [])

  // Hover helpers with debounce to prevent flickering
  function openMenu(menu: 'services' | 'shop') {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveMenu(menu)
  }
  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 150)
  }
  function cancelClose() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  // Close everything on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    setActiveMenu(null)
  }, [pathname])

  // Body scroll lock when mobile menu or search is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Cleanup timer on unmount
  useEffect(() => () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current) }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-3 sm:px-4 lg:px-8 pt-3 pb-2">
        {/* Floating glass nav bar */}
        <div
          className="glass-nav rounded-full relative max-w-7xl mx-auto"
          onMouseLeave={scheduleClose}
        >
          <div className="h-14 sm:h-16 flex items-center justify-between gap-3 px-3 sm:px-5">

            <BrandLogo variant="on-light" priority className="max-w-[220px] sm:max-w-[250px]" />

            {/* Desktop nav — pill container */}
            <nav aria-label="Primary navigation" className="hidden lg:flex items-center glass-nav-pill rounded-full p-1">
              {ORDERED_NAV.map(navLink => {
                const isActive = navLink.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(navLink.href)
                const hasMegaMenu = navLink.label === 'Services' || navLink.label === 'Shop'
                const menuOpen = activeMenu === navLink.label.toLowerCase()

                const linkClass = cn(
                  'flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-full transition-all duration-150',
                  isActive || menuOpen
                    ? 'glass-nav-link-active text-primary font-semibold'
                    : 'text-dark/60 hover:text-dark hover:bg-white/40',
                )

                if (hasMegaMenu) {
                  const menuKey = navLink.label.toLowerCase() as 'services' | 'shop'
                  return (
                    <Link
                      key={navLink.href}
                      href={navLink.href}
                      onMouseEnter={() => openMenu(menuKey)}
                      onMouseLeave={scheduleClose}
                      className={linkClass}
                    >
                      {navLink.label}
                      <ChevronDown
                        size={13}
                        className={cn('transition-transform duration-200 text-dark/35', menuOpen && 'rotate-180')}
                      />
                    </Link>
                  )
                }

                return (
                  <Link key={navLink.href} href={navLink.href} className={linkClass}>
                    {navLink.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">

              {/* Search */}
              <button type="button" onClick={openSearch} aria-label="Search"
                className="hidden md:flex glass-icon-btn">
                <Search size={19} />
              </button>

              <Link href="/account/wishlist" aria-label="Wishlist"
                className="hidden md:flex glass-icon-btn relative">
                <Heart size={19} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart"
                aria-label={`Cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ''}`}
                className="flex glass-icon-btn relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold leading-none">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Book Now — desktop */}
              <Link href="/book"
                className="hidden md:inline-flex items-center gap-1.5 sfs-btn-primary text-sm py-2.5 ml-2 min-h-[40px]">
                Book Now
                <ArrowUpRight size={13} />
              </Link>

              {/* Hamburger — mobile */}
              <button type="button"
                onClick={() => setIsMobileMenuOpen(o => !o)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden flex glass-icon-btn">
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* ── Mega menus ────────────────────────────────────────────────── */}
          <AnimatePresence>
            {activeMenu === 'services' && (
              <ServicesMegaMenu
                key="services-menu"
                onClose={() => setActiveMenu(null)}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              />
            )}
            {activeMenu === 'shop' && (
              <ShopMegaMenu
                key="shop-menu"
                onClose={() => setActiveMenu(null)}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
              />
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            onClose={() => setIsMobileMenuOpen(false)}
            pathname={pathname}
            openSearch={openSearch}
          />
        )}
      </AnimatePresence>

      {/* ── Search overlay ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && <SearchOverlay onClose={closeSearch} />}
      </AnimatePresence>
    </>
  )
}
