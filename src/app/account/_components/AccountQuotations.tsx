'use client'

import { FileText } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import { DEMO_QUOTATIONS } from '@/lib/account-dashboard-data'
import { quotationStatusVariant, formatStatusLabel } from '@/lib/account-status'
import { formatPrice } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AccountQuotations() {
  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6">
      <AccountSectionHeader
        title="Quotations"
        subtitle="Service proposals — preview only"
      />

      <ul className="flex flex-col gap-3">
        {DEMO_QUOTATIONS.map((q) => (
          <li
            key={q.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-dark/8 bg-surface p-4"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <FileText size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-medium text-dark text-sm">{q.serviceTitle}</p>
                <p className="text-xs text-dark/45 mt-0.5 font-mono">{q.id}</p>
                <p className="text-xs text-dark/50 mt-1">
                  Valid until {formatDate(q.validUntil)} · Sent {formatDate(q.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
              <span className="font-mono font-semibold text-dark">{formatPrice(q.amount)}</span>
              <StatusBadge
                label={formatStatusLabel(q.status)}
                variant={quotationStatusVariant(q.status)}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-dark/40 mt-4">
        Accepting quotes online is coming soon. Contact us on WhatsApp to confirm.
      </p>
    </section>
  )
}
