'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminListToolbar, { AdminTableShell } from '@/components/admin/business/AdminListToolbar'
import PreviewActionButton from '@/components/admin/business/PreviewActionButton'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_INVENTORY } from '@/lib/admin-business-mock'

export default function AdminInventoryPage() {
  const [search, setSearch] = useState('')
  const rows = MOCK_INVENTORY.filter((r) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)
  })
  const lowStock = rows.filter((r) => r.onHand <= r.reorderAt)

  return (
    <AdminModuleFrame title="Inventory" subtitle="Stock levels, reservations, and restock reminders">
      {lowStock.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-dark/70">
          <AlertTriangle size={16} className="text-danger shrink-0" />
          {lowStock.length} SKU{lowStock.length !== 1 ? 's' : ''} at or below reorder level (preview alert).
        </div>
      )}
      <div className="flex gap-3">
        <PreviewActionButton label="Record stock movement" variant="outline" />
        <PreviewActionButton label="Restock reminder" variant="outline" />
      </div>
      <AdminListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Product or SKU…" />
      <AdminTableShell>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark/8 bg-muted/30">
              {['Product', 'SKU', 'Category', 'On hand', 'Reserved', 'Available', 'Reorder at', 'Last movement'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const available = r.onHand - r.reserved
              const isLow = r.onHand <= r.reorderAt
              return (
                <tr key={r.productId} className="border-b border-dark/5">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3 font-mono text-xs">{r.sku}</td>
                  <td className="px-5 py-3 text-dark/60">{r.category}</td>
                  <td className="px-5 py-3 tabular-nums">{r.onHand}</td>
                  <td className="px-5 py-3 tabular-nums text-dark/50">{r.reserved}</td>
                  <td className="px-5 py-3 tabular-nums font-semibold">{available}</td>
                  <td className="px-5 py-3">
                    {isLow ? <StatusBadge label="Low" variant="danger" /> : <StatusBadge label="OK" variant="success" />}
                  </td>
                  <td className="px-5 py-3 text-xs text-dark/50">{r.lastMovement}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </AdminTableShell>
    </AdminModuleFrame>
  )
}
