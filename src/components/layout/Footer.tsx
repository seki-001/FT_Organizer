import Link from 'next/link'
import Image from 'next/image'
import { Instagram } from 'lucide-react'
import { COMPANY, SERVICES, SHOP_CATEGORIES } from '@/lib/constants'
import PaymentTrustBadges from '@/components/payments/PaymentTrustBadges'

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-white/6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/brand/fto-logo.png"
                alt="Faith The Organizer"
                width={160}
                height={56}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              Nairobi&apos;s premier home & office organizing service — from clutter to calm.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/50 hover:bg-white/15 hover:text-white transition-all"
              >
                <Instagram size={15} />
              </a>
            </div>
          </div>

          <div>
            <p className="section-label text-white/30 mb-5">Services</p>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label text-white/30 mb-5">Shop</p>
            <ul className="flex flex-col gap-2.5">
              {SHOP_CATEGORIES.slice(0, 10).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop?category=${c.slug}`}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label text-white/30 mb-5">Company</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'Book a Service', href: '/book' },
                { label: 'FAQ', href: '/faq' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col gap-6">
          <PaymentTrustBadges variant="dark" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Faith The Organizer. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: 'Privacy', href: '/privacy-policy' },
              { label: 'Terms', href: '/terms-and-conditions' },
              { label: 'Shipping & Returns', href: '/shipping-and-returns' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-white/25 text-xs hover:text-white/50 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
