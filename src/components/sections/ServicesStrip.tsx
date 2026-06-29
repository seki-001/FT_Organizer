import Link from 'next/link'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { ILLUSTRATIONS, illustrationForService } from '@/lib/illustrations'
import { SectionHeader, ServiceShowcaseCard } from '@/components/ui/commerce'
import { MediaBlend } from '@/components/ui/illustrations'
import { IMG } from '@/lib/image-placeholders'

const SERVICE_BLURBS: Record<string, string> = {
  'general-decluttering': 'Clear clutter room by room with a proven system tailored to your home.',
  'whole-house-organizing': 'Full-home transformation — every room sorted, labelled, and sustainable.',
  'moving-house': 'Pack, unpack, and settle in faster with stress-free move support.',
}

const FEATURED_SERVICES = SERVICES.slice(0, 3)

export default function ServicesStrip() {
  return (
    <section className="glass-grid-bg section-blend section-blend-top section-from-dark section-scoop-top py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          label="Our services"
          title="Everything you need"
          titleAccent="for a tidy space"
          description="Professional organizing across Nairobi — friendly cartoon-guided process, real results in your home."
          action={{ label: 'All services', href: '/services' }}
        />

        <MediaBlend
          className="mb-12"
          photo={IMG.services.beforeAfter1}
          illustration={ILLUSTRATIONS.closetStudio}
          photoAlt="Organized modern living room"
          illustrationAlt="Organized closet and wardrobe"
          photoPosition="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
          {FEATURED_SERVICES.map((service) => (
            <ServiceShowcaseCard
              key={service.slug}
              title={service.title}
              description={SERVICE_BLURBS[service.slug] ?? 'Professional organizing tailored to your space and lifestyle.'}
              image={illustrationForService(service.slug)}
              href={`/services/${service.slug}`}
              priceFrom={`From ${formatPrice(service.priceFrom)}`}
              illustration
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {SERVICES.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="sfs-chip">
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
