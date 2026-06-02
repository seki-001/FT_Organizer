import SectionHeading from '@/components/ui/SectionHeading'
import ServiceHubCard from './ServiceHubCard'
import { SERVICE_GROUPS, getServicesByGroup, getServiceDetail } from '@/lib/constants'

export default function ServicesCatalog() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container flex flex-col gap-16 md:gap-20">
        {SERVICE_GROUPS.map((group) => {
          const services = getServicesByGroup(group.id).map((s) => getServiceDetail(s.slug)!)
          return (
            <div key={group.id} id={group.id}>
              <SectionHeading
                title={group.label}
                subtitle={`Professional ${group.label.toLowerCase()} across East Africa — site visit first, then a clear plan and quote.`}
                className="mb-8 md:mb-10"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {services.map((service) => (
                  <ServiceHubCard key={service.slug} service={service} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
