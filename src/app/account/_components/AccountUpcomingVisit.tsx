'use client'

import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import AccountSectionHeader from '@/components/account/AccountSectionHeader'
import AccountEmptyState from '@/components/account/AccountEmptyState'
import { MOCK_BOOKINGS, getUpcomingBooking } from '@/lib/account-dashboard-data'
import { getServiceBySlug, SITE_VISIT } from '@/lib/constants'
import { bookingStatusVariant, formatStatusLabel } from '@/lib/account-status'
import { formatPrice } from '@/lib/utils'

export default function AccountUpcomingVisit() {
  const booking = getUpcomingBooking(MOCK_BOOKINGS)

  return (
    <section className="card-surface border border-dark/8 p-5 sm:p-6">
      <AccountSectionHeader
        title="Upcoming site visit"
        subtitle="Your next scheduled visit with Faith"
        href="/account/bookings"
      />

      {!booking ? (
        <AccountEmptyState
          icon={Calendar}
          title="No upcoming visits"
          description="Book a site visit to get an on-site assessment and personalized plan."
          actionLabel="Book a site visit"
          actionHref="/book"
        />
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl bg-surface border border-dark/8 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Calendar size={22} aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="font-medium text-dark">
              {getServiceBySlug(booking.service)?.title ?? booking.service}
            </p>
            <p className="text-sm text-dark/60">
              {new Date(booking.date + 'T12:00:00').toLocaleDateString('en-KE', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-dark/45 flex items-center gap-1">
              <MapPin size={12} aria-hidden="true" />
              {booking.propertySize} {booking.propertyType} · Ref {booking.id}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <StatusBadge
              label={formatStatusLabel(booking.status)}
              variant={bookingStatusVariant(booking.status)}
            />
            <p className="text-xs text-dark/45">
              Fee {formatPrice(SITE_VISIT.feeKsh)} · preview
            </p>
            <Link href="/book" className="text-xs font-medium text-primary hover:underline">
              Reschedule (preview)
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
