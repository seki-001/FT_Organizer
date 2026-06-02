import Image from 'next/image'
import Link from 'next/link'
import { Clock, ArrowRight } from 'lucide-react'
import type { CatalogServiceFull } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

interface ServiceHubCardProps {
  service: CatalogServiceFull
}

export default function ServiceHubCard({ service }: ServiceHubCardProps) {
  const priceLabel = service.customQuote
    ? 'Custom quote'
    : `From ${formatPrice(service.priceFrom)}`

  return (
    <article className="card-surface flex flex-col overflow-hidden border border-dark/8 hover:shadow-card-hover transition-shadow duration-200">
      <div className="relative h-44 sm:h-48 bg-muted">
        <Image
          src={service.image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-dark/60">
          {service.categoryLabel}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold text-dark leading-snug">{service.title}</h3>
          <p className="mt-2 text-sm text-dark/60 leading-relaxed line-clamp-2">{service.shortBenefit}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <p className="font-mono font-semibold text-primary">{priceLabel}</p>
          <p className="flex items-center gap-1.5 text-dark/50">
            <Clock size={14} aria-hidden="true" />
            {service.duration}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 border border-dark/15 text-dark text-sm font-medium min-h-[44px] rounded-button hover:border-dark/30 transition-colors"
          >
            View Details
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            href={`/book?service=${service.slug}`}
            className="inline-flex flex-1 items-center justify-center bg-primary text-white text-sm font-semibold min-h-[44px] rounded-button hover:bg-danger transition-colors"
          >
            Book Site Visit
          </Link>
        </div>
      </div>
    </article>
  )
}
