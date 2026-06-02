import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CatalogServiceFull } from '@/lib/constants'
import { SITE_VISIT } from '@/lib/constants'
import { getServiceIcon } from '@/lib/service-icons'
import { formatPrice } from '@/lib/utils'

export default function ServiceDetailHero({ service }: { service: CatalogServiceFull }) {
  const Icon = getServiceIcon(service.icon)
  const priceLabel = service.customQuote
    ? 'Custom quote after consultation'
    : `From ${formatPrice(service.priceFrom)}`

  return (
    <section className="bg-cream border-b border-dark/8">
      <div className="section-container py-10 md:py-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-dark/45 text-sm mb-8">
          <Link href="/" className="hover:text-dark transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="hover:text-dark transition-colors">Services</Link>
          <span aria-hidden="true">/</span>
          <span className="text-dark/70">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface border border-dark/8 px-3 py-1 text-xs font-medium text-dark/55">
              <Icon size={14} aria-hidden="true" />
              {service.categoryLabel} · {SITE_VISIT.serviceArea}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-dark leading-tight">
              {service.title}
            </h1>
            <p className="text-lg text-dark/65 leading-relaxed">{service.description}</p>
            <p className="font-mono text-xl font-semibold text-primary">{priceLabel}</p>
            <p className="text-sm text-dark/55">
              Site visit {formatPrice(SITE_VISIT.feeKsh)} · {SITE_VISIT.redeemablePercent}% redeemable · mainly{' '}
              {SITE_VISIT.primaryDays}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`/book?service=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-7 min-h-[48px] rounded-button hover:bg-danger transition-colors"
              >
                Book Site Visit
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href={`/services/${service.slug}#faq`}
                className="inline-flex items-center justify-center border-2 border-dark/15 bg-white text-dark font-medium text-sm px-7 min-h-[48px] rounded-button hover:border-dark/30 transition-colors"
              >
                Read FAQ
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-card overflow-hidden order-1 lg:order-2 bg-muted">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
