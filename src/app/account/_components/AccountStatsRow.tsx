'use client'

import { ShoppingBag, Calendar, Heart, FileText } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { MOCK_ORDERS, MOCK_BOOKINGS, DEMO_QUOTATIONS } from '@/lib/account-dashboard-data'

export default function AccountStatsRow() {
  const { totalItems: wishlistCount } = useWishlist()

  const stats = [
    { label: 'Orders', value: MOCK_ORDERS.length, icon: ShoppingBag },
    { label: 'Bookings', value: MOCK_BOOKINGS.length, icon: Calendar },
    { label: 'Open quotes', value: DEMO_QUOTATIONS.filter((q) => q.status === 'sent').length, icon: FileText },
    { label: 'Wishlist', value: wishlistCount, icon: Heart },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="card-surface border border-dark/8 p-4 flex items-center gap-3"
        >
          <span className="flex w-10 h-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
            <Icon size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-xl font-bold text-dark">{value}</p>
            <p className="text-xs text-dark/50">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
