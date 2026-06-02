'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import AccountEmptyState from '@/components/account/AccountEmptyState'
import { getRecentOrders } from '@/lib/account-dashboard-data'
import { orderStatusVariant, formatStatusLabel } from '@/lib/account-status'
import { formatPrice } from '@/lib/utils'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AccountRecentOrders() {
  const orders = getRecentOrders(3)

  return (
    <section className="card-surface border border-dark/8 overflow-hidden">
      <div className="p-5 sm:p-6 pb-0">
        <AccountSectionHeader title="Recent orders" href="/account/orders" />
      </div>

      {orders.length === 0 ? (
        <AccountEmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="When you shop organizing products, your orders will appear here."
          actionLabel="Browse shop"
          actionHref="/shop"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-dark/40 border-b border-dark/8">
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Items</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/6">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4">
                    <Link
                      href="/account/orders"
                      className="font-mono text-xs font-medium text-dark hover:text-primary"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-dark/60 whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-dark/60 hidden sm:table-cell">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </td>
                  <td className="px-5 py-4 font-mono font-medium text-dark">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      label={formatStatusLabel(order.orderStatus)}
                      variant={orderStatusVariant(order.orderStatus)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
