'use client'

import { useEffect, useState } from 'react'
import { X, Phone, Mail, MapPin, Calendar, ShoppingBag, Wrench, MessageCircle, ExternalLink, type LucideIcon } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import type { Customer, CustomerOrder, CustomerBooking } from '@/lib/mock-admin-customers'

// ─── Status badges ─────────────────────────────────────────────────────────────

const ORDER_STATUS_STYLES: Record<CustomerOrder['status'], string> = {
  processing: 'bg-blue-100 text-blue-700',
  packed:     'bg-amber-100 text-amber-700',
  dispatched: 'bg-primary/10 text-primary',
  delivered:  'bg-success/10 text-success',
  cancelled:  'bg-danger/10 text-danger',
}

const BOOKING_STATUS_STYLES: Record<CustomerBooking['status'], string> = {
  new:       'bg-blue-100 text-blue-700',
  quoted:    'bg-amber-100 text-amber-700',
  confirmed: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(str: string) {
  return new Date(str).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Returns initials from a full name (max 2) */
function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

/** Builds a WhatsApp link with pre-filled message greeting */
function buildWhatsappUrl(name: string) {
  const firstName = name.split(' ')[0]
  const message   = encodeURIComponent(`Hi ${firstName}! This is Faith from Faith The Organizer. How can I help you today?`)
  return `${COMPANY.whatsappLink}&text=${message}`
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted/30 rounded-xl p-4 text-center">
      <p className="font-display text-xl font-bold text-dark">{value}</p>
      <p className="text-xs text-dark/45 mt-0.5">{label}</p>
    </div>
  )
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={13} className="text-primary" />
      <h3 className="text-xs font-semibold text-dark/50 uppercase tracking-wider">{children}</h3>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  customerId: string | null
  onClose:    () => void
}

export default function CustomerSlideOver({ customerId, onClose }: Props) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading,  setLoading]  = useState(false)

  const open = !!customerId

  useEffect(() => {
    if (!customerId) { setCustomer(null); return }
    setLoading(true)
    fetch(`/api/admin/customers/${customerId}`)
      .then(r => r.json())
      .then((d: { customer: Customer }) => setCustomer(d.customer))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [customerId])

  // Body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  const avgOrder = customer && customer.totalOrders > 0
    ? Math.round(customer.totalSpent / customer.totalOrders)
    : 0

  const last5Orders   = (customer?.orders ?? []).slice(0, 5)
  const last3Bookings = (customer?.bookings ?? []).slice(0, 3)

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn('fixed inset-0 bg-dark/30 backdrop-blur-sm z-40 transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-label="Customer details"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dark/8 flex-shrink-0">
          <h2 className="font-semibold text-dark">Customer Details</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-dark hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !customer ? (
            <p className="text-center text-dark/40 text-sm py-16">Customer not found.</p>
          ) : (
            <div className="p-6 flex flex-col gap-6">

              {/* Profile */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold font-display text-lg">{getInitials(customer.name)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-dark">{customer.name}</h3>
                  <p className="text-sm text-dark/50 truncate">{customer.area}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-dark/60 hover:text-primary transition-colors truncate max-w-[200px]">
                      <Mail size={12} />{customer.email}
                    </a>
                    <a href={`tel:${customer.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-dark/60 hover:text-primary transition-colors">
                      <Phone size={12} />{customer.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-dark/40 mt-1">
                    <Calendar size={11} />
                    Joined {formatDate(customer.joinedAt)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Total Orders"   value={String(customer.totalOrders)} />
                <StatCard label="Total Spent"    value={formatPrice(customer.totalSpent)} />
                <StatCard label="Avg Order"      value={formatPrice(avgOrder)} />
              </div>

              {/* Order history */}
              <div>
                <SectionHeading icon={ShoppingBag}>Recent Orders</SectionHeading>
                {last5Orders.length === 0 ? (
                  <p className="text-sm text-dark/35 italic">No orders yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-dark/5">
                    {last5Orders.map(order => (
                      <div key={order.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-mono font-bold text-dark">{order.id}</p>
                          <p className="text-xs text-dark/50 truncate mt-0.5">{order.items}</p>
                          <p className="text-xs text-dark/35 mt-0.5">{formatDate(order.date)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-sm font-semibold text-dark">{formatPrice(order.amount)}</span>
                          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', ORDER_STATUS_STYLES[order.status])}>
                            {capitalize(order.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking history */}
              <div>
                <SectionHeading icon={Wrench}>Bookings</SectionHeading>
                {last3Bookings.length === 0 ? (
                  <p className="text-sm text-dark/35 italic">No bookings yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-dark/5">
                    {last3Bookings.map(booking => (
                      <div key={booking.id} className="py-2.5 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm text-dark font-medium truncate">{booking.service}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-dark/40">
                            <Calendar size={10} />{formatDate(booking.date)}
                            <span className="text-dark/20">·</span>
                            <MapPin size={10} />{capitalize(booking.propertyType)}
                          </div>
                        </div>
                        <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0', BOOKING_STATUS_STYLES[booking.status])}>
                          {capitalize(booking.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={buildWhatsappUrl(customer.name)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors"
                >
                  <MessageCircle size={15} />
                  Send WhatsApp Message
                  <ExternalLink size={12} className="opacity-60" />
                </a>
                <a
                  href={`tel:${customer.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dark/15 text-dark text-sm font-medium rounded-xl hover:bg-muted transition-colors"
                >
                  <Phone size={14} />
                  Call {customer.name.split(' ')[0]}
                </a>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  )
}
