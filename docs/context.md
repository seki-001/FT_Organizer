# Faith The Organizer — Cursor Project Context

> **How to use this file:** Tag `@context.md` in every Cursor Composer prompt. This file is the single source of truth for the project. Never deviate from these rules without updating this file first.

---

## 1. Project Overview

| Field | Value |
|---|---|
| Client | Faith The Organizer |
| Live site | https://organizer.co.ke/ |
| Business type | Professional home & office organizing services + e-commerce shop |
| Location | Nairobi, Kenya |
| Target users | Urban Nairobi homeowners, renters, and offices |
| Currency | KSh (Kenyan Shillings) — always format as `KSh 1,250` |
| Primary contact | Faith (founder) |

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript — strict mode, no `any` |
| Styling | Tailwind CSS only — no CSS modules, no inline styles |
| Icons | Lucide React — no other icon libraries |
| Forms | react-hook-form + zod for all validation |
| Data fetching | @tanstack/react-query |
| Animations | framer-motion |
| Carousel | embla-carousel-react |
| Email | Resend |
| Auth | NextAuth.js (Google OAuth + email/password) |
| Payments | M-Pesa (Daraja API via IntaSend) + Flutterwave |
| Frontend hosting | Vercel |
| Analytics | Google Analytics 4 + Vercel Analytics |
| IDE | Cursor |

---

## 3. Design System

### 3.1 Colors

Always use these Tailwind tokens — never hardcode hex values in components.

```ts
// tailwind.config.ts
colors: {
  primary: '#CC1212',    // Brand red — from logo, buttons, headings, brand elements
  accent:  '#E8A020',    // Warm gold — CTAs, sale badges, highlights (complements red)
  dark:    '#1A1A1A',    // Near black — from logo, body text, footer background
  surface: '#FAFAFA',    // Clean white — page backgrounds
  muted:   '#F4F4F4',    // Light gray — card backgrounds, input fields
  success: '#2D7A47',    // Green — confirmed, in stock states
  danger:  '#991010',    // Deep red — errors, critical alerts (darker than primary)
}
```

### 3.2 Typography

```ts
// tailwind.config.ts
fontFamily: {
  display: ['Playfair Display', 'serif'],   // Hero headings, section titles
  sans:    ['Inter', 'sans-serif'],          // Body, UI, labels
  mono:    ['DM Mono', 'monospace'],         // Prices, codes
}
```

**Rules:**
- `font-display` — H1s, hero headlines, section headings only
- `font-sans` — everything else (body, nav, buttons, labels)
- `font-mono` — prices (KSh amounts) only
- Base body size: `text-base` (16px), line height `leading-relaxed`
- Never use Arial, Roboto, or system-ui

### 3.3 Spacing & Layout

- Max content width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Section vertical padding: `py-16 md:py-24`
- Card gap: `gap-6`
- All border radius: `rounded-xl` for cards, `rounded-lg` for buttons/inputs, `rounded-full` for badges/pills

### 3.4 Component Patterns

**Primary Button:**
```tsx
className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
```

**Secondary Button (outlined):**
```tsx
className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
```

**Card:**
```tsx
className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
```

**Section heading pattern:**
```tsx
<h2 className="font-display text-3xl md:text-4xl text-dark mb-4">Heading</h2>
<p className="text-dark/60 text-lg max-w-2xl">Subheading</p>
```

---

## 4. File & Folder Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Homepage /
│   │   ├── about/page.tsx        # /about
│   │   ├── contact/page.tsx      # /contact
│   │   └── faq/page.tsx          # /faq
│   ├── services/
│   │   ├── page.tsx              # /services (hub)
│   │   └── [slug]/page.tsx       # /services/[slug]
│   ├── shop/
│   │   ├── page.tsx              # /shop (catalogue)
│   │   ├── [slug]/page.tsx       # /shop/[product-slug]
│   │   └── [category]/page.tsx   # /shop/kitchen-organization etc.
│   ├── blog/
│   │   ├── page.tsx              # /blog
│   │   └── [slug]/page.tsx       # /blog/[post-slug]
│   ├── book/page.tsx             # /book (booking form)
│   ├── cart/page.tsx             # /cart
│   ├── checkout/page.tsx         # /checkout
│   ├── order-confirmation/page.tsx
│   ├── account/
│   │   ├── page.tsx              # /account dashboard
│   │   ├── orders/page.tsx
│   │   ├── bookings/page.tsx
│   │   └── profile/page.tsx
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # Primitives: Button, Input, Badge, Card, Modal
│   ├── layout/                   # Header, Footer, Nav, MobileMenu
│   ├── sections/                 # Homepage sections, reusable page sections
│   └── shop/                     # ProductCard, CartItem, CheckoutForm, etc.
├── lib/
│   ├── types.ts                  # All TypeScript interfaces (see §6)
│   ├── utils.ts                  # formatPrice(), cn(), slugify()
│   ├── constants.ts              # Services, nav links, categories (see §7)
│   └── validations.ts            # Zod schemas for all forms
└── hooks/                        # Custom React hooks
```

**Rules:**
- Server components by default
- Add `"use client"` only when using hooks, events, or browser APIs
- Co-locate component styles with the component (no global style overrides)
- Never create a file outside this structure without updating this doc

---

## 5. Site Architecture

### Navigation (in order)
```
Home | About | Services | Shop | Blog | Contact | [Book Now CTA]
```

### Full URL Map

| Page | URL | Type |
|---|---|---|
| Homepage | `/` | Marketing |
| About | `/about` | Marketing |
| Services hub | `/services` | Marketing |
| Service page | `/services/[slug]` | Marketing |
| Shop catalogue | `/shop` | E-commerce |
| Product page | `/shop/[slug]` | E-commerce |
| Cart | `/cart` | E-commerce |
| Checkout | `/checkout` | E-commerce |
| Order confirmation | `/order-confirmation` | E-commerce |
| Blog index | `/blog` | Content |
| Blog post | `/blog/[slug]` | Content |
| Booking | `/book` | Services |
| Account dashboard | `/account` | Auth |
| Contact | `/contact` | Marketing |
| FAQ | `/faq` | Marketing |
| Shipping & Returns | `/shipping-and-returns` | Legal |
| Privacy Policy | `/privacy-policy` | Legal |
| Terms | `/terms-and-conditions` | Legal |

### Service Slugs (exact)
```
/services/general-decluttering
/services/whole-house-organizing
/services/moving-house
/services/shelving-and-storage
/services/packing-and-removal
/services/paperwork-management
/services/online-coaching
/services/online-consulting
/services/home-staging
/services/space-planning
/services/office-organizing
```

### Shop Categories (exact)
```
/shop/kitchen-organization
/shop/closet-and-bedroom
/shop/office-and-desk
/shop/storage-solutions
/shop/bundles
```

---

## 6. TypeScript Interfaces

Define all types in `src/lib/types.ts`. Use these exactly:

```ts
export interface Service {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: string           // Lucide icon name
  priceFrom: number      // in KSh
  duration: string       // e.g. "Half day" | "Full day" | "1–2 days"
  includes: string[]
  steps: { title: string; description: string }[]
  gallery: string[]      // image URLs
  testimonials: Testimonial[]
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number          // in KSh
  salePrice?: number     // in KSh
  category: ProductCategory
  images: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  featured: boolean
  variants?: ProductVariant[]
  specs?: Record<string, string>
}

export type ProductCategory =
  | 'kitchen-organization'
  | 'closet-and-bedroom'
  | 'office-and-desk'
  | 'storage-solutions'
  | 'bundles'

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: ProductVariant
}

export interface Testimonial {
  id: string
  name: string
  location: string       // e.g. "Westlands, Nairobi"
  rating: number
  text: string
  service?: string
  avatar?: string
}

export interface Booking {
  id: string
  service: string
  date: string
  name: string
  email: string
  phone: string
  propertyType: 'apartment' | 'house' | 'office'
  propertySize: 'small' | 'medium' | 'large'
  notes?: string
  status: 'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryMethod: 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
  deliveryFee: number
  paymentMethod: 'mpesa' | 'card' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
  customer: Customer
  createdAt: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  notes?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  author: string
  publishedAt: string
  readTime: number       // in minutes
  tags: string[]
}

export type BlogCategory =
  | 'home-tips'
  | 'office'
  | 'before-and-after'
  | 'product-reviews'
  | 'nairobi-living'
```

---

## 7. Constants

All static data lives in `src/lib/constants.ts`. Never hardcode these in components.

```ts
export const SERVICES = [
  { slug: 'general-decluttering', title: 'General Decluttering', icon: 'Trash2', priceFrom: 5000 },
  { slug: 'whole-house-organizing', title: 'Whole House Organizing', icon: 'Home', priceFrom: 15000 },
  { slug: 'moving-house', title: 'Moving House', icon: 'Truck', priceFrom: 8000 },
  { slug: 'shelving-and-storage', title: 'Shelving & Storage', icon: 'Archive', priceFrom: 6000 },
  { slug: 'packing-and-removal', title: 'Packing & Removal', icon: 'Package', priceFrom: 7000 },
  { slug: 'paperwork-management', title: 'Paperwork Management', icon: 'FileText', priceFrom: 4000 },
  { slug: 'online-coaching', title: 'Online Coaching', icon: 'Video', priceFrom: 3000 },
  { slug: 'online-consulting', title: 'Online Consulting', icon: 'MessageSquare', priceFrom: 2500 },
  { slug: 'home-staging', title: 'Home Staging', icon: 'Sparkles', priceFrom: 12000 },
  { slug: 'space-planning', title: 'Space Planning', icon: 'Layout', priceFrom: 8000 },
  { slug: 'office-organizing', title: 'Office Organizing', icon: 'Briefcase', priceFrom: 10000 },
]

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export const SHOP_CATEGORIES = [
  { slug: 'kitchen-organization', label: 'Kitchen' },
  { slug: 'closet-and-bedroom', label: 'Closet & Bedroom' },
  { slug: 'office-and-desk', label: 'Office & Desk' },
  { slug: 'storage-solutions', label: 'Storage' },
  { slug: 'bundles', label: 'Bundles' },
]

export const DELIVERY_OPTIONS = [
  { id: 'nairobi-same-day', label: 'Nairobi Same Day', price: 0, description: 'Free — Nairobi CBD & select areas' },
  { id: 'standard-nationwide', label: 'Standard Nationwide', price: 300, description: '2–4 business days' },
  { id: 'pickup', label: 'Pick Up', price: 0, description: 'Collect from our location' },
]

export const PAYMENT_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', description: 'Pay via M-Pesa STK Push' },
  { id: 'card', label: 'Card', description: 'Visa or Mastercard via Flutterwave' },
  { id: 'cod', label: 'Cash on Delivery', description: 'Nairobi deliveries only' },
]

export const MEDIA_FEATURES = [
  { name: 'EVE Magazine', logo: '/media/eve.png' },
  { name: 'The Standard', logo: '/media/standard.png' },
  { name: 'Daily Nation', logo: '/media/nation.png' },
  { name: 'Citizen TV', logo: '/media/citizen.png' },
]

export const COMPANY = {
  name: 'Faith The Organizer',
  tagline: 'Nairobi\'s Premier Home & Office Organizer',
  phone: '+254 700 000 000',      // update with real number
  email: 'hello@organizer.co.ke',
  whatsapp: '+254700000000',      // update with real number
  address: 'Nairobi, Kenya',
  instagram: 'https://instagram.com/faiththeorganizer',
  facebook: 'https://facebook.com/faiththeorganizer',
  youtube: 'https://www.youtube.com/watch?v=KaNkmO7Mpac',
}
```

---

## 8. Utility Functions

Always in `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format KSh price: 1250 → "KSh 1,250"
export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

// Calculate discount percentage
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

// Slug to readable title
export function slugToTitle(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
```

---

## 9. Key Page Sections (Build Order)

Build pages in this order. Each section below is a standalone component.

### Homepage `/`
1. `<Header />` — sticky, transparent on scroll, solid on scroll-down
2. `<HeroSection />` — full-width, headline, two CTAs, trust badge
3. `<ServicesStrip />` — horizontal scroll cards of all services
4. `<StatsSection />` — 3 numbers (500+ homes, 7 years, 4.9★)
5. `<FeaturedProducts />` — 3–4 product cards from `featured: true`
6. `<HowItWorks />` — 3-step visual (Book → Assess → Transform)
7. `<TestimonialsCarousel />` — star ratings, name, Nairobi neighbourhood
8. `<MediaFeatures />` — logo strip (EVE, Standard, Nation, Citizen)
9. `<AboutTeaser />` — Faith photo + YouTube embed + CTA
10. `<BlogPreview />` — 3 latest posts
11. `<FooterCTABand />` — dark bg, "Ready to transform your space?" + book button
12. `<Footer />` — links, social, contact, legal

### Individual Service Page `/services/[slug]`
1. `<ServiceHero />` — name, image, CTA
2. `<WhatIsIncluded />` — bullet list / icon grid
3. `<HowItWorksService />` — steps for this specific service
4. `<ServicePricing />` — price tiers, "Starting from KSh X"
5. `<BeforeAfterGallery />` — image pairs (critical for conversion)
6. `<ServiceTestimonials />` — 2–3 relevant reviews
7. `<RelatedServices />` — "You might also need" cards
8. `<BookingCTA />` — links to /book with service pre-selected

### Shop `/shop`
1. `<ShopHero />` — banner (admin-swappable)
2. `<CategoryTabs />` — filter by category
3. `<FilterSidebar />` — price range, in-stock, sort
4. `<ProductGrid />` — 12 per page
5. `<Pagination />`

### Checkout `/checkout`
1. `<CheckoutProgress />` — step indicator (Details → Delivery → Payment)
2. `<DeliveryDetailsForm />`
3. `<DeliveryMethodSelector />`
4. `<PaymentMethodSelector />` — M-Pesa, Card, COD
5. `<MpesaSTKFlow />` — phone input → STK push → confirm
6. `<OrderSummary />` — always visible sidebar

---

## 10. Payment Integration Notes

### M-Pesa (Primary)
- Use **IntaSend** SDK — simplest Daraja wrapper for Next.js
- Flow: User enters Safaricom number → API triggers STK push → User enters PIN on phone → Webhook confirms payment → Order created
- API route: `POST /api/payments/mpesa/initiate`
- Webhook: `POST /api/payments/mpesa/callback`
- **Never store M-Pesa PINs — only phone numbers**
- Sandbox test number: any Safaricom number with test credentials

### Flutterwave (Card fallback)
- Use `@flutterwave/flutterwave-react-v3`
- Handles Visa, Mastercard, Airtel Money
- API route: `POST /api/payments/flutterwave/initiate`

### Environment Variables (`.env.local`)
```
INTASEND_API_KEY=
INTASEND_SECRET_KEY=
INTASEND_IS_SANDBOX=true
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_GA_ID=
```

---

## 11. Booking Flow

```
/book page → Step 1: Select service (pre-fill from ?service= query param)
           → Step 2: Pick date (calendar, show unavailable dates)
           → Step 3: Your details (name, email, phone, property type, size, notes)
           → Step 4: Review & Submit
           → POST /api/bookings → email to admin + confirmation to client
           → Thank you screen with order reference
```

Admin receives email with all details. No payment at booking stage — Faith quotes manually within 24 hours.

---

## 12. Mobile Rules

- **Mobile-first always** — write mobile styles first, then `md:` and `lg:` overrides
- Minimum tap target: `min-h-[44px] min-w-[44px]`
- Floating WhatsApp button on mobile: fixed bottom-right, z-50
- Hamburger menu on `< md`, desktop nav on `md+`
- Product grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Service cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

---

## 13. SEO Rules

Every page must have:
```tsx
export const metadata: Metadata = {
  title: 'Page Title | Faith The Organizer',
  description: '150–160 character description targeting Nairobi keywords',
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og/page-name.jpg'],
  },
}
```

Target keywords to weave into content naturally:
- "home organizer Nairobi"
- "professional organizer Kenya"
- "decluttering service Nairobi"
- "office organizing Nairobi"
- "moving house organizer Kenya"

---

## 14. Coding Rules (Non-Negotiable)

1. **TypeScript strict** — no `any`, no `// @ts-ignore`
2. **Tailwind only** — no inline `style={}`, no CSS files (except `globals.css`)
3. **Server components by default** — add `"use client"` only when required
4. **Next.js Image** — never use `<img>` tag directly
5. **Next.js Link** — never use `<a>` for internal navigation
6. **No hardcoded text** — all labels/copy come from constants or props
7. **No hardcoded colors** — always use Tailwind tokens from the design system
8. **No duplicate pages** — one Cart, one Checkout, one Contact (lessons from old site)
9. **formatPrice()** — always use this for KSh amounts, never format manually
10. **Error boundaries** — wrap all async data-fetching sections
11. **Loading states** — every async component needs a `loading.tsx` or skeleton
12. **Accessibility** — all images need `alt` text, all buttons need `aria-label` if icon-only

---

## 15. What's Been Fixed vs Old Site

The following problems from `organizer.co.ke` must NOT exist in the rebuild:

| Old Problem | New Solution |
|---|---|
| PHP errors displayed publicly | Clean Next.js — no server errors shown to users |
| Duplicate Cart, Checkout, Contact pages | One of each, correct URL structure |
| Broken "Book Appointment" button | Fully functional /book page |
| Empty footer | Full footer with nav, contact, legal, social links |
| No pricing displayed | Every service shows "From KSh X" |
| No before/after photos in services | Required section on every service page |
| Inconsistent navigation | One nav, same on all pages |
| No mobile WhatsApp button | Fixed floating WhatsApp CTA on mobile |

---

