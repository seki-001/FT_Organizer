'use client'

import { useMemo, useState } from 'react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import PreviewActionButton from '@/components/admin/business/PreviewActionButton'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_PAYMENTS } from '@/lib/admin-business-mock'
import { adminPaymentStatusVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return MOCK_PAYMENTS
    return MOCK_PAYMENTS.filter(
      (p) => p.clientName.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.reference.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <AdminModuleFrame title="Payments" subtitle="Payment history and manual recording (preview only)">
      <div className="flex flex-wrap gap-3">
        <PreviewActionButton label="Receive payment" />
        <PreviewActionButton label="Record manual payment" variant="outline" />
      </div>
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Client, ref, or transaction ID…" />
      <AdminTableShell>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['ID', 'Client', 'Amount', 'Method', 'Reference', 'Status', 'Date'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-dark/5">
                <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                <td className="px-5 py-3">{p.clientName}</td>
                <td className="px-5 py-3 font-mono font-semibold">{formatPrice(p.amount)}</td>
                <td className="px-5 py-3 uppercase text-xs">{p.method}</td>
                <td className="px-5 py-3 font-mono text-xs text-dark/50">{p.reference}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={formatAdminStatus(p.status)} variant={adminPaymentStatusVariant(p.status)} />
                </td>
                <td className="px-5 py-3 text-xs text-dark/50">
                  {new Date(p.recordedAt).toLocaleDateString('en-KE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
