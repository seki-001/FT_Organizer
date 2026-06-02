import type { Metadata } from 'next'
import Link from 'next/link'
import TransformationShowcase from '@/components/sections/TransformationShowcase'
import FooterCTABand from '@/components/sections/FooterCTABand'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Portfolio | Faith The Organizer',
  description: `Before-and-after organizing projects across East Africa — ${COMPANY.tagline}.`,
}

export default function PortfolioPage() {
  return (
    <>
      <section className="bg-surface border-b border-dark/8">
        <div className="section-container py-16 md:py-20">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Our work
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-dark max-w-2xl">
            Portfolio
          </h1>
          <p className="mt-4 max-w-xl text-dark/65 text-lg leading-relaxed">
            Real homes and offices we have transformed across Nairobi and East Africa. Every
            project reflects our calm, premium approach — {COMPANY.tagline.toLowerCase()}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex min-h-[44px] items-center justify-center rounded-button bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-danger transition-colors"
            >
              Book Site Visit
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-button border border-dark/15 bg-white px-6 py-2.5 text-sm font-medium text-dark hover:border-dark/30 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <TransformationShowcase />

      <FooterCTABand />
    </>
  )
}
