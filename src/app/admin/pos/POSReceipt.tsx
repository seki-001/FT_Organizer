'use client'

import { COMPANY } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import type { Sale, SaleItem } from '@/lib/types'

interface POSReceiptProps {
  sale: Sale
}

export function POSReceipt({ sale }: POSReceiptProps) {
  return (
    <div id="pos-receipt" className="bg-white text-black p-6 max-w-xs mx-auto font-mono text-xs leading-relaxed">
      <div className="text-center border-b border-dashed border-black/30 pb-3 mb-3">
        <p className="font-bold text-sm">{COMPANY.name}</p>
        <p className="text-[10px] mt-1">{COMPANY.address}</p>
        <p className="text-[10px]">{COMPANY.phone}</p>
      </div>

      <div className="space-y-1 mb-3">
        <p>Receipt: {sale.receiptNo}</p>
        <p>Date: {new Date(sale.createdAt).toLocaleString('en-KE')}</p>
        <p>Customer: {sale.customerName ?? 'Walk-in'}</p>
        <p>Cashier: {sale.cashierName}</p>
        <p>Payment: {sale.paymentMethod.toUpperCase()}</p>
      </div>

      <div className="border-t border-dashed border-black/30 pt-2 mb-2">
        {sale.items.map((item: SaleItem) => (
          <div key={item.productId} className="flex justify-between gap-2 mb-1">
            <span className="flex-1 truncate">{item.productName} ×{item.quantity}</span>
            <span>{formatPrice(item.total)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black/30 pt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>−{formatPrice(sale.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm pt-1">
          <span>TOTAL</span>
          <span>{formatPrice(sale.total)}</span>
        </div>
      </div>

      {sale.note && (
        <p className="mt-3 text-[10px] border-t border-dashed border-black/30 pt-2">
          Note: {sale.note}
        </p>
      )}

      <p className="text-center mt-4 text-[10px]">Thank you for shopping with us!</p>
      <p className="text-center text-[10px]">{COMPANY.website}</p>
    </div>
  )
}

export function printPOSReceipt() {
  const receipt = document.getElementById('pos-receipt')
  if (!receipt) return

  const printWindow = window.open('', '_blank', 'width=320,height=600')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { margin: 0; font-family: 'Courier New', monospace; font-size: 12px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>${receipt.outerHTML}</body>
    </html>
  `)
  printWindow.document.close()
  printWindow.focus()
  printWindow.print()
  printWindow.close()
}
