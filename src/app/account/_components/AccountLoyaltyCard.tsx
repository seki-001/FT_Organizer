import Link from 'next/link'
import { Gift } from 'lucide-react'
import { DEMO_LOYALTY } from '@/lib/account-dashboard-data'

export default function AccountLoyaltyCard() {
  const progress = Math.min(100, Math.round((DEMO_LOYALTY.points / DEMO_LOYALTY.pointsToNext) * 100))

  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream text-primary">
          <Gift size={26} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              {DEMO_LOYALTY.comingSoon ? 'Coming soon' : 'Loyalty'}
            </p>
            <h2 className="font-display text-xl text-dark mt-1">{DEMO_LOYALTY.label}</h2>
            <p className="text-sm text-dark/60 mt-2 leading-relaxed">{DEMO_LOYALTY.perk}</p>
          </div>
          <div>
            <div className="flex justify-between text-xs text-dark/50 mb-1">
              <span>{DEMO_LOYALTY.points} preview points</span>
              <span>{DEMO_LOYALTY.pointsToNext} to next reward</span>
            </div>
            <div className="h-2 rounded-full bg-dark/10 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center border-2 border-primary text-primary font-semibold text-sm px-5 min-h-[44px] rounded-button hover:bg-primary hover:text-white transition-colors"
        >
          Get notified
        </Link>
      </div>
    </section>
  )
}
