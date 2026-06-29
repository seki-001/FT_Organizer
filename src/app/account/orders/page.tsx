'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Package, CheckCircle2, Truck, ShoppingBag, Clock } from 'lucide-react'
import { MOCK_ORDERS } from '@/lib/mock-account'
import { formatPrice, cn } from '@/lib/utils'
import type { Order } from '@/lib/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    processing: 'bg-accent/20 text-amber-700',
    new:        'bg-accent/20 text-amber-700',
    pending:    'bg-accent/20 text-amber-700',
    packed:     'bg-accent/20 text-amber-700',
    confirmed:  'bg-success/20 text-success',
    paid:       'bg-success/20 text-success',
    dispatched: 'bg-success/20 text-success',
    completed:  'bg-muted text-dark/60',
    delivered:  'bg-muted text-dark/60',
    cancelled:  'bg-danger/20 text-danger',
    failed:     'bg-danger/20 text-danger',
  }
  return (
    <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize', map[status.toLowerCase()] ?? 'bg-muted text-dark/60')}>
      {status}
    </span>
  )
}

// ─── Order timeline ───────────────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: 'processing', label: 'Order Placed',  icon: ShoppingBag },
  { key: 'packed',     label: 'Packed',         icon: Package },
  { key: 'dispatched', label: 'Dispatched',     icon: Truck },
  { key: 'delivered',  label: 'Delivered',      icon: CheckCircle2 },
]

const STATUS_ORDER: Record<string, number> = {
  processing: 0, packed: 1, dispatched: 2, delivered: 3, cancelled: -1,
}

function OrderTimeline({ status }: { status: string }) {
  const current = STATUS_ORDER[status] ?? 0
  return (
    <div className="flex items-start gap-0 mt-2">
      {TIMELINE_STEPS.map((step, idx) => {
        const done   = idx <= current
        const Icon   = step.icon
        const isLast = idx === TIMELINE_STEPS.length - 1
        return (
          <div key={step.key} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Left connector */}
              {idx > 0 && (
                <div className={cn('flex-1 h-0.5', done ? 'bg-success' : 'bg-dark/10')} />
              )}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                done ? 'bg-success text-white' : 'bg-dark/10 text-dark/30'
              )}>
                <Icon size={14} aria-hidden="true" />
              </div>
              {/* Right connector */}
              {!isLast && (
                <div className={cn('flex-1 h-0.5', idx < current ? 'bg-success' : 'bg-dark/10')} />
              )}
            </div>
            <span className={cn('text-xs mt-1.5 text-center leading-tight', done ? 'text-dark/70 font-medium' : 'text-dark/30')}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Slide-over drawer ────────────────────────────────────────────────────────

function OrderDrawer({ order, onClose }: { order: Order; onClose: () => void }) {
  const paymentLabels: Record<string, string> = {
    mpesa: 'M-Pesa', card: 'Card (Flutterwave)', cod: 'Cash on Delivery',
  }
  const deliveryLabels: Record<string, string> = {
    'nairobi-same-day':   'Nairobi Same Day',
    'standard-nationwide': 'Standard Nationwide',
    'pickup':              'Pick Up',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark/40 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark/8">
          <div>
            <p className="font-semibold text-dark">{order.id}</p>
            <p className="text-dark/40 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-dark/40 hover:bg-muted transition-colors"
            aria-label="Close order details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

          {/* Items */}
          <section>
            <h3 className="font-semibold text-dark text-sm mb-3">Items Ordered</h3>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{item.product.name}</p>
                    <p className="text-xs text-dark/40 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-mono text-dark flex-shrink-0">
                    {formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <section className="bg-muted rounded-xl p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark/60">Subtotal</span>
              <span className="font-mono text-dark">{formatPrice(order.total - order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark/60">Delivery</span>
              <span className="font-mono text-dark">{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-dark/10">
              <span className="text-dark">Total</span>
              <span className="font-mono text-dark">{formatPrice(order.total)}</span>
            </div>
          </section>

          {/* Delivery address */}
          <section>
            <h3 className="font-semibold text-dark text-sm mb-2">Delivery Address</h3>
            <div className="text-sm text-dark/60 flex flex-col gap-0.5">
              <p className="font-medium text-dark">{order.customer.name}</p>
              <p>{order.customer.address}</p>
              <p>{order.customer.city}</p>
              <p>{order.customer.phone}</p>
            </div>
          </section>

          {/* Payment & delivery method */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-dark/40 uppercase tracking-wide mb-1">Payment</p>
              <p className="text-sm font-medium text-dark">{paymentLabels[order.paymentMethod]}</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div>
              <p className="text-xs text-dark/40 uppercase tracking-wide mb-1">Delivery</p>
              <p className="text-sm font-medium text-dark">{deliveryLabels[order.deliveryMethod]}</p>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h3 className="font-semibold text-dark text-sm mb-3">Order Timeline</h3>
            <OrderTimeline status={order.orderStatus} />
          </section>
        </div>
      </div>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountOrdersPage() {
  const [selected, setSelected] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/orders')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { orders?: Order[] } | null) => {
        if (d?.orders) setOrders(d.orders)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-dark">My Orders</h1>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-12 text-center text-dark/50 text-sm">
          Loading your orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-12 text-center flex flex-col items-center gap-4">
          <ShoppingBag size={48} className="text-dark/20" aria-hidden="true" />
          <p className="text-dark/50">No orders yet.</p>
          <Link href="/shop" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-dark/50 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3">Order Ref</th>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Items</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-dark font-medium">{order.id}</td>
                      <td className="px-5 py-4 text-dark/60 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4 text-dark/60">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4 font-mono text-dark">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4"><StatusBadge status={order.orderStatus} /></td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setSelected(order)}
                          className="text-primary text-xs font-medium hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-semibold text-dark">{order.id}</p>
                    <p className="text-xs text-dark/40 mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.orderStatus} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark/60">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                  </span>
                  <span className="font-mono font-medium text-dark">{formatPrice(order.total)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(order)}
                  className="w-full border border-primary text-primary text-sm font-medium py-2 rounded-lg hover:bg-primary/5 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Slide-over drawer */}
      {selected && (
        <OrderDrawer order={selected} onClose={() => setSelected(null)} />
      )}

      {/* Pending order timeline legend */}
      <div className="flex items-center gap-2 text-dark/40 text-xs">
        <Clock size={12} aria-hidden="true" />
        <span>Order status updates via WhatsApp and email.</span>
      </div>
    </div>
  )
}
