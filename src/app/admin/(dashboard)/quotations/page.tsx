'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye, FileText } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_QUOTATIONS } from '@/lib/admin-business-mock'
import { adminQuotationStatusVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'expired', label: 'Expired' },
] as const

export default function AdminQuotationsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  const rows = useMemo(() => {
    let list = [...MOCK_QUOTATIONS]
    const q = search.toLowerCase().trim()
    if (q) list = list.filter((r) => r.clientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    if (filter !== 'all') list = list.filter((r) => r.status === filter)
    return list
  }, [search, filter])

  return (
    <AdminModuleFrame
      title="Quotations"
      subtitle="Service and product quotes with site visit fee redemption"
      action={{ label: 'New quotation', onClick: () => {}, icon: FileText }}
    >
      <AdminListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search client or quote ref…"
        filters={FILTERS.map((f) => ({ id: f.id, label: f.label }))}
        filter={filter}
        onFilterChange={setFilter}
        onClear={() => { setSearch(''); setFilter('all') }}
      />

      <AdminTableShell footer={`Showing ${rows.length} quotations (preview data)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-dark/8 bg-muted/30">
                {['Reference', 'Client', 'Total', 'Status', 'Valid until', ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((q) => (
                <tr key={q.id} className="border-b border-dark/5 hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono text-xs font-medium">{q.id}</td>
                  <td className="px-5 py-3">{q.clientName}</td>
                  <td className="px-5 py-3 font-mono font-semibold">{formatPrice(q.total)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={formatAdminStatus(q.status)} variant={adminQuotationStatusVariant(q.status)} />
                  </td>
                  <td className="px-5 py-3 text-dark/50 text-xs">{q.validUntil}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/quotations/${q.id}`} className="w-8 h-8 inline-flex items-center justify-center rounded-lg hover:bg-primary/10 text-dark/40 hover:text-primary">
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
