import Image from 'next/image'
import { Truck, Clock } from 'lucide-react'

export default function ShopHero() {
  return (
    <section className="relative bg-dark overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/shop/shop-hero.jpg"
          alt="Curated organizing products for home and office"
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/70 to-dark/40" />
      </div>

      <div className="section-container relative z-10 py-14 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-4">
            Curated by Faith
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Organizing essentials, thoughtfully chosen
          </h1>
          <p className="text-white/65 text-sm sm:text-base mt-4 leading-relaxed max-w-lg">
            A small, premium collection — not a crowded marketplace. Quality pieces we use on
            client projects and trust in Nairobi homes.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full px-4 py-2 border border-white/15">
              <Truck size={14} aria-hidden="true" />
              Free delivery · Nairobi CBD
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full px-4 py-2 border border-white/15">
              <Clock size={14} aria-hidden="true" />
              Same-day dispatch before 2 pm
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
