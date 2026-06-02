import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/ui/ServiceCard'
import { SERVICES, SERVICE_GROUPS } from '@/lib/constants'

export default function HomeServicesOverview() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading
          eyebrow="Our services"
          title="Nine ways we bring order to your life"
          subtitle="Organizing, storage, home management, relocation, events, training, staffing, and curated products — grouped for clarity."
          align="center"
        />

        <div className="flex flex-col gap-14 md:gap-16">
          {SERVICE_GROUPS.map((group) => {
            const groupServices = SERVICES.filter((s) => s.groupId === group.id)
            return (
              <div key={group.id}>
                <h3 className="font-display text-xl md:text-2xl text-dark mb-6">{group.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {groupServices.map((service) => (
                    <ServiceCard
                      key={service.slug}
                      slug={service.slug}
                      title={service.title}
                      icon={service.icon}
                      priceFrom={service.priceFrom}
                      description={service.description}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-danger transition-colors"
          >
            View all services
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
