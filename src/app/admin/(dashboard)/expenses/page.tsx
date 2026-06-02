'use client'

import { useState } from 'react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import { MOCK_EXPENSES } from '@/lib/admin-business-mock'
import { formatPrice } from '@/lib/utils'

export default function AdminExpensesPage() {
  const [search, setSearch] = useState('')
  const rows = MOCK_EXPENSES.filter((e) => {
    const q = search.toLowerCase().trim()
    return !q || e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  })

  return (
    <AdminModuleFrame title="Expenses" subtitle="Operating costs with receipt placeholders">
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Category or description…" />
      <AdminTableShell>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['ID', 'Category', 'Description', 'Amount', 'Date', 'Method', 'Linked to', 'Receipt'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className="border-b border-dark/5">
                <td className="px-5 py-3 font-mono text-xs">{e.id}</td>
                <td className="px-5 py-3 font-medium">{e.category}</td>
                <td className="px-5 py-3 text-dark/70 max-w-[200px] truncate">{e.description}</td>
                <td className="px-5 py-3 font-mono font-semibold">{formatPrice(e.amount)}</td>
                <td className="px-5 py-3 text-xs">{e.date}</td>
                <td className="px-5 py-3 uppercase text-xs">{e.method}</td>
                <td className="px-5 py-3 text-xs text-dark/50">{e.clientOrProject ?? '—'}</td>
                <td className="px-5 py-3 text-xs text-dark/40">{e.receiptNote ?? 'Upload (preview)'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
