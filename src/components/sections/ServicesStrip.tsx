import Image from 'next/image'
import { SERVICES } from '@/lib/constants'
import { IMG } from '@/lib/image-placeholders'

export default function ServicesStrip() {
  return (
    <section className="bg-surface py-16 md:py-20 border-t border-dark/8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:max-w-sm flex-shrink-0">
            <p className="section-label-dark mb-4">Our Services</p>
            <h2 className="text-dark mb-8 leading-tight">
              <span className="head-sans text-4xl lg:text-5xl block">Everything you need</span>
              <span className="head-sans text-4xl lg:text-5xl block">for a</span>
              <span className="head-serif italic text-4xl lg:text-5xl text-accent block">tidy space.</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button key={s.slug} type="button" className="pill-tag text-xs px-3 py-1.5 bg-dark text-white hover:bg-primary transition-colors">
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white border border-dark/10 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="flex gap-3 mb-6">
                <div className="relative h-48 flex-1 rounded-2xl overflow-hidden img-zoom">
                  <Image
                    src={IMG.services.beforeAfter1}
                    alt="Before organizing"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="flex flex-col gap-3 w-28">
                  <div className="relative h-24 rounded-2xl overflow-hidden img-zoom">
                    <Image
                      src={IMG.services.beforeAfter2}
                      alt="After organizing"
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="relative h-24 rounded-2xl overflow-hidden img-zoom">
                    <Image
                      src={IMG.services.beforeAfter3}
                      alt="Organized space"
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                </div>
              </div>
              <p className="text-dark/40 text-xs uppercase tracking-widest mb-1">Most Popular</p>
              <p className="text-dark font-semibold text-lg">Whole House Organizing</p>
              <p className="text-dark/50 text-sm mt-1">From KSh 15,000</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
