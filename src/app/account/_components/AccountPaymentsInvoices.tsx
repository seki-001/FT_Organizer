'use client'

import { Receipt } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import { DEMO_INVOICES } from '@/lib/account-dashboard-data'
import { invoiceStatusVariant, formatStatusLabel } from '@/lib/account-status'
import { formatPrice } from '@/lib/utils'

export default function AccountPaymentsInvoices() {
  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6">
      <AccountSectionHeader
        title="Invoices & payments"
        subtitle="Site visits, deposits, and shop orders"
      />

      <ul className="flex flex-col gap-3">
        {DEMO_INVOICES.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-dark/8 p-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <Receipt size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-medium text-dark text-sm">{inv.title}</p>
                <p className="text-xs text-dark/45 font-mono mt-0.5">
                  {inv.id} · {inv.relatedTo}
                </p>
                {inv.dueDate && (
                  <p className="text-xs text-dark/50 mt-1">Due {inv.dueDate}</p>
                )}
                {inv.paidAt && (
                  <p className="text-xs text-success/80 mt-1">Paid {inv.paidAt}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
              <span className="font-mono font-semibold text-dark">{formatPrice(inv.amount)}</span>
              <StatusBadge
                label={formatStatusLabel(inv.status)}
                variant={invoiceStatusVariant(inv.status)}
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="text-[11px] text-dark/40 mt-4">
        Online pay links are not active in preview. Payments are not marked complete until verified.
      </p>
    </section>
  )
}
