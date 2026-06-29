import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { ILLUSTRATIONS } from '@/lib/illustrations'
import Image from 'next/image'

export default function FooterCTABand() {
  return (
    <section className="bg-dark glass-grid-footer py-20 overflow-hidden relative section-blend">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 md:w-80 opacity-20 pointer-events-none hidden lg:block" aria-hidden>
        <Image src={ILLUSTRATIONS.homeRenovation} alt="" width={320} height={240} className="w-full h-auto" />
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className="mb-6 flex justify-center">
          <span className="glass-badge-dark">Get Started</span>
        </div>
        <h2 className="mb-8">
          <span className="head-sans text-5xl md:text-6xl text-white block">Ready to transform</span>
          <span className="head-serif italic text-5xl md:text-6xl text-accent block">your space?</span>
        </h2>
        <p className="text-white/50 text-base max-w-md mx-auto mb-10">
          Book a free consultation. Faith visits your home, assesses the space,
          and creates a plan — no obligation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book" className="sfs-btn-primary px-7 py-4">
            Book Free Consultation <ArrowUpRight size={16} />
          </Link>
          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-btn-ghost-light px-7 py-4"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
