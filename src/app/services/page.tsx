import type { Metadata } from 'next'
import Accordion, { type AccordionItem } from '@/components/ui/Accordion'
import FooterCTABand from '@/components/sections/FooterCTABand'
import ServicesHero from './_components/ServicesHero'
import ServicesRoomGrid from './_components/ServicesRoomGrid'
import FeaturedService from './_components/FeaturedService'
import ServicesTrust from './_components/ServicesTrust'

export const metadata: Metadata = {
  title: 'Services | Faith The Organizer',
  description:
    'Nine professional services across East Africa — organizing, storage, cleaning, relocation, home management, events, training, staffing, and curated products. From Clutter to Order.',
}

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'How do site visits work?',
    answer:
      'Site visits are KSh 3,000 and are mainly scheduled on Mondays across East Africa. Saturdays and Sundays are closed. If you proceed with Faith The Organizer, 50% of the site visit fee is redeemable toward your project.',
  },
  {
    question: 'Do you support diaspora clients?',
    answer:
      'Yes. Relocation & Transition Services includes diaspora relocation support — remote planning, coordination, and setup for moves into or within East Africa.',
  },
  {
    question: 'How long does a typical organizing session take?',
    answer:
      'Session length depends on the scope of work. A single room typically takes 3–6 hours, a whole house 1–3 days. After your initial inquiry we provide a time estimate before booking.',
  },
  {
    question: 'Do I need to be home during the service?',
    answer:
      'We recommend being present for the initial walkthrough, but many clients are comfortable leaving us to work independently. We will discuss your preference during the consultation.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We are based in Nairobi and serve clients across East Africa. Contact us to confirm travel for your location outside Nairobi.',
  },
  {
    question: 'Is my privacy protected?',
    answer:
      'Absolutely. Every client signs our confidentiality agreement before work begins. We never photograph your space without permission, and your personal details are never shared.',
  },
  {
    question: 'How do I prepare for my appointment?',
    answer:
      'No preparation is needed — that is our job. If you have specific areas of concern or items you know you want to keep or discard, a quick mental note is all you need. We handle everything else.',
  },
]

export default function ServicesHubPage() {
  return (
    <main>

      {/* 1. HERO */}
      <ServicesHero />

      {/* 2. ROOM-BASED GRID */}
      <ServicesRoomGrid />

      {/* 3. FEATURED SERVICE STRIP */}
      <FeaturedService />

      {/* 4. TRUST SECTION */}
      <ServicesTrust />

      {/* 5. FAQ */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-dark/60 text-lg max-w-xl mx-auto">
              Everything you need to know before booking your session.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm px-6 sm:px-10 py-2">
            <Accordion items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      {/* 6. FOOTER CTA */}
      <FooterCTABand />

    </main>
  )
}
