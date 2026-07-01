import type { Metadata } from 'next'
import Image from 'next/image'
import { Check } from 'lucide-react'
import FooterCTABand from '@/components/sections/FooterCTABand'
import { IMG } from '@/lib/image-placeholders'
import { COMPANY_MISSION, WHY_CHOOSE_US } from '@/lib/service-content'
import { SERVICES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Faith The Organizer — professional home, workplace, training and staffing solutions in Nairobi.',
}

export default function AboutPage() {
  return (
    <main className="bg-dark">
      <section className="relative min-h-[60vh] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={IMG.faithPortrait}
            alt="Faith The Organizer"
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <p className="section-label mb-4">About Us</p>
          <h1 className="text-white">
            <span className="head-sans text-5xl lg:text-7xl block">Faith The Organizer</span>
            <span className="head-serif italic text-5xl lg:text-7xl text-accent/90 block">{COMPANY_MISSION.tagline}</span>
          </h1>
        </div>
      </section>

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-6">Our Story</p>
            {COMPANY_MISSION.about.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-white/60 text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] img-zoom">
            <Image
              src={IMG.gallery.testimonial1}
              alt="Faith consulting with a client"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-white text-3xl mb-8">
            <span className="head-sans">{WHY_CHOOSE_US.title}</span>
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {WHY_CHOOSE_US.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/75 text-sm">
                <Check size={18} className="text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-white/50 text-base leading-relaxed max-w-3xl">{WHY_CHOOSE_US.closing}</p>
        </div>
      </section>

      <section className="border-t border-white/6 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Spaces Transformed' },
            { value: '9', label: 'Service Categories' },
            { value: '4.9★', label: 'Client Rating' },
            { value: String(SERVICES.filter((s) => !s.siteVisit).length), label: 'Core Services' },
          ].map((s) => (
            <div key={s.label}>
              <p className="head-sans text-4xl text-white mb-1">{s.value}</p>
              <p className="text-white/40 text-xs uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <FooterCTABand />
    </main>
  )
}
