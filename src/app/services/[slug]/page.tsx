import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import {
  SERVICES,
  SITE_VISIT,
  BOOKING_PROCESS_STEPS,
  SERVICE_GALLERY,
  DEFAULT_GALLERY,
  resolveServiceSlug,
  getServiceBySlug,
} from '@/lib/constants'
import { getServiceIcon } from '@/lib/service-icons'
import { formatPrice } from '@/lib/utils'
import ServiceCard from '@/components/ui/ServiceCard'
import FooterCTABand from '@/components/sections/FooterCTABand'
import type { Testimonial } from '@/lib/types'


const PLACEHOLDER_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Fransisca Wambui',
    location: 'Westlands, Nairobi',
    rating: 5,
    text: 'Incredible service! Faith and her team were punctual, courteous, and so thorough. My home feels like a completely different space. Every drawer, shelf and cabinet is now perfectly organised.',
  },
  {
    id: 't2',
    name: 'Gladys A',
    location: 'Runda, Nairobi',
    rating: 5,
    text: 'Amazing, quick and thorough. Faith understood exactly what I needed and delivered beyond my expectations. The systems she put in place are so intuitive — everything has a home now.',
  },
]

// ─── generateStaticParams ────────────────────────────────────────────────────

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return { title: 'Service Not Found | Faith The Organizer' }

  return {
    title: `${service.title} | Faith The Organizer`,
    description: `${service.description} Serving ${SITE_VISIT.serviceArea}. Site visits from ${formatPrice(SITE_VISIT.feeKsh)}.`,
  }
}

// ─── Sub-components (server) ─────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-accent' : 'text-dark/20'} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  )
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ')
  const initials =
    parts.length >= 2 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0][0]
  return (
    <div className="w-10 h-10 rounded-full bg-muted text-dark/50 font-semibold text-sm flex items-center justify-center flex-shrink-0 uppercase">
      {initials}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolvedSlug = resolveServiceSlug(slug)
  if (resolvedSlug !== slug) {
    redirect(`/services/${resolvedSlug}`)
  }

  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const Icon = getServiceIcon(service.icon)
  const relatedServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3)
  const gallery = SERVICE_GALLERY[service.slug] ?? DEFAULT_GALLERY

  return (
    <>
      <main>

        {/* 1. SERVICE HERO ───────────────────────────────────────────────── */}
        <section className="bg-dark text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/40 text-sm mb-10">
              <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/services" className="hover:text-white transition-colors duration-200">Services</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">{service.title}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              {/* Icon circle */}
              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-white/10">
                <Icon size={44} className="text-white" aria-hidden="true" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-4">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
                  {service.title}
                </h1>
                <p className="text-white/75 text-base leading-relaxed max-w-2xl">
                  {service.description}
                </p>
                <p className="font-mono text-2xl text-primary font-medium">
                  From {formatPrice(service.priceFrom)}
                </p>
                <p className="text-white/50 text-sm max-w-xl">
                  Site visits across {SITE_VISIT.serviceArea} — {formatPrice(SITE_VISIT.feeKsh)} (
                  {SITE_VISIT.redeemablePercent}% redeemable if retained). Mainly {SITE_VISIT.primaryDays};
                  closed weekends.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center justify-center"
                  >
                    Book This Service
                  </Link>
                  <Link
                    href="/contact"
                    className="border-2 border-white text-white hover:bg-white hover:text-dark font-medium px-6 py-3 rounded-lg transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  >
                    Get a Free Quote
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHAT'S INCLUDED ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
                  What&apos;s Included
                </h2>
                <p className="text-dark/60 leading-relaxed">{service.description}</p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-dark/35 flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-dark/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS ───────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
                How It Works
              </h2>
              <p className="text-dark/60 text-lg max-w-xl mx-auto">
                A simple, stress-free process from first contact to finished space.
              </p>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Dashed connector — desktop only */}
              <div
                className="hidden md:block absolute top-6 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px border-t-2 border-dashed border-dark/12"
                aria-hidden="true"
              />

              {BOOKING_PROCESS_STEPS.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center text-center gap-4">
                  {/* Number circle */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-dark text-white font-bold text-lg flex-shrink-0 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-dark text-base">{step.title}</h3>
                  <p className="text-dark/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. BEFORE & AFTER GALLERY ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
                The Results
              </h2>
              <p className="text-dark/60 text-lg max-w-xl mx-auto">
                Real transformations from real clients. Real photos coming soon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((pair) => (
                <div key={pair} className="flex flex-col sm:flex-row md:flex-col gap-2">
                  {/* Before */}
                  <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={gallery.before}
                      alt={`Before — ${service.title} example ${pair}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 bg-dark/60 text-white text-xs px-2 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  {/* After */}
                  <div className="relative flex-1 aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={gallery.after}
                      alt={`After — ${service.title} example ${pair}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 bg-dark/60 text-white text-xs px-2 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRICING ────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12 text-center flex flex-col items-center gap-6">
              <h2 className="font-display text-3xl text-dark">Investment</h2>

              <div>
                <p className="text-dark/50 text-sm uppercase tracking-widest mb-1">Starting from</p>
                <p className="font-mono text-5xl font-bold text-primary">
                  {formatPrice(service.priceFrom)}
                </p>
              </div>

              <p className="text-dark/60 text-sm leading-relaxed max-w-sm">
                Site visit fee: {formatPrice(SITE_VISIT.feeKsh)}. {SITE_VISIT.redeemableNote} Final
                project pricing depends on scope and location across {SITE_VISIT.serviceArea}.
              </p>

              <ul className="flex flex-col gap-3 text-left w-full max-w-xs">
                {[
                  'Scope, rooms, and condition of the space',
                  `Service area (${SITE_VISIT.serviceArea}) and travel`,
                  'Site visit scheduling — mainly Mondays; weekends closed',
                ].map((factor) => (
                  <li key={factor} className="flex items-start gap-3 text-dark/70 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark/30 flex-shrink-0" aria-hidden="true" />
                    {factor}
                  </li>
                ))}
              </ul>

              <Link
                href={`/book?service=${service.slug}`}
                className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS ───────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
                What Our Clients Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLACEHOLDER_TESTIMONIALS.map((t) => (
                <article key={t.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
                  <StarRating rating={t.rating} />
                  <blockquote className="text-dark/70 text-sm leading-relaxed flex-1">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <footer className="flex items-center gap-3 pt-2 border-t border-dark/5">
                    <Initials name={t.name} />
                    <div>
                      <p className="font-semibold text-dark text-sm">{t.name}</p>
                      <p className="text-dark/50 text-xs">{t.location}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. RELATED SERVICES ───────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
                You Might Also Need
              </h2>
              <p className="text-dark/60 text-lg max-w-xl mx-auto">
                Explore other organizing services that pair well with {service.title.toLowerCase()}.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <ServiceCard
                  key={s.slug}
                  slug={s.slug}
                  title={s.title}
                  icon={s.icon}
                  priceFrom={s.priceFrom}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <FooterCTABand />

      </main>

      {/* 8. STICKY MOBILE BOOKING BAR ──────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-4 bg-white border-t border-dark/10 shadow-lg">
        <Link
          href={`/book?service=${service.slug}`}
          className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors duration-200 min-h-[44px] gap-2"
        >
          Book This Service
          <span className="font-mono text-sm opacity-90">
            — From {formatPrice(service.priceFrom)}
          </span>
        </Link>
      </div>
    </>
  )
}
