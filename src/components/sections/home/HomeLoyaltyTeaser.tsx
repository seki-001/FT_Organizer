import Link from 'next/link'
import { Gift } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

export default function HomeLoyaltyTeaser() {
  return (
    <section className="section-padding bg-surface border-t border-dark/6">
      <div className="section-container">
        <div className="card-surface border border-dark/8 p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream text-primary">
            <Gift size={26} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <SectionHeading
              eyebrow="Coming soon"
              title="Loyalty program"
              subtitle="Repeat clients and referral rewards are on the way — earn benefits on organizing sessions, shop purchases, and site visits when the program launches."
              className="mb-0"
            />
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center border-2 border-primary text-primary font-semibold text-sm px-6 min-h-[44px] rounded-button hover:bg-primary hover:text-white transition-colors"
          >
            Get notified
          </Link>
        </div>
      </div>
    </section>
  )
}
