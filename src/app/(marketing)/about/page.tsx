import type { Metadata } from 'next'
import Image from 'next/image'
import FooterCTABand from '@/components/sections/FooterCTABand'
import { IMG } from '@/lib/image-placeholders'

export const metadata: Metadata = {
  title: 'About Faith',
  description:
    "Meet Faith — Nairobi's premier professional home and office organizer. 7 years transforming spaces across Nairobi.",
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
          <p className="section-label mb-4">About</p>
          <h1 className="text-white">
            <span className="head-sans text-5xl lg:text-7xl block">Meet Faith</span>
            <span className="head-serif italic text-5xl lg:text-7xl text-accent/90 block">The Organizer</span>
          </h1>
        </div>
      </section>

      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-6">Our Story</p>
            <p className="text-white text-2xl lg:text-3xl font-medium leading-relaxed mb-6">
              &ldquo;I started Faith The Organizer because I believe every person deserves to come home to a space that feels calm — not chaotic.&rdquo;
            </p>
            <p className="text-white/60 text-base leading-relaxed mb-4">
              Since 2018, we&apos;ve transformed over 500 homes and offices across Nairobi — from Westlands to Karen, Kileleshwa to the CBD.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              Our approach is simple: listen first, organize second. Every space is different. Every family is different. We build systems that actually stick.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/5] img-zoom">
            <Image
              src={IMG.faithPortrait}
              alt="Faith organizing a home"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Homes Organized' },
            { value: '7 yrs', label: 'In Business' },
            { value: '4.9★', label: 'Client Rating' },
            { value: '11', label: 'Services Offered' },
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
