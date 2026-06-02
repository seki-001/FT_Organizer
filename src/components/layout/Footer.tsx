import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react'
import BrandLogo from '@/components/ui/BrandLogo'
import FooterNewsletter from '@/components/layout/FooterNewsletter'
import { COMPANY, SERVICES, SHOP_CATEGORIES } from '@/lib/constants'

const FOOTER_SERVICES = SERVICES

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
  { label: 'Shipping & Returns', href: '/shipping-and-returns' },
  { label: 'FAQ', href: '/faq' },
]

export default function Footer() {
  return (
    <footer className="bg-softBlack text-white">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-5 lg:col-span-4">
            <div className="inline-flex max-w-[300px] rounded-card bg-surface p-4 sm:p-5">
              <BrandLogo heightClass="h-14 sm:h-16 md:h-[4.5rem]" href="/" />
            </div>
            <p className="font-display text-lg font-semibold text-white">{COMPANY.tagline}</p>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Professional home and office organizing across East Africa. Based in Nairobi,
              serving clients in Kenya and the wider region.
            </p>
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-button bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <div className="flex items-center gap-4">
              <a
                href={COMPANY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/55 transition-colors hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a
                href={COMPANY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/55 transition-colors hover:text-white"
              >
                <Facebook size={20} />
              </a>
              <a
                href={COMPANY.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-white/55 transition-colors hover:text-white"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_SERVICES.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm font-medium text-primary transition-colors hover:text-white"
                >
                  View all services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white">Shop</h3>
            <ul className="flex flex-col gap-2.5">
              {SHOP_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  All products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  Your cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-base font-semibold text-white">Contact</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{COMPANY.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-start gap-3 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{COMPANY.email}</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-sm text-white/60">
                    <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                      <span>{COMPANY.address}</span>
                      <span className="text-xs text-white/40">{COMPANY.addressFull}</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <FooterNewsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-center text-xs text-white/40 sm:text-left">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <nav
            aria-label="Legal and policy links"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
          >
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/45 transition-colors hover:text-white/85"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
