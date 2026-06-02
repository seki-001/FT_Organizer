import Link from 'next/link'
import { Calendar, CheckCircle2 } from 'lucide-react'
import { SITE_VISIT } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import SectionHeading from '@/components/ui/SectionHeading'

const DETAILS = [
  `Fee: ${formatPrice(SITE_VISIT.feeKsh)} per site visit`,
  `${SITE_VISIT.redeemablePercent}% redeemable toward your project if you retain Faith The Organizer`,
  `Scheduling: mainly ${SITE_VISIT.primaryDays}`,
  `${SITE_VISIT.closedDays.join(' & ')} closed`,
  `Service area: ${SITE_VISIT.serviceArea}`,
] as const

export default function HomeSiteVisitExplainer() {
  return (
    <section className="section-padding bg-cream">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <SectionHeading
            eyebrow="Site visit"
            title="Start with clarity, not guesswork"
            subtitle="Every project begins with an on-site assessment so we quote accurately and design systems that fit your life."
            align="center"
            className="mb-0"
          />
        </div>

        <div className="max-w-2xl mx-auto card-surface p-8 md:p-10 border border-dark/8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calendar className="text-primary" size={28} aria-hidden="true" />
            <p className="font-mono text-3xl md:text-4xl font-bold text-dark">
              {formatPrice(SITE_VISIT.feeKsh)}
            </p>
          </div>

          <ul className="flex flex-col gap-3 mb-8">
            {DETAILS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-dark/70">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm text-dark/55 text-center leading-relaxed mb-6">{SITE_VISIT.redeemableNote}</p>

          <div className="flex justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-primary text-white font-semibold text-sm px-8 min-h-[48px] rounded-button hover:bg-danger transition-colors"
            >
              Book Site Visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
