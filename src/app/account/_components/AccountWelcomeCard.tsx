'use client'

import { useSession } from '@/context/AuthContext'
import { SITE_VISIT } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

export default function AccountWelcomeCard() {
  const { data: session } = useSession()
  const firstName = session?.user.name?.split(' ')[0] ?? 'there'

  return (
    <div className="card-surface border border-dark/8 p-6 md:p-8 bg-gradient-to-br from-white via-white to-primary/5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
        Your space, organized
      </p>
      <h1 className="font-display text-2xl md:text-3xl text-dark leading-tight">
        Welcome back, {firstName}
      </h1>
      <p className="text-dark/60 text-sm mt-3 max-w-xl leading-relaxed">
        Track site visits, service quotes, shop orders, and follow-up — all in one place when
        customer accounts go live.
      </p>
      <p className="text-xs text-dark/45 mt-4">
        Site visits from {formatPrice(SITE_VISIT.feeKsh)} · {SITE_VISIT.redeemablePercent}%
        redeemable if you retain us
      </p>
    </div>
  )
}
