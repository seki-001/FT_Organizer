import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  Trash2, Home, Truck, Archive, Package, FileText,
  Video, MessageSquare, Sparkles, Layout, Briefcase,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import ServiceCard from '@/components/ui/ServiceCard'
import FooterCTABand from '@/components/sections/FooterCTABand'
import { IMG } from '@/lib/image-placeholders'
import type { Testimonial } from '@/lib/types'

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Trash2, Home, Truck, Archive, Package, FileText,
  Video, MessageSquare, Sparkles, Layout, Briefcase,
}

// ─── Shared placeholder data ──────────────────────────────────────────────────

const PLACEHOLDER_INCLUDES = [
  'Initial walkthrough and space assessment',
  'Hands-on decluttering with you or on your behalf',
  'Custom organising systems designed for your space',
  'Product recommendations for storage solutions',
  'Post-session tidy-up and disposal coordination',
]

const PLACEHOLDER_STEPS = [
  {
    title: 'Book & Consultation',
    description:
      'Submit your booking request. We\'ll contact you within 24 hours to discuss your space, timeline and specific needs.',
  },
  {
    title: 'On-Site Assessment',
    description:
      'Faith or a team member visits your space to assess the scope of work and provide a confirmed quote.',
  },
  {
    title: 'The Transformation',
    description:
      'We get to work — sorting, decluttering and installing custom organising systems while you relax.',
  },
  {
    title: 'Handover & Guidance',
    description:
      'We walk you through every new system so you can maintain the order effortlessly long after we leave.',
  },
]

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
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) return { title: 'Service Not Found' }

  return {
    title: service.title,
    description: `Professional ${service.title.toLowerCase()} service in Nairobi by Faith The Organizer. Starting from ${formatPrice(service.priceFrom)}. From Clutter to Order.`,
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
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  const Icon = ICON_MAP[service.icon] ?? Briefcase
  const relatedServices = SERVICES.filter((s) => s.slug !== slug).slice(0, 3)

  return (
    <>
      <main className="bg-dark">

        {/* 1. SERVICE HERO ───────────────────────────────────────────────── */}
        <section className="bg-dark text-white py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/40 text-sm mb-10">
              <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/services" className="hover:text-white transition-colors duration-200">Services</Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/70">{service.title}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-12">
              <div className="flex flex-col gap-4 flex-1">
                <p className="section-label text-white/40">Organizing Service</p>
                <h1 className="text-white leading-tight">
                  <span className="head-sans text-4xl md:text-5xl block">{service.title.split(' ').slice(0, -1).join(' ') || service.title}</span>
                  <span className="head-serif italic text-4xl md:text-5xl text-accent/90 block">
                    {service.title.split(' ').slice(-1)[0]}
                  </span>
                </h1>
                <p className="font-mono text-xl text-white/60">
                  From {formatPrice(service.priceFrom)}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-white text-dark font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors duration-200 min-h-[44px]"
                  >
                    Book This Service
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center border border-white/15 text-white hover:border-white/30 hover:bg-white/5 font-medium px-6 py-3 rounded-full transition-all duration-200 min-h-[44px]"
                  >
                    Get a Free Quote
                  </Link>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-white/10">
                <Icon size={44} className="text-white" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHAT'S INCLUDED ────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
              <div>
                <h2 className="text-white text-3xl md:text-4xl mb-4">
                  <span className="head-sans">What&apos;s </span>
                  <span className="head-serif italic text-accent/90">Included</span>
                </h2>
                <p className="text-white/60 leading-relaxed">
                  Every {service.title.toLowerCase()} session is tailored to your specific
                  space and needs. Here is what you can expect when you book with us.
                </p>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/4 border border-white/8 rounded-3xl p-6">
                {PLACEHOLDER_INCLUDES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-accent flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS ───────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-white text-3xl md:text-4xl mb-4">
                <span className="head-sans">How It </span>
                <span className="head-serif italic text-accent/90">Works</span>
              </h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
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

              {PLACEHOLDER_STEPS.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center text-center gap-4 bg-white/4 border border-white/8 rounded-3xl p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white font-bold text-lg flex-shrink-0 relative z-10">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-white text-base">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. BEFORE & AFTER GALLERY ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-72 img-zoom group">
                <Image src={IMG.gallery.transform1} alt="Home transformation" fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <p className="caption-rotate text-white/60 text-xs tracking-widest uppercase">Living Room Reveal</p>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-72 img-zoom">
                <Image src={IMG.gallery.transform2} alt="Organized bedroom" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-xs font-semibold">Bedroom & Closet</p>
                  <p className="text-white/50 text-[10px] italic font-display">Space Planning</p>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
                <Image src={IMG.gallery.transform3} alt="Organized kitchen" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-xs font-semibold">Kitchen</p>
                  <p className="text-white/40 text-[10px] italic font-display">Decluttering</p>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
                <Image src={IMG.gallery.transform4} alt="Organized office" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-xs font-semibold">Home Office</p>
                  <p className="text-white/40 text-[10px] italic font-display">Organization</p>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden h-52 img-zoom">
                <Image src={IMG.gallery.transform5} alt="Storage solutions" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-xs font-semibold">Storage & Shelving</p>
                  <p className="text-white/40 text-[10px] italic font-display">Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PRICING ────────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/4 border border-white/8 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6">
              <h2 className="text-white text-3xl">
                <span className="head-sans">Investment</span>
              </h2>

              <div>
                <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Starting from</p>
                <p className="font-mono text-5xl font-bold text-accent">
                  {formatPrice(service.priceFrom)}
                </p>
              </div>

              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                Final price depends on space size, condition, and location.
                Get a free quote with no obligation.
              </p>

              <ul className="flex flex-col gap-3 text-left w-full max-w-xs">
                {[
                  'Size and number of rooms',
                  'Level of clutter and current condition',
                  'Your location within Nairobi',
                ].map((factor) => (
                  <li key={factor} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" aria-hidden="true" />
                    {factor}
                  </li>
                ))}
              </ul>

              <Link
                href={`/book?service=${service.slug}`}
                className="inline-flex items-center bg-white text-dark font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors duration-200 min-h-[44px]"
              >
                Book a Free Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* 6. TESTIMONIALS ───────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-white text-3xl md:text-4xl mb-4">
                <span className="head-sans">What Our Clients </span>
                <span className="head-serif italic text-accent/90">Say</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLACEHOLDER_TESTIMONIALS.map((t) => (
                <article key={t.id} className="bg-white/4 border border-white/8 rounded-3xl p-6 flex flex-col gap-4">
                  <StarRating rating={t.rating} />
                  <blockquote className="text-white/70 text-sm leading-relaxed flex-1 italic font-display">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <footer className="flex items-center gap-3 pt-2 border-t border-white/8">
                    <Initials name={t.name} />
                    <div>
                      <p className="font-semibold text-white text-sm">{t.name}</p>
                      <p className="text-white/50 text-xs">{t.location}</p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7. RELATED SERVICES ───────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-dark border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-white text-3xl md:text-4xl mb-4">
                <span className="head-sans">You Might Also </span>
                <span className="head-serif italic text-accent/90">Need</span>
              </h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">
                Explore other organizing services that pair well with {service.title.toLowerCase()}.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <FooterCTABand />

      </main>

      {/* 8. STICKY MOBILE BOOKING BAR ──────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-4 bg-dark border-t border-white/10 shadow-lg">
        <Link
          href={`/book?service=${service.slug}`}
          className="flex items-center justify-center w-full bg-white text-dark font-semibold py-3 rounded-full transition-colors duration-200 min-h-[44px] gap-2"
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
