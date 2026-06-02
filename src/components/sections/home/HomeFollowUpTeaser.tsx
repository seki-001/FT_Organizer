import Link from 'next/link'
import { MessageCircle, RefreshCw } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import { COMPANY } from '@/lib/constants'

export default function HomeFollowUpTeaser() {
  return (
    <section className="section-padding bg-cream">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <SectionHeading
              eyebrow="After your project"
              title="Thoughtful follow-up, not a one-day visit"
              subtitle="We stay in touch with check-ins and maintenance guidance so your systems keep working — via WhatsApp, email, or scheduled touch-up sessions."
              className="mb-6"
            />
            <ul className="flex flex-col gap-3 text-sm text-dark/65">
              <li className="flex gap-3">
                <RefreshCw size={18} className="shrink-0 text-primary mt-0.5" aria-hidden="true" />
                Maintenance sessions and seasonal refresh visits available on request
              </li>
              <li className="flex gap-3">
                <MessageCircle size={18} className="shrink-0 text-primary mt-0.5" aria-hidden="true" />
                Quick questions answered through our usual client channels
              </li>
            </ul>
          </div>

          <div className="card-surface p-8 border border-dark/8 flex flex-col gap-4">
            <p className="text-sm text-dark/60 leading-relaxed">
              Automated appointment reminders and post-visit check-ins are being rolled out to make
              scheduling even easier — without losing the personal Faith The Organizer touch.
            </p>
            <a
              href={COMPANY.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm min-h-[44px] rounded-button hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Chat on WhatsApp
            </a>
            <Link
              href="/book"
              className="text-center text-sm font-medium text-primary hover:underline"
            >
              Or book your next visit →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
