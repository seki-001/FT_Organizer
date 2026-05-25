import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube } from 'lucide-react'
import { COMPANY, NAV_LINKS, SERVICES } from '@/lib/constants'

const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'Book a Service', href: '/book' },
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Shipping & Returns', href: '/shipping-and-returns' },
]

const FIRST_SIX_SERVICES = SERVICES.slice(0, 6)

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <span className="font-display text-xl font-bold text-white">
                {COMPANY.name}
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              {COMPANY.tagline}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href={COMPANY.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 — Services */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-base font-semibold text-white">
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {FIRST_SIX_SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-base font-semibold text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((quickLink) => (
                <li key={quickLink.href}>
                  <Link
                    href={quickLink.href}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-200"
                  >
                    {quickLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-base font-semibold text-white">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                  className="flex items-start gap-3 text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  <Phone size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{COMPANY.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-start gap-3 text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  <Mail size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span>{COMPANY.email}</span>
                    <span className="text-white/40">{COMPANY.emailPersonal}</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-white/60 hover:text-white text-sm transition-colors duration-200"
                >
                  <MessageCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>WhatsApp Us</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span>{COMPANY.address}</span>
                    <span className="text-white/40 text-xs">{COMPANY.addressFull}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <nav aria-label="Legal links" className="flex items-center gap-4 flex-wrap justify-center">
            {LEGAL_LINKS.map((legalLink, index) => (
              <span key={legalLink.href} className="flex items-center gap-4">
                <Link
                  href={legalLink.href}
                  className="text-white/40 hover:text-white/80 text-xs transition-colors duration-200"
                >
                  {legalLink.label}
                </Link>
                {index < LEGAL_LINKS.length - 1 && (
                  <span className="text-white/20 text-xs" aria-hidden="true">|</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
