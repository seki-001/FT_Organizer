import Link from 'next/link'
import { SERVICES } from '@/lib/constants'
import ServiceCard from '@/components/ui/ServiceCard'

export default function ServicesStrip() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-dark mb-4">
            Our Services
          </h2>
          <p className="text-dark/60 text-lg max-w-2xl mx-auto">
            Professional organizing tailored to your space and lifestyle
          </p>
        </div>

        {/* Card grid — horizontal scroll on mobile, 4-col grid on xl */}
        <div className="flex xl:grid xl:grid-cols-4 gap-6 overflow-x-auto xl:overflow-visible snap-x snap-mandatory xl:snap-none pb-4 xl:pb-0 -mx-4 px-4 xl:mx-0 xl:px-0">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={service.title}
              icon={service.icon}
              priceFrom={service.priceFrom}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/services"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-200"
          >
            View All Services
          </Link>
        </div>

      </div>
    </section>
  )
}
