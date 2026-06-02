'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import PreviewActionButton from '@/components/admin/business/PreviewActionButton'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_QUOTATIONS } from '@/lib/admin-business-mock'
import { adminQuotationStatusVariant, formatAdminStatus } from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

export default function QuotationDetailPage() {
  const id = useParams().id as string
  const quote = MOCK_QUOTATIONS.find((q) => q.id === id)

  if (!quote) {
    return (
      <AdminModuleFrame title="Quotation not found">
        <Link href="/admin/quotations" className="text-primary text-sm">← Back</Link>
      </AdminModuleFrame>
    )
  }

  return (
    <AdminModuleFrame title={quote.id} subtitle={quote.clientName}>
      <Link href="/admin/quotations" className="text-primary text-sm hover:underline -mt-2">← All quotations</Link>

      <div className="flex flex-wrap gap-3 items-center">
        <StatusBadge label={formatAdminStatus(quote.status)} variant={adminQuotationStatusVariant(quote.status)} />
        <PreviewActionButton label="Convert to invoice" />
      </div>

      <div className="bg-white rounded-2xl border border-dark/8 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-dark/8">
              <th className="text-left px-5 py-3 text-xs uppercase text-dark/45">Item</th>
              <th className="text-right px-5 py-3 text-xs uppercase text-dark/45">Qty</th>
              <th className="text-right px-5 py-3 text-xs uppercase text-dark/45">Unit</th>
              <th className="text-right px-5 py-3 text-xs uppercase text-dark/45">Line total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lineItems.map((line) => (
              <tr key={line.id} className="border-b border-dark/5">
                <td className="px-5 py-3">
                  <p className="font-medium">{line.description}</p>
                  {line.type === 'fee_redemption' && (
                    <p className="text-xs text-success mt-0.5">Site visit fee redemption (50% rule)</p>
                  )}
                </td>
                <td className="px-5 py-3 text-right tabular-nums">{line.quantity}</td>
                <td className="px-5 py-3 text-right font-mono">{formatPrice(line.unitPrice)}</td>
                <td className="px-5 py-3 text-right font-mono font-semibold">
                  {formatPrice(line.quantity * line.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/20">
              <td colSpan={3} className="px-5 py-3 text-right font-medium">Total</td>
              <td className="px-5 py-3 text-right font-mono font-bold text-lg">{formatPrice(quote.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-dark/40">Valid until {quote.validUntil}. Created {quote.createdAt}.</p>
    </AdminModuleFrame>
  )
}
