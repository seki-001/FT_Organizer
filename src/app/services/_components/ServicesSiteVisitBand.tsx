import Link from 'next/link'
import { SITE_VISIT } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

export default function ServicesSiteVisitBand() {
  return (
    <section className="section-padding bg-cream">
      <div className="section-container">
        <div className="card-surface border border-dark/8 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl text-dark font-semibold">
              Every project starts with a site visit
            </h2>
            <p className="mt-3 text-dark/65 leading-relaxed">
              {formatPrice(SITE_VISIT.feeKsh)} assessment · {SITE_VISIT.redeemablePercent}% redeemable if
              you proceed · mainly {SITE_VISIT.primaryDays} · weekends closed · serving{' '}
              {SITE_VISIT.serviceArea}.
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex shrink-0 items-center justify-center bg-primary text-white font-semibold text-sm px-8 min-h-[48px] rounded-button hover:bg-danger transition-colors"
          >
            Book Site Visit
          </Link>
        </div>
      </div>
    </section>
  )
}
