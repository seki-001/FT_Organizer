import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Plane } from 'lucide-react'
import { SITE_VISIT, getServiceBySlug } from '@/lib/constants'

const relocation = getServiceBySlug('relocation-transition')

export default function HomeRelocationHighlight() {
  if (!relocation) return null

  return (
    <section className="section-padding bg-cream">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center rounded-card overflow-hidden border border-dark/8 bg-white shadow-card">
          <div className="relative min-h-[260px] lg:min-h-[420px]">
            <Image
              src="/images/services/moving-after-1.jpg"
              alt="Relocation and home setup support"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="p-8 md:p-10 lg:p-12 flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Relocation & diaspora
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-dark leading-tight">
              {relocation.title}
            </h2>
            <p className="text-dark/65 leading-relaxed">{relocation.description}</p>
            <p className="text-sm text-dark/55 leading-relaxed flex gap-2">
              <Plane size={18} className="shrink-0 text-primary mt-0.5" aria-hidden="true" />
              {SITE_VISIT.diasporaNote}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/services/${relocation.slug}`}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 min-h-[44px] rounded-button hover:bg-danger transition-colors"
              >
                Learn more
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/book?service=relocation-transition"
                className="inline-flex items-center gap-2 border border-dark/15 text-dark text-sm font-medium px-6 min-h-[44px] rounded-button hover:border-dark/30 transition-colors"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
