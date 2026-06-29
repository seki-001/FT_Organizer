# Live Site Audit — Fix Prompt
> Paste into Cursor Composer with `@context.md`. This is based on a full browser audit of http://localhost:3000.
> Fix every issue listed below exactly as described. Do not skip any item.

---

## 🔴 CRITICAL — Broken Pages (Blank/Invisible Content)

### 1. About Page (`/about`) — Entirely Gray / Blank
The about page renders a full-screen gray rectangle with no visible content. The page content exists but is invisible.
- Open `src/app/(marketing)/about/page.tsx`
- The page likely has a component that uses `motion` with `opacity: 0` initial state and no trigger, OR the page background is dark with dark text
- **Fix:** Ensure all text on dark backgrounds is `text-white` or `text-white/80`. Check every `<motion.div>` has `animate={{ opacity: 1 }}` paired with `initial={{ opacity: 0 }}`. Add `viewport={{ once: true }}` to any `whileInView` animations. If the page background is `bg-dark` or `bg-[#1A1A1A]`, all text must be `text-white`.
- If the about page has no content built yet, build it now using this structure:
```tsx
// src/app/(marketing)/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Faith | Faith The Organizer',
  description: 'Meet Faith — Nairobi\'s premier professional home and office organizer. 7 years transforming spaces across Nairobi.',
}

export default function AboutPage() {
  return (
    <main className="bg-dark">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/about/faith-hero.jpg" alt="Faith The Organizer" fill className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <p className="section-label text-white/40 mb-4">About</p>
          <h1 className="text-white">
            <span className="head-sans text-5xl lg:text-7xl block">Meet Faith</span>
            <span className="head-serif italic text-5xl lg:text-7xl text-accent/90 block">The Organizer</span>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label text-white/40 mb-6">Our Story</p>
            <p className="text-white text-2xl lg:text-3xl font-medium leading-relaxed mb-6">
              "I started Faith The Organizer because I believe every person deserves to come home to a space that feels calm — not chaotic."
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-4">
              Since 2018, we've transformed over 500 homes and offices across Nairobi — from Westlands to Karen, Kileleshwa to the CBD.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              Our approach is simple: listen first, organize second. Every space is different. Every family is different. We build systems that actually stick.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] img-zoom">
            <Image src="/images/about/faith-working.jpg" alt="Faith organizing a home" fill className="object-cover" sizes="50vw" />
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="border-t border-white/6 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Homes Organized' },
            { value: '7 yrs', label: 'In Business' },
            { value: '4.9★', label: 'Client Rating' },
            { value: '11', label: 'Services Offered' },
          ].map(s => (
            <div key={s.label}>
              <p className="head-sans text-4xl text-white mb-1">{s.value}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
```

---

### 2. Contact Page (`/contact`) — Completely Blank White Page
The contact page loads (title shows "Contact | Faith The Organizer") but renders nothing — just a white page. The content is either invisible or throwing a silent error.
- Open `src/app/(marketing)/contact/page.tsx` and `src/app/(marketing)/contact/layout.tsx`
- Check for any `"use client"` component throwing an unhandled error that silently swallows content
- Check for missing `'use client'` on components using hooks
- **Fix:** Build/rebuild the contact page:
```tsx
// src/app/(marketing)/contact/page.tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactFormSchema, type ContactFormValues } from '@/lib/validations'
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
  })

  async function onSubmit(data: ContactFormValues) {
    setLoading(true)
    try {
      await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28">
        <div className="mb-14">
          <p className="section-label text-white/40 mb-4">Contact</p>
          <h1 className="text-white">
            <span className="head-sans text-5xl lg:text-6xl block">Get in</span>
            <span className="head-serif italic text-5xl lg:text-6xl text-accent/90 block">Touch</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: contact info */}
          <div className="flex flex-col gap-6">
            {[
              { icon: Phone, label: 'Phone / WhatsApp', value: COMPANY.phone, href: `tel:${COMPANY.phone}` },
              { icon: Mail, label: 'Email', value: COMPANY.email, href: `mailto:${COMPANY.email}` },
              { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya', href: '#' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/4 border border-white/8 hover:border-white/15 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white font-medium group-hover:text-accent/90 transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
            <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 transition-colors">
              <MessageSquare size={18} className="text-[#25D366]" />
              <span className="text-[#25D366] font-semibold">WhatsApp — Fastest Response</span>
            </a>
          </div>

          {/* Right: form */}
          {submitted ? (
            <div className="flex items-center justify-center rounded-3xl bg-white/4 border border-white/8 p-12">
              <div className="text-center">
                <p className="text-4xl mb-4">✓</p>
                <p className="text-white font-semibold text-lg mb-2">Message sent!</p>
                <p className="text-white/50 text-sm">Faith will get back to you within 24 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {[
                { name: 'name' as const, label: 'Your Name', type: 'text', placeholder: 'Jane Wanjiku' },
                { name: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
                { name: 'phone' as const, label: 'Phone / WhatsApp', type: 'tel', placeholder: '+254 7XX XXX XXX' },
                { name: 'subject' as const, label: 'Subject', type: 'text', placeholder: 'Home organizing inquiry' },
              ].map(field => (
                <div key={field.name}>
                  <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">{field.label}</label>
                  <input {...register(field.name)} type={field.type} placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm" />
                  {errors[field.name] && <p className="text-danger text-xs mt-1">{errors[field.name]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Message</label>
                <textarea {...register('message')} rows={4} placeholder="Tell us about your space and what you need..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none" />
                {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-colors">
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
```

---

### 3. Services Hub Page (`/services`) — Blank Hero, Wrong Background
The services page has a large blank white/light area at the top where the hero should be. The "SERVICES" label text is barely visible (faint on white). The service cards grid below renders on a white/light gray background instead of dark.

**Fix `src/app/services/page.tsx`:**
- Set the page root to `<main className="bg-dark">`
- The hero/header section must have `bg-dark` and all text must be `text-white`
- The faint text in the hero is likely `text-dark/40` on a dark background — fix to `text-white/40`
- Service cards: wrap the grid in `<section className="bg-dark py-20">` and ensure card backgrounds use `bg-white/4 border border-white/8 rounded-3xl` pattern

**Fix `src/app/services/components/ServicesHero.tsx` (or wherever the hero lives):**
```tsx
<section className="bg-dark pt-28 pb-20">
  <div className="max-w-7xl mx-auto px-4 lg:px-8">
    <p className="section-label text-white/40 mb-4">Services</p>
    <h1 className="mb-6">
      <span className="head-sans text-5xl lg:text-7xl text-white block">Everything you need</span>
      <span className="head-serif italic text-5xl lg:text-7xl text-accent/90 block">for a tidy space.</span>
    </h1>
    <p className="text-white/50 text-lg max-w-xl">
      Professional organizing services for homes and offices across Nairobi. Starting from KSh 2,500.
    </p>
  </div>
</section>
```

**Fix service cards on the grid — each card:**
```tsx
<Link href={`/services/${service.slug}`}
  className="group relative bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 transition-all duration-300">
  <div className="relative h-52 overflow-hidden img-zoom">
    <Image src={service.image ?? '/images/services/default.jpg'} alt={service.title} fill className="object-cover" sizes="400px" />
    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
    <span className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-sm border border-white/15 text-white text-xs font-mono px-2.5 py-1 rounded-full">
      From {formatPrice(service.priceFrom)}
    </span>
  </div>
  <div className="p-5">
    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1.5">{service.category ?? 'Organizing Service'}</p>
    <p className="text-white font-semibold text-sm group-hover:text-accent/90 transition-colors">{service.title}</p>
  </div>
</Link>
```

---

## 🟡 SIGNIFICANT — Homepage Issues

### 4. Stats Section — Giant Empty Gap
Between the service pill tags section and the stats grid (`500+`, `7 yrs`, `4.9★`), there is approximately 350–400px of empty dark space. This is a padding/margin bug.

**Fix `src/components/sections/StatsSection.tsx` or wherever this is rendered:**
- Remove any `py-48`, `py-40`, `mt-40`, or similar excessive spacing classes
- The stats section should be `py-16 md:py-20` max
- Check if there is a `min-h-[600px]` or similar on a wrapper — remove it
- Also check the **services section above** — the service pill tags are wrapping onto too many lines because the left column `lg:max-w-xs` container is too narrow. Change the pill container to `flex flex-wrap gap-2` and ensure pills are compact `text-xs px-3 py-1.5`

### 5. Hero Section — Wrong Image + Header Mismatch
The hero shows a blurry image of a man with a painting brush — not an organized home. 

**Fix `src/components/sections/HeroSection.tsx`:**
- The `src` for the hero background `<Image>` is likely pointing to a missing or wrong file. Change to a working Unsplash URL as placeholder:
```tsx
src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
```
(This is a clean, organized kitchen — appropriate placeholder)

**Header transparency fix:**
The header is white/opaque and sits on top of the dark hero creating a sharp white bar. The header should be transparent over the hero and only become solid white on scroll — OR since the whole site is dark, make the main nav bar dark too:

**Fix `src/components/layout/Header.tsx` — Row 2 nav background:**
```tsx
// Change from:
className="bg-white border-b border-dark/8 relative"
// To:
className="bg-dark/95 backdrop-blur-md border-b border-white/8 relative"
```
And update all nav link colors accordingly:
- Active link: `text-white font-semibold` (not `text-dark font-semibold`)
- Inactive link: `text-white/60 hover:text-white` (not `text-dark/70`)
- Logo text: `text-white` (not `text-primary` — keep the red F badge, just make name text white)
- Search/heart/cart icons: `text-white/60 hover:text-white hover:bg-white/8`
- The `Book Now` CTA pill stays dark-on-white: `bg-white text-dark hover:bg-white/90`

### 6. Service Section Heading — Awkward Line Break
"Everything you need for a tidy space." breaks as:
- Line 1: "Everything"
- Line 2: "you need for a"  
- Line 3: "tidy space."

**Fix `src/components/sections/ServicesStrip.tsx`:**
```tsx
<h2 className="text-white mb-8 leading-tight">
  <span className="head-sans text-4xl lg:text-5xl block">Everything you need</span>
  <span className="head-sans text-4xl lg:text-5xl block">for a</span>
  <span className="head-serif italic text-4xl lg:text-5xl text-accent/90 block">tidy space.</span>
</h2>
```

### 7. Product Cards — Wrong Placeholder Images
Products show random Unsplash photos (coffee cup in blue blur, panda stuffed animal in bathtub, yarn balls). These are clearly wrong placeholder images from `src/lib/mock-products.ts`.

**Fix `src/lib/mock-products.ts`** — update the `images` field for every product to use home organizing relevant Unsplash photos:
```ts
// Kitchen products:
images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80']
// Closet/bedroom:
images: ['https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80']
// Office/desk:
images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80']
// Storage:
images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80']
// Bundles:
images: ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80']
```
Apply relevant images per product category throughout the mock data file.

---

## 🟡 SIGNIFICANT — Secondary Pages

### 8. Book Page (`/book`) — Light Background, Needs Dark Theme
The booking page has a white/light gray background. It should be dark like the rest of the site, but since it's a form, use a slightly softer dark.

**Fix `src/app/book/page.tsx`:**
- Wrap root in `<main className="bg-dark min-h-screen">`
- Left sidebar (step indicator + confidentiality card):
  - Step circles: inactive = `border border-white/20 text-white/30`, active = `bg-primary text-white`
  - Step labels: `text-white/60`, active = `text-white`
  - Confidentiality card: `bg-white/4 border border-white/8 rounded-2xl`
  - Contact info text: `text-white/50`
- Right panel (form card):
  - `bg-white/4 border border-white/8 rounded-3xl p-8`
  - Tab bar (Service / Date / Details / Review): `border-b border-white/8`
  - Active tab: `border-b-2 border-primary text-white`
  - Inactive tab: `text-white/40`
  - Headings: `text-white`
  - Service selection cards: `bg-white/5 border border-white/10 rounded-2xl hover:border-primary/40`
  - Selected card: `border-primary bg-primary/10`
  - Icon containers: `bg-white/8`
  - Service name: `text-white font-medium`
  - Price: `text-white/50 text-xs font-mono`

### 9. Blog Page (`/blog`) — Featured Post Image Missing
The featured blog post card on the left shows a blank/gray image area — the cover image is not loading.

**Fix `src/lib/mock-posts.ts`** — ensure every post has a valid `coverImage` URL:
```ts
coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
```
Use relevant organizing/home photos for each post category.

Also **fix the blog page header** — it currently has "THE ORGANIZED LIFE" in tiny uppercase on a white background and "Organized Living" as a large serif heading. This looks editorial and intentional — keep it, but ensure the page immediately below transitions to `bg-dark` for the post cards.

**Fix the blog page layout background:**
```tsx
// src/app/blog/page.tsx — root wrapper
<main className="bg-dark">
  {/* Editorial header — can stay light/white as a contrast section */}
  <section className="bg-surface py-16 lg:py-24"> ... </section>
  {/* Posts grid — dark */}
  <section className="bg-dark py-16 lg:py-24"> ... </section>
</main>
```

### 10. About Page (`/about`) — See Issue #1 above (build the full page)

---

## 🟡 NAVIGATION — Header Issues

### 11. Header nav bar — light on dark site
As described in issue #5 above, the white nav bar on a dark site creates a jarring contrast. Apply the dark nav treatment globally.

### 12. `section-label` CSS class — not applying on some pages
Some pages show the "SERVICES", "GALLERY" labels as very faint/invisible. This is because `section-label` class uses `opacity: 0.5` which only works if the text color is set.

**Fix in `src/app/globals.css`:**
```css
.section-label {
  font-family: var(--font-inter);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45); /* explicit — don't rely on inherited color */
}
/* On light backgrounds, override: */
.section-label-dark {
  color: rgba(26,26,26,0.40);
}
```

### 13. Page title format — duplicate "Faith The Organizer"
The services page title reads: **"Services | Faith The Organizer | Faith The Organizer"** — the brand name appears twice.

**Fix `src/app/layout.tsx`:**
```tsx
export const metadata: Metadata = {
  title: {
    default: 'Faith The Organizer — From Clutter to Order',
    template: '%s | Faith The Organizer',
  },
  // ...
}
```
Then every page's metadata should only include the page name:
```tsx
// services/page.tsx
export const metadata = { title: 'Services' }  // renders as "Services | Faith The Organizer"
// NOT: title: 'Services | Faith The Organizer'
```
Audit and fix every `page.tsx` metadata title that is double-branding.

---

## 🟢 POLISH — Shop Page

### 14. Shop filter sidebar — radio button styling
The radio buttons use the browser default red/primary circle which looks mismatched on dark.

**Fix:** Replace native radio inputs with custom styled ones:
```tsx
<label className="flex items-center gap-3 cursor-pointer group">
  <div className={cn(
    'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors',
    isSelected ? 'border-primary bg-primary' : 'border-white/20 group-hover:border-white/40'
  )}>
    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
  </div>
  <span className={cn('text-sm', isSelected ? 'text-white' : 'text-white/50')}>{label}</span>
</label>
```

### 15. Shop page category tabs — active state
The "All" tab shows `bg-dark text-white border-dark` which is hard to distinguish from unselected tabs on a dark background.

**Fix active tab state:**
```tsx
// Active:
className="bg-white text-dark border-white font-semibold"
// Inactive:
className="border-white/15 text-white/50 hover:border-white/30 hover:text-white"
```

---

## 🟢 POLISH — Homepage

### 16. Testimonials section — review card border
On the light side of the testimonial split, review cards have `border-dark/5` which is nearly invisible. 
**Fix:** `border border-dark/10 shadow-sm` for slightly more definition.

### 17. Gallery section — rotated caption text
The "LIVING ROOM REVEAL" rotated caption in the gallery section is barely readable against the image.
**Fix:** Add a thin text shadow: `style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}`

### 18. Blog section — featured post card
The blog featured post card text "10 Rules for Decluttering a Nairobi Home..." is rendering dark-on-dark because the image behind it is dark and the text gradient overlay needs strengthening.
**Fix the overlay gradient:**
```tsx
// From:
<div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
// To:
<div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
```

### 19. Footer — social icons need more presence
The Instagram icon sits inside a small circle with a thin white border that looks frail on the dark footer.
**Fix:**
```tsx
<a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer"
  className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:bg-white/15 hover:text-white transition-all">
  <Instagram size={15} />
</a>
```

### 20. WhatsApp floating button — z-index clash
On mobile, the floating WhatsApp button occasionally overlaps the footer copyright text.
**Fix:** Ensure it has `bottom-6` and `z-50`. On desktop, add `md:bottom-8 md:right-8`.

---

## 🟢 POLISH — Service Detail Pages

### 21. Individual service pages (`/services/[slug]`) — light background
These pages still use the old light design. Apply `bg-dark` to the root `<main>` and convert all section backgrounds and text colors to match the dark theme established on the homepage.

Key fixes for each section within service detail pages:
- Hero: `bg-dark` with image + gradient overlay, `text-white`
- "What's Included" list items: `text-white/70` with `text-primary` check icons
- "How It Works" steps: dark cards `bg-white/4 border border-white/8 rounded-2xl`
- Pricing section: dark card with `bg-white/4` 
- Testimonials: white cards on dark background
- Related services: same dark card pattern as above
- Booking CTA: match the `FooterCTABand` dark style

---

## Implementation Order
Fix in this sequence for maximum impact:
1. Header dark theme (#5, #11) — affects every page
2. `section-label` CSS fix (#12) — affects every page  
3. Contact page (#2) — currently 100% blank
4. About page (#1) — currently 100% blank
5. Services hub page (#3) — broken hero
6. Stats gap (#4) — jarring on homepage
7. Hero image (#5) — wrong photo
8. Product images (#7) — wrong stock photos
9. Book page dark theme (#8)
10. Blog post images (#9)
11. All polish items (#14–#21)
