import Link from 'next/link'
import { COMPANY, SERVICES, SHOP_CATEGORIES, SITE_VISIT_SLUG } from '@/lib/constants'
import PaymentTrustBadges from '@/components/payments/PaymentTrustBadges'
import BrandLogo from '@/components/brand/BrandLogo'
import SocialLinks from '@/components/brand/SocialLinks'
import { NewsletterBand } from '@/components/ui/commerce'
import { GlassPanel } from '@/components/ui/glass'

export default function Footer() {
  return (
    <>
      <NewsletterBand />
      <footer className="bg-dark glass-grid-footer pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-14">
          <GlassPanel tone="dark" className="md:col-span-1 p-6">
            <div className="mb-4">
              <BrandLogo variant="on-dark" href="/" size="xl" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              {COMPANY.tagline} — comprehensive solutions for homes, workplaces, and institutions.
            </p>
            <SocialLinks variant="dark" className="mb-1" />
          </GlassPanel>

          {[
            { label: 'Services', items: SERVICES.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
            { label: 'Shop', items: SHOP_CATEGORIES.slice(0, 10).map((c) => ({ label: c.label, href: `/shop?category=${c.slug}` })) },
            {
              label: 'Company',
              items: [
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
                { label: 'Book Site Visit', href: `/book?service=${SITE_VISIT_SLUG}` },
                { label: 'Book a Service', href: '/book' },
                { label: 'FAQ', href: '/faq' },
              ],
            },
          ].map((col) => (
            <GlassPanel key={col.label} tone="dark" className="p-6">
              <p className="section-label text-white/40 mb-4">{col.label}</p>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/55 text-sm hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          ))}
        </div>

        <GlassPanel tone="dark" rounded="2xl" className="p-6 flex flex-col gap-6">
          <PaymentTrustBadges variant="dark" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4">
            <p className="text-white/30 text-xs">
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
                  className="text-white/35 text-xs hover:text-white/60 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>
    </footer>
    </>
  )
}
