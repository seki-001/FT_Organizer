import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { SITE_VISIT } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

export default function ServicesHero() {
  return (
    <section className="bg-cream border-b border-dark/8">
      <div className="section-container py-14 md:py-20 text-center max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          Services · {SITE_VISIT.serviceArea}
        </p>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark leading-[1.08]">
          Organizing & home services across East Africa
        </h1>
        <p className="mt-5 text-lg text-dark/65 leading-relaxed">
          Nine calm, premium services — from decluttering and storage to relocation, events, and
          training. Based in Nairobi; serving clients across the region.
        </p>
        <p className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-dark/55">
          <MapPin size={16} className="text-primary shrink-0" aria-hidden="true" />
          Site visits {formatPrice(SITE_VISIT.feeKsh)} · mainly {SITE_VISIT.primaryDays}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/book"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-8 min-h-[48px] rounded-button hover:bg-danger transition-colors"
          >
            Book Site Visit
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="#organizing-storage"
            className="inline-flex w-full sm:w-auto items-center justify-center border-2 border-dark/15 bg-white text-dark font-medium text-sm px-8 min-h-[48px] rounded-button hover:border-dark/30 transition-colors"
          >
            Browse services
          </a>
        </div>
      </div>
    </section>
  )
}
