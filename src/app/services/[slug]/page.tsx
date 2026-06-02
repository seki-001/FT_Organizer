import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import CTASection from '@/components/ui/CTASection'
import { SERVICES, SITE_VISIT, resolveServiceSlug, getServiceDetail } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import ServiceDetailHero from '../_components/detail/ServiceDetailHero'
import {
  ServiceWhoIsFor,
  ServiceIncluded,
  ServiceProcess,
  ServiceTimeline,
  ServiceGallery,
  ServicePricing,
  ServiceRelatedProducts,
  ServiceFaq,
  ServiceRelatedServices,
} from '../_components/detail/ServiceDetailSections'

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceDetail(slug)
  if (!service) return { title: 'Service Not Found | Faith The Organizer' }

  return {
    title: `${service.title} | Faith The Organizer`,
    description: `${service.shortBenefit} Serving ${SITE_VISIT.serviceArea}. Site visits from ${formatPrice(SITE_VISIT.feeKsh)}.`,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolvedSlug = resolveServiceSlug(slug)
  if (resolvedSlug !== slug) {
    redirect(`/services/${resolvedSlug}`)
  }

  const service = getServiceDetail(slug)
  if (!service) notFound()

  return (
    <>
      <main>
        <ServiceDetailHero service={service} />
        <ServiceWhoIsFor service={service} />
        <ServiceIncluded service={service} />
        <ServiceProcess service={service} />
        <ServiceTimeline service={service} />
        <ServiceGallery service={service} />
        <ServicePricing service={service} />
        <ServiceRelatedProducts service={service} />
        <ServiceFaq service={service} />
        <ServiceRelatedServices service={service} />
        <CTASection
          variant="cream"
          title="Ready to book this service?"
          description={`Start with a site visit across ${SITE_VISIT.serviceArea}. We assess, quote, and deliver with calm, premium care.`}
          primaryLabel="Book Site Visit"
          primaryHref={`/book?service=${service.slug}`}
          secondaryLabel="View all services"
          secondaryHref="/services"
        />
      </main>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-4 bg-white/95 backdrop-blur border-t border-dark/10 shadow-lg">
        <Link
          href={`/book?service=${service.slug}`}
          className="flex items-center justify-center w-full bg-primary hover:bg-danger text-white font-semibold py-3 rounded-button min-h-[48px] text-sm"
        >
          Book Site Visit
        </Link>
      </div>
    </>
  )
}
