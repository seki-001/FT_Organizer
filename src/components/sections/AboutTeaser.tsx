import { COMPANY } from '@/lib/constants'
import { COMPANY_MISSION } from '@/lib/service-content'
import { IMG } from '@/lib/image-placeholders'
import { ILLUSTRATIONS } from '@/lib/illustrations'
import { MediaBlend } from '@/components/ui/illustrations'

export default function AboutTeaser() {
  return (
    <section className="glass-grid-bg py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <p className="sfs-label mb-8">About Us</p>

        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-dark text-3xl md:text-4xl lg:text-5xl leading-tight font-sans font-medium">
            {COMPANY.name} —{' '}
            <span className="head-serif italic text-primary">{COMPANY_MISSION.tagline}</span>
          </h2>
          <p className="text-dark/60 text-base leading-relaxed mt-6 max-w-3xl mx-auto">
            {COMPANY_MISSION.about[0]}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start mb-14">
          <div className="flex gap-10 lg:flex-col lg:gap-8 flex-shrink-0">
            {[
              { value: '500+', label: 'Spaces Transformed' },
              { value: '9', label: 'Service Categories' },
              { value: '4.9★', label: 'Client Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="head-sans text-4xl text-primary leading-none">{stat.value}</p>
                <p className="text-dark/50 text-xs mt-1 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 w-full">
            <MediaBlend
              photo={IMG.gallery.testimonial1}
              illustration={ILLUSTRATIONS.homeRenovation}
              photoAlt="Faith Kaimba consulting with clients"
              illustrationAlt="Styled entryway and home decor"
              photoPosition="left"
            />
            <p className="text-dark/45 text-xs mt-3 text-center lg:text-left">
              Faith Kaimba — Founder &amp; Lead Organizer
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
