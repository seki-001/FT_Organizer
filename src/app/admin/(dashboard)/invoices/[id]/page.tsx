'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import PreviewActionButton from '@/components/admin/business/PreviewActionButton'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_INVOICES } from '@/lib/admin-business-mock'
import { adminInvoiceStatusVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

export default function InvoiceDetailPage() {
  const id = useParams().id as string
  const inv = MOCK_INVOICES.find((i) => i.id === id)
  if (!inv) {
    return (
      <AdminModuleFrame title="Invoice not found">
        <Link href="/admin/invoices" className="text-primary text-sm">← Back</Link>
      </AdminModuleFrame>
    )
  }
  const balance = inv.total - inv.paid

  return (
    <AdminModuleFrame title={inv.id} subtitle={inv.clientName}>
      <Link href="/admin/invoices" className="text-primary text-sm hover:underline -mt-2">← All invoices</Link>
      <div className="flex flex-wrap gap-3 items-center">
        <StatusBadge label={formatAdminStatus(inv.status)} variant={adminInvoiceStatusVariant(inv.status)} />
        <PreviewActionButton label="Record payment" variant="primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-dark/8 p-4">
          <p className="text-xs text-dark/45">Total</p>
          <p className="font-mono text-xl font-bold">{formatPrice(inv.total)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 p-4">
          <p className="text-xs text-dark/45">Paid</p>
          <p className="font-mono text-xl font-bold text-success">{formatPrice(inv.paid)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 p-4">
          <p className="text-xs text-dark/45">Balance due</p>
          <p className="font-mono text-xl font-bold text-danger">{formatPrice(balance)}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-dark/8 p-5 text-sm text-dark/60">
        Issued {inv.issuedAt} · Due {inv.dueAt}
        {inv.quotationId && <p className="mt-2">From quotation {inv.quotationId}</p>}
      </div>
    </AdminModuleFrame>
  )
}
