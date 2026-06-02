'use client'

import { useState } from 'react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_PURCHASES } from '@/lib/admin-business-mock'
import { adminPurchasePaymentVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

export default function AdminPurchasesPage() {
  const [search, setSearch] = useState('')
  const rows = MOCK_PURCHASES.filter((p) => {
    const q = search.toLowerCase().trim()
    return !q || p.supplier.toLowerCase().includes(q) || p.item.toLowerCase().includes(q)
  })

  return (
    <AdminModuleFrame title="Purchases" subtitle="Supplier orders and receipt placeholders">
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Supplier or item…" />
      <AdminTableShell>
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['ID', 'Supplier', 'Item', 'Qty', 'Unit cost', 'Total', 'Payment', 'Date', 'Receipt'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-dark/5">
                <td className="px-5 py-3 font-mono text-xs">{p.id}</td>
                <td className="px-5 py-3">{p.supplier}</td>
                <td className="px-5 py-3">{p.item}</td>
                <td className="px-5 py-3 tabular-nums">{p.quantity}</td>
                <td className="px-5 py-3 font-mono">{formatPrice(p.unitCost)}</td>
                <td className="px-5 py-3 font-mono font-semibold">{formatPrice(p.totalCost)}</td>
                <td className="px-5 py-3">
                  <StatusBadge label={formatAdminStatus(p.paymentStatus)} variant={adminPurchasePaymentVariant(p.paymentStatus)} />
                </td>
                <td className="px-5 py-3 text-xs text-dark/50">{p.purchasedAt}</td>
                <td className="px-5 py-3 text-xs text-dark/40">{p.receiptNote ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
