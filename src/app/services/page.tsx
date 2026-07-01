import type { Metadata } from 'next'
import Accordion, { type AccordionItem } from '@/components/ui/Accordion'
import FooterCTABand from '@/components/sections/FooterCTABand'
import ServicesHero from './_components/ServicesHero'
import ServicesRoomGrid from './_components/ServicesRoomGrid'
import FeaturedService from './_components/FeaturedService'
import ServicesTrust from './_components/ServicesTrust'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore all organizing services offered by Faith The Organizer in Nairobi — home decluttering, office organizing, moving house, home staging and more. From Clutter to Order.',
}

const FAQ_ITEMS: AccordionItem[] = [
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
    question: 'What areas of Nairobi do you cover?',
    answer:
      'We cover all areas within Nairobi county and surrounding suburbs — including Karen, Westlands, Runda, Kileleshwa, Lavington, Eastlands, and more. Contact us for travel rates outside the ring road.',
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
    <main className="bg-dark">

      {/* 1. HERO */}
      <ServicesHero />

      {/* 2. ROOM-BASED GRID */}
      <ServicesRoomGrid />

      {/* 3. FEATURED SERVICE STRIP */}
      <FeaturedService />

      {/* 4. TRUST SECTION */}
      <ServicesTrust />

      {/* 5. FAQ */}
      <section className="py-16 md:py-24 bg-dark border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-white text-3xl md:text-4xl mb-4">
              <span className="head-sans">Frequently Asked </span>
              <span className="head-serif italic text-accent/90">Questions</span>
            </h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Everything you need to know before booking your session.
            </p>
          </div>
          <div className="bg-white/4 border border-white/8 rounded-3xl px-6 sm:px-10 py-2">
            <Accordion items={FAQ_ITEMS} variant="dark" />
          </div>
        </div>
      </section>

      {/* 6. FOOTER CTA */}
      <FooterCTABand />

    </main>
  )
}
