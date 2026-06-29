'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MessageCircle, Home, Briefcase, Building2 } from 'lucide-react'
import { MOCK_BOOKINGS } from '@/lib/mock-account'
import { SERVICES, COMPANY } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Booking } from '@/lib/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const map: Record<Booking['status'], string> = {
    new:       'bg-accent/20 text-amber-700',
    quoted:    'bg-accent/20 text-amber-700',
    confirmed: 'bg-success/20 text-success',
    completed: 'bg-muted text-dark/60',
    cancelled: 'bg-danger/20 text-danger',
  }
  const labels: Record<Booking['status'], string> = {
    new:       'Awaiting Quote',
    quoted:    'Quote Sent',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return (
    <span className={cn('inline-flex px-2.5 py-1 rounded-full text-xs font-semibold', map[status])}>
      {labels[status]}
    </span>
  )
}

const PROPERTY_ICONS = {
  apartment: Building2,
  house:     Home,
  office:    Briefcase,
}

const SIZE_LABELS: Record<string, string> = {
  small:  'Small (1–2 rooms)',
  medium: 'Medium (3–4 rooms)',
  large:  'Large (5+ rooms)',
}

// ─── Booking card ─────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: Booking }) {
  const service  = SERVICES.find((s) => s.slug === booking.service)
  const PropIcon = PROPERTY_ICONS[booking.propertyType]

  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-dark leading-tight">
              {service?.title ?? booking.service}
            </p>
            <p className="text-dark/40 text-xs mt-0.5">
              Booked on {new Date(booking.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div className="flex flex-col gap-0.5">
          <span className="text-dark/40 text-xs uppercase tracking-wide">Date Requested</span>
          <span className="text-dark font-medium">{formatDate(booking.date)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-dark/40 text-xs uppercase tracking-wide">Property</span>
          <span className="text-dark font-medium flex items-center gap-1.5">
            <PropIcon size={14} className="text-dark/40" aria-hidden="true" />
            {booking.propertyType.charAt(0).toUpperCase() + booking.propertyType.slice(1)}
            {' · '}
            {SIZE_LABELS[booking.propertySize]}
          </span>
        </div>
      </div>

      {/* Notes */}
      {booking.notes && (
        <div className="bg-muted rounded-lg px-4 py-3">
          <p className="text-xs text-dark/40 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-dark/70 leading-relaxed">{booking.notes}</p>
        </div>
      )}

      {/* WhatsApp follow-up */}
      {(booking.status === 'new' || booking.status === 'confirmed') && (
        <a
          href={COMPANY.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium py-2.5 rounded-lg transition-colors duration-150 min-h-[44px]"
        >
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp to follow up
        </a>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/account/bookings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { bookings?: Booking[] } | null) => {
        if (d?.bookings) setBookings(d.bookings)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-dark">My Bookings</h1>
        <Link
          href="/book"
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors min-h-[36px] flex items-center"
        >
          + New Booking
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-12 text-center text-dark/50 text-sm">
          Loading your bookings…
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dark/8 shadow-sm p-12 text-center flex flex-col items-center gap-4">
          <Calendar size={48} className="text-dark/20" aria-hidden="true" />
          <p className="text-dark/50">No bookings yet.</p>
          <Link href="/book" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Book a Service
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
