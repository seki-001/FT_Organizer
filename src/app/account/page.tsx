'use client'

import Link from 'next/link'
import { ShoppingBag, Calendar, Heart, ArrowRight } from 'lucide-react'
import { useSession } from '@/context/AuthContext'
import { useWishlist } from '@/context/WishlistContext'
import { MOCK_ORDERS, MOCK_BOOKINGS } from '@/lib/mock-account'
import { SERVICES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

type StatusVariant = 'processing' | 'confirmed' | 'completed' | 'cancelled' | 'new' | 'dispatched' | 'packed' | 'delivered' | 'quoted' | 'paid' | 'pending' | 'failed'

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase() as StatusVariant
  const map: Record<string, string> = {
    processing: 'bg-accent/20 text-amber-700',
    new:        'bg-accent/20 text-amber-700',
    pending:    'bg-accent/20 text-amber-700',
    packed:     'bg-accent/20 text-amber-700',
    quoted:     'bg-accent/20 text-amber-700',
    confirmed:  'bg-success/20 text-success',
    paid:       'bg-success/20 text-success',
    dispatched: 'bg-success/20 text-success',
    completed:  'bg-muted text-dark/60',
    delivered:  'bg-muted text-dark/60',
    cancelled:  'bg-danger/20 text-danger',
    failed:     'bg-danger/20 text-danger',
  }
  return (
    <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize', map[s] ?? 'bg-muted text-dark/60')}>
      {status}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountDashboardPage() {
  const { data: session } = useSession()
  const { totalItems: wishlistCount } = useWishlist()

  const firstName = session?.user.name?.split(' ')[0] ?? 'there'

  const recentOrders   = MOCK_ORDERS.slice(0, 3)
  const nextBooking    = MOCK_BOOKINGS.find((b) => b.status === 'confirmed' || b.status === 'new')

  return (
    <div className="flex flex-col gap-8">
      {/* Heading */}
      <div>
        <h1 className="font-display text-3xl font-bold text-dark">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-dark/50 text-sm mt-1">
          Here&apos;s a snapshot of your activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-dark/8 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={20} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark font-mono">{MOCK_ORDERS.length}</p>
            <p className="text-dark/50 text-xs">Orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-dark/8 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark font-mono">{MOCK_BOOKINGS.length}</p>
            <p className="text-dark/50 text-xs">Bookings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-dark/8 p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Heart size={20} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark font-mono">{wishlistCount}</p>
            <p className="text-dark/50 text-xs">Wishlist Items</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark text-lg">Recent Orders</h2>
          <Link href="/account/orders" className="text-primary text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
          {recentOrders.length === 0 ? (
            <p className="p-6 text-dark/40 text-sm text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-dark/50 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">Order Ref</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell">Items</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-dark font-medium">{order.id}</td>
                      <td className="px-5 py-4 text-dark/60 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-dark/60 hidden sm:table-cell">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4 font-mono text-dark font-medium">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4"><StatusBadge status={order.orderStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming booking */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dark text-lg">Upcoming Booking</h2>
          <Link href="/account/bookings" className="text-primary text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        {!nextBooking ? (
          <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-6 text-center">
            <p className="text-dark/40 text-sm mb-3">No upcoming bookings.</p>
            <Link href="/book" className="text-primary text-sm font-medium hover:underline">
              Book a service →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-semibold text-dark">
                {SERVICES.find((s) => s.slug === nextBooking.service)?.title ?? nextBooking.service}
              </p>
              <p className="text-dark/50 text-sm">
                {new Date(nextBooking.date).toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}
                {nextBooking.propertySize === 'small' ? 'Small' : nextBooking.propertySize === 'medium' ? 'Medium' : 'Large'} {nextBooking.propertyType}
              </p>
            </div>
            <StatusBadge status={nextBooking.status} />
          </div>
        )}
      </section>
    </div>
  )
}
