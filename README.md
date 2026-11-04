# Faith The Organizer — Website

> **From Clutter to Order** — Nairobi's premier home & office organizing service.

A full-featured e-commerce and service booking platform built with Next.js 14, Tailwind CSS, and TypeScript.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + `@tailwindcss/typography` |
| Fonts | Playfair Display · Inter · DM Mono (via `next/font/google`) |
| Forms | `react-hook-form` + `zod` |
| Animations | `framer-motion` |
| Carousel | `embla-carousel-react` |
| Auth | NextAuth.js v4 (Google + Credentials) |
| State | React Context API (Cart · Wishlist · Auth) |
| Payments | M-Pesa via IntaSend/Daraja · Flutterwave (card) |
| Email | Resend |
| Hosting | Vercel (recommended) |

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd FT_Organizer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your values. See the comments in `.env.local.example` for where to get each key.

At minimum, for local development you need:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages & API routes
│   ├── (marketing)/            # Route group: homepage, about, contact, faq, blog
│   ├── account/                # Protected user account section
│   ├── api/                    # API route handlers
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   ├── bookings/           # Booking submissions
│   │   ├── contact/            # Contact form
│   │   ├── newsletter/         # Newsletter subscriptions
│   │   ├── account/profile/    # Profile updates
│   │   └── payments/           # M-Pesa & Flutterwave
│   ├── blog/                   # Blog index + [slug] post pages
│   ├── book/                   # Multi-step booking form
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Multi-step checkout
│   ├── login/ register/        # Auth pages
│   ├── order-confirmation/     # Post-purchase confirmation
│   ├── services/               # Services hub + [slug] detail pages
│   ├── shop/                   # Shop catalogue + [slug] product pages
│   ├── not-found.tsx           # Custom 404
│   ├── error.tsx               # Global error boundary
│   └── layout.tsx              # Root layout
│
├── components/
│   ├── layout/                 # Header, Footer, LegalLayout
│   ├── sections/               # Page sections (Hero, Services, Stats, etc.)
│   ├── shop/                   # ProductCard
│   └── ui/                     # Reusable UI (Accordion, PostCard, WhatsAppFloat, etc.)
│
├── context/                    # React Context providers
│   ├── AuthContext.tsx         # Mock auth (swap with NextAuth in production)
│   ├── CartContext.tsx         # Shopping cart state
│   └── WishlistContext.tsx     # Wishlist state
│
└── lib/
    ├── constants.ts            # SERVICES, NAV_LINKS, COMPANY, DELIVERY_OPTIONS, etc.
    ├── mock-account.ts         # Mock orders & bookings (dev only)
    ├── mock-posts.ts           # Mock blog posts (dev only)
    ├── mock-products.ts        # Mock products (dev only — replace with real data source)
    ├── types.ts                # TypeScript interfaces
    ├── utils.ts                # cn(), formatPrice(), discountPercent(), slugToTitle()
    └── validations.ts          # Zod schemas (BookingForm, ContactForm, CheckoutForm)
```

---

## How to Add a New Service

1. **Open `src/lib/constants.ts`**
2. Add an entry to the `SERVICES` array:
   ```ts
   { slug: 'your-slug', title: 'Service Name', icon: 'LucideIconName', priceFrom: 5000 }
   ```
3. The service automatically appears in:
   - Header search results
   - Homepage services strip (`ServicesStrip`)
   - Services hub page (`/services`)
   - Dynamic route `/services/your-slug` (via `generateStaticParams`)
   - Booking form step 1 (service selector)
   - Footer service links (first 6)

> **Icon names** must match a [Lucide icon](https://lucide.dev/icons/). The dynamic service page uses a `ICON_MAP` — add your icon to the map in `src/app/services/[slug]/page.tsx` if it is not already there.

---

## How to Add a New Product

1. **Open `src/lib/mock-products.ts`**
2. Add a new `Product` object to the `MOCK_PRODUCTS` array. Match the `Product` type from `src/lib/types.ts` exactly:
   ```ts
   {
     id:          'unique-id',
     slug:        'url-friendly-slug',
     name:        'Product Name',
     description: '...',
     price:       2500,           // KSh
     salePrice:   1990,           // optional
     category:    'kitchen-organization',
     images:      ['https://...'],
     inStock:     true,
     stockCount:  20,
     rating:      4.5,
     reviewCount: 12,
     featured:    false,
   }
   ```
3. The product automatically appears in:
   - Shop catalogue (`/shop`)
   - Category filter tabs
   - Header search results
   - Related products sections
   - Dynamic route `/shop/your-slug` (via `generateStaticParams`)

> **For production**, replace `mock-products.ts` with a real data source (Sanity CMS, Supabase, Shopify Storefront API, etc.) and update the `generateStaticParams` and page data-fetching functions accordingly.

---

## How to Deploy to Vercel

1. **Push to GitHub** (or GitLab / Bitbucket)

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Framework: **Next.js** (auto-detected)

3. **Set environment variables**
   - In Vercel project → Settings → Environment Variables
   - Add all variables from `.env.local.example` with production values
   - Set `NEXT_PUBLIC_SITE_URL` to `https://www.organizer.co.ke`
   - Set `INTASEND_IS_SANDBOX=false` for live M-Pesa payments

4. **Deploy**
   - Click **Deploy** — Vercel builds and deploys automatically
   - Every push to `main` triggers a new deployment

5. **Custom domain**
   - Vercel project → Settings → Domains → Add `www.organizer.co.ke`
   - Update DNS at your domain registrar to point to Vercel's nameservers

---

## Payment Integration Status

| Payment Method | Status | What to Do Before Launch |
|---|---|---|
| M-Pesa STK Push | **Mock** | Replace stub in `src/app/api/payments/mpesa/initiate/route.ts` with real IntaSend or Daraja API call. Set `INTASEND_API_KEY`, `INTASEND_SECRET_KEY`, `INTASEND_IS_SANDBOX=false`. |
| M-Pesa Status Poll | **Mock** | Replace poll logic in `src/app/api/payments/mpesa/status/route.ts` with real Daraja query-status endpoint. |
| Card (Flutterwave) | **Mock** | Replace redirect in `src/app/api/payments/flutterwave/initiate/route.ts` with real Flutterwave hosted payment link. Set `FLUTTERWAVE_PUBLIC_KEY` and `FLUTTERWAVE_SECRET_KEY`. |
| Cash on Delivery | **Functional** | No integration needed — COD places order directly. Confirm availability in your delivery policy. |

> All mock API routes include detailed code comments showing the exact real payload structures and integration steps.

---

## Auth Integration Status

Authentication is currently powered by a **mock `AuthContext`** that defaults to a logged-in "Demo User". This lets all account pages be viewed during development without a real backend.

**To activate real NextAuth:**

1. Run `npm install` (next-auth is already in `package.json`)
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in `.env.local`
3. Uncomment the handler code in `src/app/api/auth/[...nextauth]/route.ts`
4. In any component importing from `@/context/AuthContext`, change:
   ```ts
   import { useSession, useSignOut } from '@/context/AuthContext'
   ```
   to:
   ```ts
   import { useSession, signOut } from 'next-auth/react'
   ```
   The hook return shape is identical — it is a 1-line change per file.

---

## Contact

**Faith The Organizer**
- Email: faith@organizer.co.ke
- Website: https://www.organizer.co.ke
- Instagram: [@faiththeorganizer](https://www.instagram.com/faiththeorganizer)
- WhatsApp: https://wa.me/message/TFUU32A5KKSOG1
