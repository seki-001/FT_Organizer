'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import { MOCK_DEBTORS } from '@/lib/admin-business-mock'
import { formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

export default function AdminDebtorsPage() {
  const [search, setSearch] = useState('')
  const rows = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return MOCK_DEBTORS
    return MOCK_DEBTORS.filter((d) => d.clientName.toLowerCase().includes(q))
  }, [search])

  return (
    <AdminModuleFrame title="Debtors" subtitle="Outstanding balances and follow-up schedule">
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Search client…" />
      <AdminTableShell>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['Client', 'Amount due', 'Overdue', 'Last follow-up', 'Next follow-up', 'Contact'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-dark/5">
                <td className="px-5 py-3">
                  <Link href={`/admin/customers/${d.clientId}`} className="font-medium hover:text-primary">
                    {d.clientName}
                  </Link>
                </td>
                <td className="px-5 py-3 font-mono font-semibold">{formatPrice(d.amountDue)}</td>
                <td className="px-5 py-3">
                  {d.overdueDays > 0 ? (
                    <span className="text-danger font-semibold text-xs">{d.overdueDays} days</span>
                  ) : (
                    <span className="text-dark/40 text-xs">Current</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-dark/50">{d.lastFollowUp}</td>
                <td className="px-5 py-3 text-xs text-dark/50">{d.nextFollowUp}</td>
                <td className="px-5 py-3">
                  <a
                    href={`${COMPANY.whatsappLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#128C7E] font-medium"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
