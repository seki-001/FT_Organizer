# AiroGuide Redesign Prompt — Faith The Organizer
> Paste this entire file into Cursor Composer. Tag `@context.md` alongside it.
> Goal: Apply the AiroGuide cinematic editorial design language to FTO while keeping existing brand colors, fixing all known bugs, and preserving all functionality.

---

## 0. Bug Fixes (Do These First)

Before any design work, apply these critical fixes:

### 0.1 Fix `COMPANY.whatsappLink` reference
In `src/components/layout/Header.tsx` line ~507, `COMPANY.whatsappLink` does not exist.
Replace with:
```tsx
href={`https://wa.me/${COMPANY.whatsapp}`}
```

### 0.2 Fix Admin Auth — add NODE_ENV guard
In `src/lib/auth.ts`, the mock always returns admin. Wrap it:
```ts
export async function getAdminSession(): Promise<AdminSession | null> {
  if (process.env.NODE_ENV === 'production') {
    // Real NextAuth call goes here — see TODO comments in the file
    return null
  }
  return {
    user: { name: 'Faith Admin', email: 'admin@organizer.co.ke', role: 'admin' },
  }
}
```

### 0.3 Strip server-set fields from BookingFormSchema
In `src/lib/validations.ts`, remove `status` and `createdAt` from `BookingFormSchema` — they must never come from the client:
```ts
export const BookingFormSchema = z.object({
  service:      z.string().min(1, 'Service is required'),
  date:         z.string().min(1, 'Date is required'),
  name:         z.string().min(1, 'Name is required'),
  email:        z.string().email('Invalid email'),
  phone:        z.string().min(1, 'Phone is required'),
  propertyType: z.enum(['apartment', 'house', 'office']),
  propertySize: z.enum(['small', 'medium', 'large']),
  notes:        z.string().optional(),
})
```
Then in `src/app/api/bookings/route.ts`, set `status: 'new'` and `createdAt: new Date().toISOString()` server-side after parsing.

### 0.4 Add M-Pesa callback route
Create `src/app/api/payments/mpesa/callback/route.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[M-Pesa callback]', JSON.stringify(body, null, 2))
    // TODO: Parse body.Body.stkCallback, check ResultCode === 0,
    // update order status in DB, send confirmation email via Resend.
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' })
  }
}
```

### 0.5 Wire Wishlist button in Header
In `src/components/layout/Header.tsx`, import `useWishlist` from `@/context/WishlistContext` and replace the dead Heart button:
```tsx
import { useWishlist } from '@/context/WishlistContext'
// inside Header():
const { totalItems: wishlistCount } = useWishlist()
// button:
<Link href="/account/wishlist" aria-label="Wishlist" className="...relative">
  <Heart size={19} />
  {wishlistCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold">
      {wishlistCount}
    </span>
  )}
</Link>
```

---

## 1. Design System — What Changes

**Keep all existing Tailwind color tokens** (`primary`, `accent`, `dark`, `surface`, `muted`, `success`, `danger`). **Do not change hex values.**

**Keep all existing fonts** (Playfair Display → `font-display`, Inter → `font-sans`, DM Mono → `font-mono`).

### 1.1 New CSS custom utilities to add in `src/app/globals.css`

```css
/* ── AiroGuide editorial image masks ── */
.mask-pill      { clip-path: ellipse(50% 38% at 50% 50%); }
.mask-circle    { border-radius: 50%; overflow: hidden; }
.mask-stadium   { border-radius: 9999px; overflow: hidden; }
.mask-fig8 {
  /* Two overlapping rounded rectangles — achieved with border-radius trick */
  border-radius: 60% 60% 40% 40% / 50% 50% 50% 50%;
  overflow: hidden;
}

/* ── Rotated caption on image cards ── */
.caption-rotate {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

/* ── Cinematic dark overlay on hero images ── */
.overlay-cinematic {
  background: linear-gradient(
    to right,
    rgba(26,26,26,0.75) 0%,
    rgba(26,26,26,0.30) 50%,
    rgba(26,26,26,0.10) 100%
  );
}

/* ── Gentle image zoom on hover ── */
.img-zoom img,
.img-zoom > div > img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
.img-zoom:hover img,
.img-zoom:hover > div > img { transform: scale(1.04); }

/* ── Section label style (small uppercase tracker) ── */
.section-label {
  font-family: var(--font-inter);
  font-size: 0.6875rem;     /* 11px */
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.5;
}

/* ── Mixed heading: bold sans + italic serif on same line ── */
/* Usage: <h2><span class="head-sans">Bold Part</span> <span class="head-serif">Italic Part</span></h2> */
.head-sans  { font-family: var(--font-inter); font-weight: 800; font-style: normal; }
.head-serif { font-family: var(--font-playfair); font-weight: 700; font-style: italic; }

/* ── Pill/tag selector buttons ── */
.pill-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid rgba(26,26,26,0.12);
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.pill-tag.active,
.pill-tag:hover {
  background: #1A1A1A;
  border-color: #1A1A1A;
  color: #ffffff;
}
/* Dark-mode pills (on dark backgrounds) */
.pill-tag-dark {
  border-color: rgba(255,255,255,0.20);
  color: rgba(255,255,255,0.70);
}
.pill-tag-dark.active,
.pill-tag-dark:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.40);
  color: #ffffff;
}

/* ── Avatar cluster (stacked circular avatars) ── */
.avatar-cluster { display: flex; align-items: center; }
.avatar-cluster > * + * { margin-left: -10px; }
.avatar-cluster > * {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}
```

### 1.2 Update `tailwind.config.ts`

Add these extensions inside the `theme.extend` block (keep everything existing):

```ts
borderRadius: {
  '4xl': '2rem',
  '5xl': '3rem',
},
```

---

## 2. Global Layout Changes

### 2.1 Root Layout (`src/app/layout.tsx`)
Add full OG metadata:
```tsx
export const metadata: Metadata = {
  title: {
    default: 'Faith The Organizer — From Clutter to Order',
    template: '%s | Faith The Organizer',
  },
  description: "Nairobi's premier home & office organizing service. Book decluttering, home staging, moving, and office organizing today. Serving all Nairobi neighbourhoods.",
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.organizer.co.ke',
    siteName: 'Faith The Organizer',
    title: 'Faith The Organizer — From Clutter to Order',
    description: "Nairobi's premier home & office organizing service.",
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faith The Organizer',
    description: "Nairobi's premier home & office organizing service.",
    images: ['/og/home.jpg'],
  },
}
```

---

## 3. Header Redesign (`src/components/layout/Header.tsx`)

Apply these visual changes while keeping all existing logic:

### 3.1 Utility bar (Row 1, desktop only)
```tsx
<div className="hidden lg:block bg-dark border-b border-white/5">
  <div className="max-w-7xl mx-auto px-8 py-2 flex items-center justify-between">
    <p className="text-white/40 text-xs tracking-wide">
      Professional Home &amp; Office Organizing — Nairobi, Kenya
    </p>
    <div className="flex items-center gap-6 text-white/40 text-xs">
      <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
        <Phone size={11} />{COMPANY.phone}
      </a>
      <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
        <Mail size={11} />{COMPANY.email}
      </a>
    </div>
  </div>
</div>
```

### 3.2 Main nav bar (Row 2) — give it a frosted glass look
```tsx
className="bg-white/90 backdrop-blur-md border-b border-dark/6 relative"
```

### 3.3 "Book Now" CTA — make it the AiroGuide pill style
```tsx
className="hidden md:inline-flex items-center gap-1.5 bg-dark hover:bg-dark/85 text-white font-medium text-sm px-5 py-2.5 rounded-full transition-colors ml-2"
```
Add `↗` arrow: `Book Now <ArrowUpRight size={13} />`

### 3.4 Logo — wrap in pill-like badge style
```tsx
<Link href="/" className="flex-shrink-0 flex items-center gap-2">
  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
    {/* Replace with real SVG logo */}
    <span className="text-white text-xs font-bold">F</span>
  </div>
  <span className="font-display text-lg font-bold text-dark leading-none">
    {COMPANY.name}
  </span>
</Link>
```

---

## 4. Hero Section — Complete Redesign

**File:** `src/components/sections/HeroSection.tsx`

This is the most important section. Model it after the AiroGuide hero exactly:

```tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const HERO_AVATARS = [
  '/images/testimonials/avatar-1.jpg',
  '/images/testimonials/avatar-2.jpg',
  '/images/testimonials/avatar-3.jpg',
  '/images/testimonials/avatar-4.jpg',
]

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden bg-dark">

      {/* ── Full-bleed background image ── */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero/hero-bg.jpg"
          alt="Faith The Organizer — beautiful transformed home space"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Cinematic gradient: strong left, fades right */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-dark/10" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 h-full min-h-[92vh] flex flex-col justify-end pb-16 md:pb-20">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 inline-flex"
        >
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-medium px-3.5 py-1.5 rounded-full">
            <Sparkles size={11} className="text-accent" />
            Nairobi's Premier Organizing Service
          </span>
        </motion.div>

        {/* Two-column layout: heading left, description + social proof right */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">

          {/* Left: Headline + CTA */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white mb-6"
            >
              <span className="block head-sans text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
                From Clutter
              </span>
              <span className="block head-serif text-5xl sm:text-6xl lg:text-7xl leading-none text-accent/90">
                to Order.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-white text-dark font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200"
              >
                Book Your Transformation
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </div>

          {/* Right: Description + social proof cluster */}
          <div className="lg:max-w-xs flex flex-col gap-5">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/70 text-sm leading-relaxed"
            >
              A professional organizing service that transforms your home,
              office, and life — one space at a time. Based in Nairobi, serving
              all neighbourhoods.
            </motion.p>

            {/* Avatar cluster */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="avatar-cluster">
                {HERO_AVATARS.map((src, i) => (
                  <div key={i} style={{ zIndex: HERO_AVATARS.length - i }}>
                    <Image src={src} alt="Happy client" width={36} height={36} className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">500+</p>
                <p className="text-white/50 text-xs">
                  Homes <span className="font-display italic">Transformed</span>
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

---

## 5. About Teaser Section — Editorial Redesign

**File:** `src/components/sections/AboutTeaser.tsx`

Model after AiroGuide's "About Us" section: large editorial text, dark background, mixed serif/sans inline.

```tsx
<section className="bg-dark py-20 md:py-28 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">

    {/* Section label */}
    <p className="section-label text-white/40 mb-8">About Us</p>

    {/* Large editorial statement — full width, centered */}
    <div className="max-w-5xl mx-auto text-center mb-16">
      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl leading-tight font-sans font-medium">
        We help Nairobi families{' '}
        <span className="head-serif italic text-accent">reclaim their space</span>
        {' '}and build homes that feel calm, functional, and{' '}
        <span className="head-serif italic text-white/90">beautifully organised.</span>
        {' '}Your home matters — we make it work{' '}
        <span className="head-serif italic">for you.</span>
      </h2>
    </div>

    {/* Two column: stats + YouTube embed */}
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Stats column */}
      <div className="flex gap-10 lg:flex-col lg:gap-8 flex-shrink-0">
        {[
          { value: '500+', label: 'Homes Organized' },
          { value: '7 yrs', label: 'In Business' },
          { value: '4.9★', label: 'Client Rating' },
        ].map(stat => (
          <div key={stat.label}>
            <p className="head-sans text-4xl text-white leading-none">{stat.value}</p>
            <p className="text-white/40 text-xs mt-1 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Faith photo / YouTube — large rounded card */}
      <div className="flex-1 relative rounded-3xl overflow-hidden aspect-video bg-muted img-zoom">
        <Image
          src="/images/about/faith-portrait.jpg"
          alt="Faith — founder of Faith The Organizer"
          fill className="object-cover"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
        <div className="absolute bottom-5 left-5">
          <p className="text-white font-semibold text-sm">Faith Kariuki</p>
          <p className="text-white/60 text-xs">Founder & Lead Organizer</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Services Strip — Editorial Card Grid

**File:** `src/components/sections/ServicesStrip.tsx`

Redesign to match AiroGuide's "Everything you need for a seamless trip" services section.

```tsx
<section className="bg-dark py-20 md:py-28">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">
    <div className="flex flex-col lg:flex-row gap-12 items-start">

      {/* Left: Heading + pill selectors */}
      <div className="lg:max-w-xs flex-shrink-0">
        <p className="section-label text-white/40 mb-4">Our Services</p>
        <h2 className="text-white mb-8">
          <span className="head-sans text-4xl lg:text-5xl block leading-tight">Everything you need for a</span>
          <span className="head-serif italic text-4xl lg:text-5xl text-accent/90 block leading-tight">tidy space.</span>
        </h2>
        {/* Service pill selectors */}
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(s => (
            <button key={s.slug} className="pill-tag pill-tag-dark text-xs">
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Featured service card with the AiroGuide figure-8 image treatment */}
      <div className="flex-1">
        {/* Large featured card */}
        <div className="bg-white/5 border border-white/8 rounded-3xl p-6 relative overflow-hidden">
          {/* Figure-8 image cluster */}
          <div className="flex gap-3 mb-6">
            <div className="relative h-48 flex-1 rounded-2xl overflow-hidden img-zoom">
              <Image src="/images/services/before-after-1.jpg" alt="Before organizing" fill className="object-cover" sizes="300px" />
            </div>
            <div className="flex flex-col gap-3 w-28">
              <div className="relative h-24 rounded-2xl overflow-hidden img-zoom">
                <Image src="/images/services/before-after-2.jpg" alt="After organizing" fill className="object-cover" sizes="112px" />
              </div>
              <div className="relative h-24 rounded-2xl overflow-hidden img-zoom">
                <Image src="/images/services/before-after-3.jpg" alt="Organized space" fill className="object-cover" sizes="112px" />
              </div>
            </div>
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Most Popular</p>
          <p className="text-white font-semibold text-lg">Whole House Organizing</p>
          <p className="text-white/50 text-sm mt-1">From KSh 15,000</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 7. Stats Section — Bold Numbers Editorial Style

**File:** `src/components/sections/StatsSection.tsx` (or `BoldStatsBlock.tsx`)

Match AiroGuide's "200+" stat sections:

```tsx
<section className="bg-dark border-t border-white/5 py-16 md:py-20">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/8 rounded-2xl overflow-hidden">
      {[
        { value: '500+', label: 'Homes Organized', desc: 'Across all Nairobi neighbourhoods' },
        { value: '7 yrs', label: 'In Business', desc: 'Trusted since 2018' },
        { value: '4.9★', label: 'Average Rating', desc: 'From verified client reviews' },
      ].map((stat, i) => (
        <div key={i} className="bg-dark px-8 py-10">
          <p className="head-sans text-5xl text-white mb-2">{stat.value}</p>
          <p className="text-white/70 text-sm font-medium mb-1">{stat.label}</p>
          <p className="text-white/35 text-xs">{stat.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 8. Featured Products — Dark Card Grid

**File:** `src/components/sections/FeaturedProductsEditorial.tsx`

Match AiroGuide destination cards with the rounded pill image treatment:

```tsx
<section className="bg-dark py-20 md:py-28">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="section-label text-white/40 mb-3">Shop</p>
        <h2 className="text-white">
          <span className="head-sans text-4xl block">Our Best</span>
          <span className="head-serif italic text-4xl text-accent/90">Organising Products</span>
        </h2>
      </div>
      <Link href="/shop"
        className="hidden md:inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
        View All <ArrowUpRight size={14} />
      </Link>
    </div>

    {/* Product card grid — with rounded image treatment */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featuredProducts.map(product => (
        <Link key={product.slug} href={`/shop/${product.slug}`}
          className="group bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 transition-colors">
          
          {/* Image — generous height, rounded top corners via parent */}
          <div className="relative h-52 overflow-hidden img-zoom">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
            {product.salePrice && (
              <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                SALE
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-5">
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{product.category.replace(/-/g, ' ')}</p>
            <p className="text-white font-semibold text-sm mb-2 line-clamp-1 group-hover:text-accent/90 transition-colors">{product.name}</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-mono text-sm">{formatPrice(product.salePrice ?? product.price)}</p>
              {product.salePrice && (
                <p className="text-white/30 font-mono text-xs line-through">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>
```

---

## 9. Gallery / Transformation Showcase

**File:** `src/components/sections/TransformationShowcase.tsx`

Match AiroGuide's "Captured Travel Moments" gallery section: dark bg, asymmetric grid, rotated captions.

```tsx
<section className="bg-dark py-20 md:py-28">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">

    {/* Header row */}
    <div className="flex items-start gap-8 mb-12">
      <div>
        <p className="head-sans text-6xl text-white leading-none">2.5k+</p>
        <p className="text-white/30 text-xs mt-2 max-w-[140px]">Happy clients, unforgettable spaces.</p>
      </div>
      <div className="ml-auto text-right">
        <p className="section-label text-white/40 mb-2">Gallery</p>
        <h2 className="text-white text-3xl">
          <span className="head-sans block">Before & After</span>
          <span className="head-serif italic text-accent/90">Moments</span>
        </h2>
      </div>
    </div>

    {/* Asymmetric photo grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {/* Large card — col span 2 on md */}
      <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-72 img-zoom group">
        <Image src="/images/gallery/transform-1.jpg" alt="Home transformation" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        {/* Rotated caption */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <p className="caption-rotate text-white/60 text-xs tracking-widest uppercase">Living Room Reveal</p>
        </div>
      </div>

      {/* Tall card */}
      <div className="relative rounded-3xl overflow-hidden h-72 img-zoom">
        <Image src="/images/gallery/transform-2.jpg" alt="Organized bedroom" fill className="object-cover" sizes="33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-xs font-semibold">Bedroom & Closet</p>
          <p className="text-white/50 text-[10px] italic font-display">Space Planning</p>
        </div>
      </div>

      {/* Two smaller cards */}
      <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
        <Image src="/images/gallery/transform-3.jpg" alt="Organized kitchen" fill className="object-cover" sizes="33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xs font-semibold">Kitchen</p>
          <p className="text-white/40 text-[10px] italic font-display">Decluttering</p>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
        <Image src="/images/gallery/transform-4.jpg" alt="Organized office" fill className="object-cover" sizes="33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xs font-semibold">Home Office</p>
          <p className="text-white/40 text-[10px] italic font-display">Organization</p>
        </div>
      </div>

      <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
        <Image src="/images/gallery/transform-5.jpg" alt="Storage solutions" fill className="object-cover" sizes="33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-white text-xs font-semibold">Storage & Shelving</p>
          <p className="text-white/40 text-[10px] italic font-display">Solutions</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 10. Testimonials — Split Dark/Light

**File:** `src/components/sections/TestimonialsSection.tsx`

Match AiroGuide "Loved by Explorers Worldwide" section: dark left / light right split layout.

```tsx
<section className="flex flex-col lg:flex-row min-h-[60vh]">

  {/* Left — dark side with gallery images */}
  <div className="lg:w-2/5 bg-dark p-8 lg:p-12 flex flex-col gap-4">
    <p className="section-label text-white/40">Gallery</p>
    <div className="flex flex-col gap-3 flex-1">
      {galleryImages.slice(0, 2).map((img, i) => (
        <div key={i} className="relative flex-1 rounded-2xl overflow-hidden img-zoom">
          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="40vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
          <p className="absolute bottom-3 left-4 text-white text-xs font-semibold">{img.caption}</p>
          <p className="absolute bottom-3 left-4 mt-4 text-white/40 caption-rotate right-3 top-1/2 -translate-y-1/2 text-[10px] italic font-display">{img.subcaption}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Right — light side with reviews */}
  <div className="lg:w-3/5 bg-surface p-8 lg:p-16 flex flex-col justify-center">
    <div className="mb-2">
      <p className="head-sans text-5xl text-dark leading-none">2.5k</p>
      <p className="head-serif italic text-5xl text-dark/70 leading-none">Reviews</p>
    </div>
    <p className="text-dark/40 text-xs mb-10">Real feedback from Nairobi clients who organized better.</p>

    <p className="section-label text-dark/40 mb-4">Testimonials</p>
    <h2 className="text-dark text-4xl mb-10">
      <span className="head-sans block">Loved by Nairobi</span>
      <span className="head-serif italic block text-primary">Homeowners</span>
    </h2>

    {/* Review cards — horizontal scroll on mobile */}
    <div className="flex flex-col gap-5">
      {testimonials.slice(0, 2).map(t => (
        <div key={t.id} className="bg-white rounded-2xl p-5 shadow-sm border border-dark/5">
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: t.rating }).map((_, i) => (
              <span key={i} className="text-accent text-sm">★</span>
            ))}
          </div>
          <p className="text-dark/70 text-sm leading-relaxed italic font-display mb-4">"{t.text}"</p>
          <div className="flex items-center gap-3">
            {t.avatar && (
              <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
              </div>
            )}
            <div>
              <p className="text-dark font-semibold text-sm">{t.name}</p>
              <p className="text-dark/40 text-xs">{t.location}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 11. Footer CTA Band

**File:** `src/components/sections/FooterCTABand.tsx`

Give it the dark editorial treatment:

```tsx
<section className="bg-dark border-t border-white/6 py-20">
  <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
    <p className="section-label text-white/30 mb-6">Get Started</p>
    <h2 className="mb-8">
      <span className="head-sans text-5xl md:text-6xl text-white block">Ready to transform</span>
      <span className="head-serif italic text-5xl md:text-6xl text-accent/90 block">your space?</span>
    </h2>
    <p className="text-white/50 text-base max-w-md mx-auto mb-10">
      Book a free consultation. Faith visits your home, assesses the space,
      and creates a plan — no obligation.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Link href="/book"
        className="inline-flex items-center gap-2 bg-white text-dark font-semibold px-7 py-4 rounded-full hover:bg-white/90 transition-colors">
        Book Free Consultation <ArrowUpRight size={16} />
      </Link>
      <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 border border-white/15 text-white font-medium px-7 py-4 rounded-full hover:border-white/30 hover:bg-white/5 transition-colors">
        WhatsApp Us
      </a>
    </div>
  </div>
</section>
```

---

## 12. Footer — Dark Editorial

**File:** `src/components/layout/Footer.tsx`

```tsx
<footer className="bg-dark border-t border-white/6 pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">

    {/* Top row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

      {/* Brand column */}
      <div className="md:col-span-1">
        <Link href="/" className="font-display text-xl font-bold text-white block mb-3">
          {COMPANY.name}
        </Link>
        <p className="text-white/40 text-sm leading-relaxed mb-5">
          Nairobi's premier home & office organizing service — from clutter to calm.
        </p>
        <div className="flex items-center gap-3">
          {/* Social icons */}
          <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer"
            className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors">
            {/* Instagram icon from Lucide */}
            <Instagram size={15} />
          </a>
        </div>
      </div>

      {/* Services */}
      <div>
        <p className="section-label text-white/30 mb-5">Services</p>
        <ul className="flex flex-col gap-2.5">
          {SERVICES.slice(0, 6).map(s => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`}
                className="text-white/50 text-sm hover:text-white transition-colors">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Shop */}
      <div>
        <p className="section-label text-white/30 mb-5">Shop</p>
        <ul className="flex flex-col gap-2.5">
          {SHOP_CATEGORIES.map(c => (
            <li key={c.slug}>
              <Link href={`/shop?category=${c.slug}`}
                className="text-white/50 text-sm hover:text-white transition-colors">
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Company */}
      <div>
        <p className="section-label text-white/30 mb-5">Company</p>
        <ul className="flex flex-col gap-2.5">
          {[
            { label: 'About', href: '/about' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
            { label: 'Book a Service', href: '/book' },
            { label: 'FAQ', href: '/faq' },
          ].map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-white/25 text-xs">
        © {new Date().getFullYear()} Faith The Organizer. All rights reserved.
      </p>
      <div className="flex items-center gap-5">
        {[
          { label: 'Privacy', href: '/privacy-policy' },
          { label: 'Terms', href: '/terms-and-conditions' },
          { label: 'Shipping & Returns', href: '/shipping-and-returns' },
        ].map(l => (
          <Link key={l.href} href={l.href} className="text-white/25 text-xs hover:text-white/50 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</footer>
```

---

## 13. Service Cards — AiroGuide Destination Card Style

**File:** `src/components/ui/ServiceCard.tsx`

```tsx
// Dark card with rounded image, rotated subcategory text
<Link href={`/services/${service.slug}`}
  className="group relative bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-300">

  {/* Image */}
  <div className="relative h-52 overflow-hidden img-zoom">
    <Image src={service.image ?? '/images/services/default.jpg'} alt={service.title} fill className="object-cover" sizes="400px" />
    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
    {/* Price badge bottom-right */}
    <span className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-mono px-2.5 py-1 rounded-full">
      From {formatPrice(service.priceFrom)}
    </span>
  </div>

  {/* Card body */}
  <div className="p-5">
    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">Organizing Service</p>
    <p className="text-white font-semibold text-sm group-hover:text-accent/90 transition-colors">{service.title}</p>
    <p className="text-white/40 text-xs mt-1">{service.duration ?? 'Half day – 2 days'}</p>
  </div>
</Link>
```

---

## 14. Homepage Assembly (`src/app/(marketing)/page.tsx`)

Assemble sections in this exact order:

```tsx
import HeroSection              from '@/components/sections/HeroSection'
import ServicesStrip            from '@/components/sections/ServicesStrip'
import StatsSection             from '@/components/sections/StatsSection'
import FeaturedProductsEditorial from '@/components/sections/FeaturedProductsEditorial'
import TransformationShowcase   from '@/components/sections/TransformationShowcase'
import TestimonialsSection      from '@/components/sections/TestimonialsSection'
import AboutTeaser              from '@/components/sections/AboutTeaser'
import EditorialBlogPreview     from '@/components/sections/EditorialBlogPreview'
import MediaFeaturesSection     from '@/components/sections/MediaFeaturesSection'
import FooterCTABand            from '@/components/sections/FooterCTABand'

export default function HomePage() {
  return (
    <main className="bg-dark">
      <HeroSection />
      <ServicesStrip />
      <StatsSection />
      <FeaturedProductsEditorial />
      <TransformationShowcase />
      <TestimonialsSection />
      <AboutTeaser />
      <EditorialBlogPreview />
      <MediaFeaturesSection />
      <FooterCTABand />
    </main>
  )
}
```

---

## 15. Service Detail Pages (`src/app/services/[slug]/page.tsx`)

Apply dark editorial style to individual service pages:
- Hero: full-bleed dark background, large heading with mixed serif/sans
- All section cards: dark cards with `bg-white/4 border border-white/8 rounded-3xl`
- Before/after gallery: use the asymmetric grid treatment from §9
- Pricing: pill-style pricing cards on dark background
- Booking CTA: match FooterCTABand style

---

## 16. Shop Page (`src/app/shop/page.tsx`)

- Background: switch from light to dark (`bg-dark`)
- Category tabs: convert to `pill-tag pill-tag-dark` style
- Product cards: use the dark card pattern from §8
- Filter sidebar: dark glass panel `bg-white/4 border border-white/8 rounded-2xl`

---

## 17. Button Component (`src/components/ui/Button.tsx`)

Add a `rounded-full` pill variant alongside existing styles:

```tsx
const variants = {
  primary:   'bg-primary hover:bg-primary/90 text-white',
  secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  dark:      'bg-dark hover:bg-dark/85 text-white',
  ghost:     'border border-white/15 text-white hover:border-white/30 hover:bg-white/5',
  white:     'bg-white text-dark hover:bg-white/90',
}
const sizes = {
  sm:  'px-4 py-2 text-xs',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-4 text-base',
}
const radius = {
  default: 'rounded-lg',
  pill:    'rounded-full',
}
```

---

## 18. WhatsApp Float (`src/components/ui/WhatsAppFloat.tsx`)

Keep functionality, update style to match dark aesthetic:
```tsx
className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white text-sm font-semibold px-4 py-3 rounded-full shadow-xl shadow-black/20 transition-all duration-200 hover:scale-105"
```

---

## 19. Implementation Notes

1. **Image placeholders:** Until real before/after images exist, use Unsplash URLs:
   - Hero: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600` (organized room)
   - Gallery: search Unsplash for `organized home`, `decluttered kitchen`, `bedroom organization`

2. **Dark page wrapper:** Every page should have `<main className="bg-dark">` as the root unless it's specifically a light page (checkout, cart, account — keep those on `bg-surface`).

3. **Section alternation:** The design alternates dark → dark → dark → light (only checkout/account/forms). This is different from the original FTO which was predominantly light. The cinematic dark treatment is the core aesthetic shift.

4. **`img-zoom` class:** Already defined in §1.1 CSS. Apply to every image container that has `overflow-hidden`.

5. **Existing animation hooks** (`useScrollAnimation.ts`, `useCountUp.ts`) — keep these wired to the new stat sections.

6. **Mobile-first:** All new sections must be `grid-cols-1` defaulting to stacked, with `md:` / `lg:` breakpoints for the editorial two-column layouts.

7. **Accessibility:** All new image cards must have descriptive `alt` text. All icon-only buttons must keep their `aria-label`.
