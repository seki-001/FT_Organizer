'use client'

import { useState } from 'react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_FOLLOW_UPS } from '@/lib/admin-business-mock'
import { adminFollowUpStatusVariant, formatAdminStatus } from '@/lib/admin-status'

const TYPE_LABELS: Record<string, string> = {
  '1_week': '1-week',
  '1_month': '1-month',
  custom: 'Custom',
}

export default function AdminFollowUpsPage() {
  const [search, setSearch] = useState('')
  const rows = MOCK_FOLLOW_UPS.filter((f) => {
    const q = search.toLowerCase().trim()
    return !q || f.clientName.toLowerCase().includes(q)
  })

  return (
    <AdminModuleFrame title="Follow-ups" subtitle="Post-service check-ins across WhatsApp, email, and phone">
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Client name…" />
      <AdminTableShell>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['Client', 'Type', 'Channel', 'Scheduled', 'Status', 'Satisfaction', 'Upsell'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b border-dark/5">
                <td className="px-5 py-3 font-medium">{f.clientName}</td>
                <td className="px-5 py-3 text-xs">{TYPE_LABELS[f.type] ?? f.type}</td>
                <td className="px-5 py-3 capitalize text-xs">{f.channel}</td>
                <td className="px-5 py-3 text-xs text-dark/50">{f.scheduledAt}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={formatAdminStatus(f.status)} variant={adminFollowUpStatusVariant(f.status)} />
                </td>
                <td className="px-5 py-3 text-xs capitalize">{f.satisfaction ?? '—'}</td>
                <td className="px-5 py-3 text-xs text-dark/50 max-w-[180px] truncate">{f.upsellNote ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
