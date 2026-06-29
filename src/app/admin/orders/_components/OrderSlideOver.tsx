'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, ShoppingBag, CreditCard, Package, Truck, CheckCircle2,
  XCircle, Phone, Mail, MapPin, MessageCircle, Loader2,
  ExternalLink,
} from 'lucide-react'
import type { Order } from '@/lib/types'
import { cn, formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

// ─── Timeline config ──────────────────────────────────────────────────────────

interface TimelineStep {
  id:    string
  label: string
  icon:  React.ElementType
}

const TIMELINE_STEPS: TimelineStep[] = [
  { id: 'placed',     label: 'Order Placed',       icon: ShoppingBag  },
  { id: 'payment',    label: 'Payment Confirmed',  icon: CreditCard   },
  { id: 'packed',     label: 'Packed',             icon: Package      },
  { id: 'dispatched', label: 'Dispatched',         icon: Truck        },
  { id: 'delivered',  label: 'Delivered',          icon: CheckCircle2 },
]

type StepState = 'done' | 'active' | 'pending'

function getStepState(stepId: string, order: Order): StepState {
  if (order.orderStatus === 'cancelled') {
    return stepId === 'placed' ? 'done' : 'pending'
  }
  switch (stepId) {
    case 'placed':
      return 'done'
    case 'payment':
      return order.paymentStatus === 'paid' ? 'done' : 'active'
    case 'packed':
      if (['packed', 'dispatched', 'delivered'].includes(order.orderStatus)) return 'done'
      if (order.orderStatus === 'processing') return 'active'
      return 'pending'
    case 'dispatched':
      if (['dispatched', 'delivered'].includes(order.orderStatus)) return 'done'
      if (order.orderStatus === 'packed') return 'active'
      return 'pending'
    case 'delivered':
      if (order.orderStatus === 'delivered') return 'done'
      if (order.orderStatus === 'dispatched') return 'active'
      return 'pending'
    default:
      return 'pending'
  }
}

/** Generates an approximate timestamp for each completed step */
function stepDate(stepId: string, createdAt: string): string | null {
  const offsets: Record<string, number> = {
    placed:     0,
    payment:    30 * 60_000,         // +30 min
    packed:     4 * 3_600_000,       // +4 hrs
    dispatched: 24 * 3_600_000,      // +1 day
    delivered:  72 * 3_600_000,      // +3 days
  }
  const offset = offsets[stepId]
  if (offset == null) return null
  return new Date(new Date(createdAt).getTime() + offset)
    .toLocaleString('en-KE', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fullDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

const PAYMENT_LABEL: Record<string, string> = {
  mpesa: 'M-Pesa', card: 'Card', cod: 'Cash on Delivery',
}
const PAYMENT_CLASS: Record<string, string> = {
  mpesa: 'bg-green-100 text-green-700',
  card:  'bg-blue-100 text-blue-700',
  cod:   'bg-amber-100 text-amber-700',
}
const PSTATUS_CLASS: Record<string, string> = {
  paid:    'bg-success/15 text-success',
  pending: 'bg-amber-100 text-amber-700',
  failed:  'bg-danger/15 text-danger',
}
const ORDER_STATUSES = [
  'processing', 'packed', 'dispatched', 'delivered', 'cancelled',
] as const

function buildWhatsAppUrl(order: Order): string {
  const messages: Record<string, string> = {
    processing: 'is being prepared — we will update you soon',
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

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <p className="text-[10px] font-semibold text-dark/35 uppercase tracking-widest whitespace-nowrap">
        {label}
      </p>
      <div className="flex-1 h-px bg-dark/8" />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  order:          Order | null
  onClose:        () => void
  onStatusUpdate: (orderId: string, newStatus: string) => void
}

export default function OrderSlideOver({ order, onClose, onStatusUpdate }: Props) {
  const [newStatus, setNewStatus] = useState<string>(order?.orderStatus ?? 'processing')
  const [updating,  setUpdating]  = useState(false)

  // Sync dropdown when order or its status changes
  useEffect(() => {
    if (order) setNewStatus(order.orderStatus)
  }, [order?.id, order?.orderStatus])

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = order ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [order])

  async function handleUpdate() {
    if (!order || newStatus === order.orderStatus) return
    setUpdating(true)
    try {
      await fetch(`/api/admin/orders/${order.id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      })
      onStatusUpdate(order.id, newStatus)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[520px] bg-white shadow-2xl flex flex-col"
            aria-label="Order details"
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-b border-[#ECEEF2] flex items-start justify-between gap-4 flex-shrink-0">
              <div>
                <p className="font-mono text-sm font-bold text-primary">{order.id}</p>
                <p className="text-dark/50 text-xs mt-0.5">{fullDateTime(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-1 text-xs text-dark/40 hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted"
                >
                  Full page <ExternalLink size={11} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close order details"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-dark/40 hover:bg-muted hover:text-dark transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* ── Scrollable body ─────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-5 flex flex-col gap-6">

                {/* Cancelled banner */}
                {order.orderStatus === 'cancelled' && (
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-danger/8 rounded-xl border border-danger/20">
                    <XCircle size={16} className="text-danger flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-danger">This order has been cancelled</p>
                  </div>
                )}

                {/* Customer */}
                <div>
                  <SectionHeader label="Customer" />
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-dark">{order.customer.name}</p>
                    <div className="flex flex-col gap-1.5">
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors"
                      >
                        <Phone size={13} className="flex-shrink-0 text-dark/35" aria-hidden="true" />
                        {order.customer.phone}
                      </a>
                      <a
                        href={`mailto:${order.customer.email}`}
                        className="flex items-center gap-2 text-sm text-dark/60 hover:text-primary transition-colors"
                      >
                        <Mail size={13} className="flex-shrink-0 text-dark/35" aria-hidden="true" />
                        {order.customer.email}
                      </a>
                      <div className="flex items-start gap-2 text-sm text-dark/60">
                        <MapPin size={13} className="flex-shrink-0 text-dark/35 mt-0.5" aria-hidden="true" />
                        <span>{order.customer.address}, {order.customer.city}</span>
                      </div>
                      {order.customer.notes && (
                        <p className="text-xs text-dark/45 italic mt-1 pl-5">{order.customer.notes}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <SectionHeader label="Order Items" />
                  <div className="flex flex-col divide-y divide-[#ECEEF2] border border-[#ECEEF2] rounded-lg overflow-hidden">
                    {order.items.map((item, i) => {
                      const price = item.product.salePrice ?? item.product.price
                      return (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark truncate">{item.product.name}</p>
                            <p className="text-xs text-dark/45 font-mono">
                              {formatPrice(price)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-mono font-semibold text-dark flex-shrink-0">
                            {formatPrice(price * item.quantity)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div>
                  <SectionHeader label="Order Totals" />
                  <div className="flex flex-col gap-2">
                    {(() => {
                      const subtotal  = order.items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0)
                      const discount  = Math.max(0, subtotal + order.deliveryFee - order.total)
                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-dark/60">Subtotal</span>
                            <span className="font-mono">{formatPrice(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-dark/60">Delivery</span>
                            <span className="font-mono">
                              {order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : 'Free'}
                            </span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-success">Discount</span>
                              <span className="font-mono text-success">− {formatPrice(discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-sm pt-2 border-t border-[#ECEEF2]">
                            <span className="text-dark">Total</span>
                            <span className="font-mono text-dark text-base">{formatPrice(order.total)}</span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <SectionHeader label="Payment" />
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                      PAYMENT_CLASS[order.paymentMethod] ?? 'bg-muted text-dark/60',
                    )}>
                      {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                    </span>
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                      PSTATUS_CLASS[order.paymentStatus] ?? 'bg-muted text-dark/60',
                    )}>
                      {order.paymentStatus}
                    </span>
                    <span className="text-xs text-dark/40 capitalize">
                      {order.deliveryMethod.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <SectionHeader label="Order Timeline" />
                  <div className="flex flex-col">
                    {TIMELINE_STEPS.map((step, i) => {
                      const state   = getStepState(step.id, order)
                      const Icon    = step.icon
                      const date    = state === 'done' ? stepDate(step.id, order.createdAt) : null
                      const isLast  = i === TIMELINE_STEPS.length - 1

                      return (
                        <div key={step.id} className="flex gap-3.5">
                          {/* Icon + line */}
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                              state === 'done'   && 'bg-success text-white',
                              state === 'active' && 'bg-primary text-white',
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

                          {/* Label + date */}
                          <div className={cn('pb-4', isLast && 'pb-0', 'pt-1 min-w-0')}>
                            <p className={cn(
                              'text-sm font-medium leading-none',
                              state === 'done'    && 'text-dark',
                              state === 'active'  && 'text-primary font-semibold',
                              state === 'pending' && 'text-dark/30',
                            )}>
                              {step.label}
                              {state === 'active' && (
                                <span className="ml-2 text-xs font-normal text-primary/60">
                                  In progress
                                </span>
                              )}
                            </p>
                            {date && (
                              <p className="text-xs text-dark/40 mt-0.5">{date}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-[#ECEEF2] flex flex-col gap-3 flex-shrink-0 bg-white">

              {/* Status update */}
              <div>
                <p className="text-[10px] font-semibold text-dark/35 uppercase tracking-widest mb-2">
                  Update Status
                </p>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 appearance-none bg-muted border border-dark/10 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer capitalize"
                    aria-label="Select new order status"
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
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex-shrink-0',
                      newStatus === order.orderStatus || updating
                        ? 'bg-muted text-dark/30 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90',
                    )}
                  >
                    {updating && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                    {updating ? 'Saving…' : 'Update'}
                  </button>
                </div>
              </div>

              {/* WhatsApp customer */}
              <a
                href={buildWhatsAppUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
              >
                <MessageCircle size={15} aria-hidden="true" />
                Send WhatsApp Update to Customer
              </a>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
