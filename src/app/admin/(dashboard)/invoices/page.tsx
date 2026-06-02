'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_INVOICES } from '@/lib/admin-business-mock'
import { adminInvoiceStatusVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'partial', label: 'Partial' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
]

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const rows = useMemo(() => {
    let list = [...MOCK_INVOICES]
    const q = search.toLowerCase().trim()
    if (q) list = list.filter((r) => r.clientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    if (filter !== 'all') list = list.filter((r) => r.status === filter)
    return list
  }, [search, filter])

  return (
    <AdminModuleFrame title="Invoices" subtitle="Track balances and payment status (preview)">
      <AdminListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoice or client…"
        filters={FILTERS}
        filter={filter}
        onFilterChange={setFilter}
        onClear={() => { setSearch(''); setFilter('all') }}
      />
      <AdminTableShell>
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['Invoice', 'Client', 'Total', 'Paid', 'Balance', 'Status', 'Due', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((inv) => {
              const balance = inv.total - inv.paid
              return (
                <tr key={inv.id} className="border-b border-dark/5 hover:bg-muted/20">
                  <td className="px-5 py-3 font-mono text-xs">{inv.id}</td>
                  <td className="px-5 py-3">{inv.clientName}</td>
                  <td className="px-5 py-3 font-mono">{formatPrice(inv.total)}</td>
                  <td className="px-5 py-3 font-mono text-dark/60">{formatPrice(inv.paid)}</td>
                  <td className="px-5 py-3 font-mono font-semibold">{formatPrice(balance)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge label={formatAdminStatus(inv.status)} variant={adminInvoiceStatusVariant(inv.status)} />
                  </td>
                  <td className="px-5 py-3 text-xs text-dark/50">{inv.dueAt}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/invoices/${inv.id}`} className="text-primary hover:underline text-xs flex items-center gap-1">
                      <Eye size={14} /> View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
