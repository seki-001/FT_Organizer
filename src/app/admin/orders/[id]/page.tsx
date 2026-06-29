'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Printer, ShoppingBag, CreditCard, Package,
  Truck, CheckCircle2, XCircle, Phone, Mail, MapPin,
  MessageCircle, Loader2,
} from 'lucide-react'
import { MOCK_ADMIN_ORDERS } from '@/lib/mock-admin-orders'
import { cn, formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import type { Order } from '@/lib/types'

// ─── Timeline helpers (same logic as slide-over) ──────────────────────────────

const TIMELINE_STEPS = [
  { id: 'placed',     label: 'Order Placed',      icon: ShoppingBag  },
  { id: 'payment',    label: 'Payment Confirmed', icon: CreditCard   },
  { id: 'packed',     label: 'Packed',            icon: Package      },
  { id: 'dispatched', label: 'Dispatched',        icon: Truck        },
  { id: 'delivered',  label: 'Delivered',         icon: CheckCircle2 },
] as const

type StepState = 'done' | 'active' | 'pending'

function getStepState(stepId: string, order: Order): StepState {
  if (order.orderStatus === 'cancelled') return stepId === 'placed' ? 'done' : 'pending'
  switch (stepId) {
    case 'placed':     return 'done'
    case 'payment':    return order.paymentStatus === 'paid' ? 'done' : 'active'
    case 'packed':
      if (['packed', 'dispatched', 'delivered'].includes(order.orderStatus)) return 'done'
      return order.orderStatus === 'processing' ? 'active' : 'pending'
    case 'dispatched':
      if (['dispatched', 'delivered'].includes(order.orderStatus)) return 'done'
      return order.orderStatus === 'packed' ? 'active' : 'pending'
    case 'delivered':
      if (order.orderStatus === 'delivered') return 'done'
      return order.orderStatus === 'dispatched' ? 'active' : 'pending'
    default: return 'pending'
  }
}

function stepDate(stepId: string, createdAt: string): string | null {
  const offsets: Record<string, number> = {
    placed: 0, payment: 30 * 60_000, packed: 4 * 3_600_000,
    dispatched: 24 * 3_600_000, delivered: 72 * 3_600_000,
  }
  const offset = offsets[stepId]
  if (offset == null) return null
  return new Date(new Date(createdAt).getTime() + offset)
    .toLocaleString('en-KE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

const STATUS_CLASS: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-700',
  packed:     'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  delivered:  'bg-success/15 text-success',
  cancelled:  'bg-danger/15 text-danger',
}
const PAYMENT_CLASS:  Record<string, string> = {
  mpesa: 'bg-green-100 text-green-700',
  card:  'bg-blue-100 text-blue-700',
  cod:   'bg-amber-100 text-amber-700',
}
const PAYMENT_LABEL: Record<string, string> = {
  mpesa: 'M-Pesa', card: 'Card', cod: 'Cash on Delivery',
}
const PSTATUS_CLASS: Record<string, string> = {
  paid:    'bg-success/15 text-success',
  pending: 'bg-amber-100 text-amber-700',
  failed:  'bg-danger/15 text-danger',
}
const ORDER_STATUSES = ['processing', 'packed', 'dispatched', 'delivered', 'cancelled'] as const

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize',
      colorClass,
    )}>
      {label}
    </span>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#ECEEF2] bg-muted/20">
        <h2 className="text-xs font-semibold text-dark/50 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function buildWhatsAppUrl(order: Order): string {
  const messages: Record<string, string> = {
    processing: 'is being prepared',
    packed:     'has been packed and is ready for dispatch',
    dispatched: 'is on its way to you 🚚',
    delivered:  'has been delivered. Thank you for shopping with us! 🙏',
    cancelled:  'has been cancelled. Please contact us if you have questions.',
  }
  const firstName = order.customer.name.split(' ')[0]
  const body = [
    `Hi ${firstName},`,
    ``,
    `Your Faith The Organizer order *${order.id}* ${messages[order.orderStatus] ?? 'has been updated'}.`,
    ``,
    `For any questions, reply to this message or call us: ${COMPANY.phone}.`,
    ``,
    `— Faith The Organizer 🌺`,
  ].join('\n')
  const phone = order.customer.phone.replace(/[^\d]/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(body)}`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>()
  const baseOrder = MOCK_ADMIN_ORDERS.find(o => o.id === params.id)
  if (!baseOrder) notFound()

  const [order,     setOrder]     = useState<Order>(baseOrder)
  const [newStatus, setNewStatus] = useState<string>(baseOrder.orderStatus)
  const [updating,  setUpdating]  = useState(false)
  const [updated,   setUpdated]   = useState(false)

  useEffect(() => { setNewStatus(order.orderStatus) }, [order.orderStatus])

  async function handleUpdate() {
    if (newStatus === order.orderStatus) return
    setUpdating(true)
    try {
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      })
      setOrder(prev => ({ ...prev, orderStatus: newStatus as Order['orderStatus'] }))
      setUpdated(true)
      setTimeout(() => setUpdated(false), 3000)
    } finally {
      setUpdating(false)
    }
  }

  const subtotal = order.items.reduce(
    (s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0,
  )
  const discount = Math.max(0, subtotal + order.deliveryFee - order.total)

  return (
    <div className="flex flex-col gap-6 print:gap-4">

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark transition-colors"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back to Orders
          </Link>
          <span className="text-dark/20">/</span>
          <span className="text-sm text-dark font-medium">{order.id}</span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 border border-dark/15 rounded-lg text-sm text-dark/60 hover:border-primary hover:text-primary transition-colors"
        >
          <Printer size={14} aria-hidden="true" />
          Print Order
        </button>
      </div>

      {/* Print header (only visible when printing) */}
      <div className="hidden print:block mb-4">
        <h1 className="text-xl font-bold">Faith The Organizer — Order {order.id}</h1>
        <p className="text-sm text-dark/50 mt-1">
          {new Date(order.createdAt).toLocaleString('en-KE', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      {/* Cancelled banner */}
      {order.orderStatus === 'cancelled' && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-danger/8 rounded-xl border border-danger/20">
          <XCircle size={16} className="text-danger flex-shrink-0" />
          <p className="text-sm font-medium text-danger">This order has been cancelled</p>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left: Items + totals + payment */}
        <div className="xl:col-span-7 flex flex-col gap-6">

          {/* Order items */}
          <SectionCard title="Order Items">
            <div className="flex flex-col divide-y divide-[#ECEEF2]">
              {order.items.map((item, i) => {
                const price = item.product.salePrice ?? item.product.price
                return (
                  <div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
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
                      <p className="font-medium text-dark text-sm">{item.product.name}</p>
                      <p className="text-dark/45 text-xs font-mono mt-0.5">
                        {formatPrice(price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono font-semibold text-dark text-sm flex-shrink-0">
                      {formatPrice(price * item.quantity)}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-[#ECEEF2] flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark/60">Subtotal</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark/60">Delivery ({order.deliveryMethod.replace(/-/g, ' ')})</span>
                <span className="font-mono">
                  {order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Free'}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-success">Discount applied</span>
                  <span className="font-mono text-success">− {formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold pt-2 border-t border-[#ECEEF2]">
                <span className="text-dark">Order Total</span>
                <span className="font-mono text-dark text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </SectionCard>

          {/* Payment */}
          <SectionCard title="Payment Information">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  label={PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                  colorClass={PAYMENT_CLASS[order.paymentMethod] ?? 'bg-muted text-dark/60'}
                />
                <Badge
                  label={order.paymentStatus}
                  colorClass={PSTATUS_CLASS[order.paymentStatus] ?? 'bg-muted text-dark/60'}
                />
              </div>
              <p className="text-sm text-dark/50">
                Delivery method:{' '}
                <span className="capitalize text-dark">{order.deliveryMethod.replace(/-/g, ' ')}</span>
              </p>
            </div>
          </SectionCard>

        </div>

        {/* Right: Customer + timeline + status update */}
        <div className="xl:col-span-5 flex flex-col gap-6">

          {/* Customer */}
          <SectionCard title="Customer Details">
            <div className="flex flex-col gap-2.5">
              <p className="font-semibold text-dark text-base">{order.customer.name}</p>
              <a href={`tel:${order.customer.phone}`}
                className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors">
                <Phone size={13} className="text-dark/35 flex-shrink-0" aria-hidden="true" />
                {order.customer.phone}
              </a>
              <a href={`mailto:${order.customer.email}`}
                className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors">
                <Mail size={13} className="text-dark/35 flex-shrink-0" aria-hidden="true" />
                {order.customer.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-dark/60">
                <MapPin size={13} className="text-dark/35 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{order.customer.address}, {order.customer.city}</span>
              </div>
              {order.customer.notes && (
                <p className="text-xs text-dark/45 italic pl-5">{order.customer.notes}</p>
              )}
            </div>
          </SectionCard>

          {/* Timeline */}
          <SectionCard title="Order Timeline">
            <div className="flex flex-col">
              {TIMELINE_STEPS.map((step, i) => {
                const state  = getStepState(step.id, order)
                const Icon   = step.icon
                const date   = state === 'done' ? stepDate(step.id, order.createdAt) : null
                const isLast = i === TIMELINE_STEPS.length - 1
                return (
                  <div key={step.id} className="flex gap-3.5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center',
                        state === 'done'    && 'bg-success text-white',
                        state === 'active'  && 'bg-primary text-white',
                        state === 'pending' && 'bg-muted text-dark/30',
                      )}>
                        {state === 'done'
                          ? <CheckCircle2 size={14} aria-hidden="true" />
                          : <Icon size={14} aria-hidden="true" />
                        }
                      </div>
                      {!isLast && (
                        <div className={cn(
                          'w-px flex-1 min-h-[20px] my-0.5',
                          state === 'done' ? 'bg-success/30' : 'bg-dark/8',
                        )} />
                      )}
                    </div>
                    <div className={cn('pt-1 min-w-0', isLast ? 'pb-0' : 'pb-4')}>
                      <p className={cn(
                        'text-sm font-medium leading-none',
                        state === 'done'    && 'text-dark',
                        state === 'active'  && 'text-primary font-semibold',
                        state === 'pending' && 'text-dark/30',
                      )}>
                        {step.label}
                        {state === 'active' && (
                          <span className="ml-2 text-xs font-normal text-primary/60">In progress</span>
                        )}
                      </p>
                      {date && <p className="text-xs text-dark/40 mt-0.5">{date}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>

          {/* Status update */}
          <SectionCard title="Update Status">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  aria-label="Select new order status"
                  className="flex-1 appearance-none bg-muted border border-dark/10 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer capitalize"
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={updating || newStatus === order.orderStatus}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex-shrink-0',
                    newStatus === order.orderStatus || updating
                      ? 'bg-muted text-dark/30 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90',
                  )}
                >
                  {updating && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                  {updating ? 'Saving…' : 'Update'}
                </button>
              </div>
              {updated && (
                <p className="text-xs text-success flex items-center gap-1.5">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Status updated successfully
                </p>
              )}
            </div>
          </SectionCard>

          {/* WhatsApp customer */}
          <a
            href={buildWhatsAppUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors print:hidden"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Send WhatsApp Update to Customer
          </a>

        </div>
      </div>
    </div>
  )
}
