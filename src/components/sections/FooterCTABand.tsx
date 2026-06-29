import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { COMPANY } from '@/lib/constants'

export default function FooterCTABand() {
  return (
    <section className="bg-dark border-t border-white/6 py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <p className="section-label text-white/30 mb-6">Get Started</p>
        <h2 className="mb-8">
          <span className="head-sans text-5xl md:text-6xl text-white block">Ready to transform</span>
          <span className="head-serif italic text-5xl md:text-6xl text-accent/90 block">your space?</span>
        </h2>
        <p className="text-white/50 text-base max-w-md mx-auto mb-10">
          Book a free consultation. Faith visits your home, assesses the space,
          and creates a plan — no obligation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-white text-dark font-semibold px-7 py-4 rounded-full hover:bg-white/90 transition-colors"
          >
            Book Free Consultation <ArrowUpRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/15 text-white font-medium px-7 py-4 rounded-full hover:border-white/30 hover:bg-white/5 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
