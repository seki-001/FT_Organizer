import type { Metadata } from 'next'
import Accordion, { type AccordionItem } from '@/components/ui/Accordion'
import CTASection from '@/components/ui/CTASection'
import ServicesHero from './_components/ServicesHero'
import ServicesTrust from './_components/ServicesTrust'
import ServicesCatalog from './_components/ServicesCatalog'
import ServicesSiteVisitBand from './_components/ServicesSiteVisitBand'
import { SITE_VISIT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Services | Faith The Organizer',
  description:
    'Nine professional organizing and home services across East Africa. Grouped by organizing, home management, and relocation. Book a site visit from KSh 3,000.',
}

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'Where do you serve?',
    answer: `Faith The Organizer is based in Nairobi and serves clients across ${SITE_VISIT.serviceArea}. Travel and logistics are confirmed during your site visit.`,
  },
  {
    question: 'How do site visits work?',
    answer: `Site visits are KSh ${SITE_VISIT.feeKsh.toLocaleString()} and mainly on ${SITE_VISIT.primaryDays}. Weekends are closed. ${SITE_VISIT.redeemableNote}`,
  },
  {
    question: 'Do you support diaspora clients?',
    answer:
      'Yes — especially through Relocation & Transition Services: remote planning, coordination, packing, unpacking, and setup.',
  },
  {
    question: 'How do I get a quote?',
    answer:
      'Book a site visit for the service you need. After we assess your space, you receive a written plan and quote — typically within 48 hours.',
  },
  {
    question: 'Is my privacy protected?',
    answer:
      'Absolutely. Confidentiality is standard on every engagement. We do not photograph your space without permission.',
  },
]

export default function ServicesHubPage() {
  return (
    <main className="overflow-x-hidden min-w-0">
      <ServicesHero />
      <ServicesTrust />
      <ServicesCatalog />
      <ServicesSiteVisitBand />
      <section className="section-padding bg-surface">
        <div className="section-container max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-dark text-center mb-4">
            Frequently asked questions
          </h2>
          <p className="text-center text-dark/60 mb-10">
            Service-first answers before you book.
          </p>
          <div className="card-surface border border-dark/8 px-6 sm:px-8">
            <Accordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>
      <CTASection
        variant="cream"
        title="Not sure which service fits?"
        description="Book a site visit and we will recommend the right scope — organizing, relocation, home management, or a combination."
        primaryLabel="Book Site Visit"
        primaryHref="/book"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />
    </main>
  )
}
