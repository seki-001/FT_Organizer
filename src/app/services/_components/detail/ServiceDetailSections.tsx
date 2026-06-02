import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, Clock, Users } from 'lucide-react'
import Accordion from '@/components/ui/Accordion'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import type { CatalogServiceFull } from '@/lib/constants'
import {
  BOOKING_PROCESS_STEPS,
  SERVICES,
  SITE_VISIT,
  SERVICE_GALLERY,
  DEFAULT_GALLERY,
} from '@/lib/constants'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { getServiceDetail } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

export function ServiceWhoIsFor({ service }: { service: CatalogServiceFull }) {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container max-w-4xl">
        <SectionHeading
          eyebrow="Who this is for"
          title="Is this service right for you?"
          subtitle="We tailor every engagement — these are the clients we serve most often."
        />
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.whoIsFor.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 card-surface border border-dark/8 p-4 text-sm text-dark/70 leading-relaxed"
            >
              <Users size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ServiceIncluded({ service }: { service: CatalogServiceFull }) {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionHeading
          eyebrow="What's included"
          title="What we deliver"
          align="center"
          className="mb-10"
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {service.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-dark/70">
              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        {service.relocationScope && service.relocationScope.length > 0 ? (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl text-dark text-center mb-6">
              Relocation & transition scope
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.relocationScope.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-dark/65 bg-cream rounded-lg px-4 py-3"
                >
                  <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function ServiceProcess({ service }: { service: CatalogServiceFull }) {
  return (
    <section className="section-padding bg-cream">
      <div className="section-container">
        <SectionHeading
          eyebrow="Process"
          title="How it works"
          subtitle={`Your ${service.title.toLowerCase()} journey with Faith The Organizer.`}
          align="center"
          className="mb-12"
        />
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BOOKING_PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3 text-center md:text-left">
              <span className="font-mono text-sm font-bold text-primary">0{index + 1}</span>
              <h3 className="font-display text-lg font-semibold text-dark">{step.title}</h3>
              <p className="text-sm text-dark/60 leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function ServiceTimeline({ service }: { service: CatalogServiceFull }) {
  return (
    <section className="section-padding bg-surface border-y border-dark/6">
      <div className="section-container max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Timeline</p>
        <h2 className="font-display text-2xl md:text-3xl text-dark font-semibold mb-4">
          What to expect
        </h2>
        <p className="flex items-center justify-center gap-2 text-dark/65 leading-relaxed">
          <Clock size={18} className="text-primary shrink-0" aria-hidden="true" />
          <span>
            <strong className="text-dark">Duration:</strong> {service.duration}
            <span className="mx-2 text-dark/25" aria-hidden="true">·</span>
            <strong className="text-dark">Typical flow:</strong> {service.timeline}
          </span>
        </p>
      </div>
    </section>
  )
}

export function ServiceGallery({ service }: { service: CatalogServiceFull }) {
  const gallery = SERVICE_GALLERY[service.slug] ?? DEFAULT_GALLERY

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <SectionHeading
          eyebrow="Results"
          title="Before & after"
          subtitle="Sample project imagery — outcomes vary by scope and space."
          align="center"
          className="mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-muted">
            <Image src={gallery.before} alt={`Before — ${service.title}`} fill className="object-cover" sizes="50vw" />
            <span className="absolute bottom-3 left-3 bg-dark/70 text-white text-xs px-2 py-1 rounded">Before</span>
          </div>
          <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-muted">
            <Image src={gallery.after} alt={`After — ${service.title}`} fill className="object-cover" sizes="50vw" />
            <span className="absolute bottom-3 left-3 bg-dark/70 text-white text-xs px-2 py-1 rounded">After</span>
          </div>
        </div>
        <p className="text-center mt-6">
          <Link href="/portfolio" className="text-sm font-semibold text-primary hover:underline">
            View portfolio →
          </Link>
        </p>
      </div>
    </section>
  )
}

export function ServicePricing({ service }: { service: CatalogServiceFull }) {
  return (
    <section className="section-padding bg-cream">
      <div className="section-container max-w-2xl mx-auto">
        <div className="card-surface border border-dark/8 p-8 md:p-10 text-center flex flex-col gap-5">
          <h2 className="font-display text-3xl text-dark font-semibold">Pricing</h2>
          {service.customQuote ? (
            <p className="font-display text-2xl text-primary font-semibold">Custom quote</p>
          ) : (
            <>
              <p className="text-dark/50 text-sm uppercase tracking-widest">Starting from</p>
              <p className="font-mono text-4xl font-bold text-primary">{formatPrice(service.priceFrom)}</p>
            </>
          )}
          <p className="text-sm text-dark/60 leading-relaxed">
            Final investment depends on scope, location across {SITE_VISIT.serviceArea}, and condition of
            the space. Site visit fee: {formatPrice(SITE_VISIT.feeKsh)}. {SITE_VISIT.redeemableNote}
          </p>
          <Link
            href={`/book?service=${service.slug}`}
            className="inline-flex items-center justify-center bg-primary text-white font-semibold text-sm px-8 min-h-[48px] rounded-button hover:bg-danger transition-colors"
          >
            Book Site Visit
          </Link>
        </div>
      </div>
    </section>
  )
}

export function ServiceRelatedProducts({ service }: { service: CatalogServiceFull }) {
  const slugs = service.relatedProductSlugs ?? []
  const products = slugs
    .map((slug) => MOCK_PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean)

  if (products.length === 0) return null

  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading
          eyebrow="Shop"
          title="Related organizing products"
          subtitle="Optional add-ons that support this service — not required to book."
          className="mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product!.slug}
              href={`/shop/${product!.slug}`}
              className="card-surface border border-dark/8 overflow-hidden hover:shadow-card-hover transition-shadow group"
            >
              <div className="relative h-40 bg-muted">
                <Image
                  src={product!.images[0]}
                  alt={product!.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="33vw"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-dark text-sm leading-snug">{product!.name}</p>
                <p className="font-mono text-primary text-sm mt-2">
                  {formatPrice(product!.salePrice ?? product!.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link href="/shop" className="text-sm font-semibold text-primary hover:underline">
            Browse full shop →
          </Link>
        </p>
      </div>
    </section>
  )
}

export function ServiceFaq({ service }: { service: CatalogServiceFull }) {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="section-container max-w-3xl mx-auto">
        <SectionHeading title="FAQ" subtitle={`Common questions about ${service.title}.`} align="center" className="mb-8" />
        <div className="card-surface border border-dark/8 px-6 sm:px-8">
          <Accordion items={service.faq} />
        </div>
      </div>
    </section>
  )
}

export function ServiceRelatedServices({ service }: { service: CatalogServiceFull }) {
  const related = SERVICES.filter((s) => s.groupId === service.groupId && s.slug !== service.slug)
    .slice(0, 3)
    .map((s) => getServiceDetail(s.slug)!)

  if (related.length === 0) return null

  return (
    <section className="section-padding bg-muted">
      <div className="section-container">
        <SectionHeading
          title="Related services"
          subtitle="Other services in this category you may need."
          align="center"
          className="mb-10"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((s) => (
            <ServiceCard
              key={s.slug}
              slug={s.slug}
              title={s.title}
              icon={s.icon}
              priceFrom={s.priceFrom}
              description={s.shortBenefit}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
