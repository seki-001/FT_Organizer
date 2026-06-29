import Image from 'next/image'
import { IMG } from '@/lib/image-placeholders'

export default function AboutTeaser() {
  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden border-t border-dark/8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <p className="section-label-dark mb-8">About Us</p>

        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-dark text-3xl md:text-4xl lg:text-5xl leading-tight font-sans font-medium">
            We help Nairobi families{' '}
            <span className="head-serif italic text-primary">reclaim their space</span>
            {' '}and build homes that feel calm, functional, and{' '}
            <span className="head-serif italic text-dark">beautifully organised.</span>
            {' '}Your home matters — we make it work{' '}
            <span className="head-serif italic">for you.</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <div className="flex gap-10 lg:flex-col lg:gap-8 flex-shrink-0">
            {[
              { value: '500+', label: 'Homes Organized' },
              { value: '7 yrs', label: 'In Business' },
              { value: '4.9★', label: 'Client Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="head-sans text-4xl text-primary leading-none">{stat.value}</p>
                <p className="text-dark/50 text-xs mt-1 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 relative rounded-3xl overflow-hidden aspect-video bg-muted img-zoom">
            <Image
              src={IMG.faithPortrait}
              alt="Faith — founder of Faith The Organizer"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white font-semibold text-sm">Faith Kariuki</p>
              <p className="text-white/60 text-xs">Founder & Lead Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
