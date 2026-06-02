/**
 * Customer account dashboard demo data (UI preview).
 * Replace with API / session data when customer accounts are live.
 */

import type { Booking } from '@/lib/types'
import { MOCK_BOOKINGS, MOCK_ORDERS } from '@/lib/mock-account'

export const ACCOUNT_DEMO_NOTICE =
  'Demo dashboard — sample bookings, orders, and documents shown until your account syncs with live data.'

export interface AccountQuotation {
  id: string
  serviceSlug: string
  serviceTitle: string
  amount: number
  status: 'sent' | 'accepted' | 'expired' | 'draft'
  validUntil: string
  createdAt: string
}

export interface AccountInvoice {
  id: string
  title: string
  amount: number
  status: 'due' | 'paid' | 'pending_verification'
  relatedTo: string
  dueDate?: string
  paidAt?: string
}

export interface FollowUpEvent {
  id: string
  date: string
  title: string
  description: string
  status: 'upcoming' | 'completed' | 'scheduled'
}

export interface LoyaltyPreview {
  label: string
  points: number
  pointsToNext: number
  perk: string
  comingSoon: boolean
}

export interface SavedProfilePreview {
  phone: string
  city: string
  address: string
}

export const DEMO_SAVED_PROFILE: SavedProfilePreview = {
  phone: '0704 488 188',
  city: 'Parklands, Nairobi',
  address: 'Apt 4B, Parklands Avenue',
}

export const DEMO_LOYALTY: LoyaltyPreview = {
  label: 'Founding client preview',
  points: 120,
  pointsToNext: 200,
  perk: 'KSh 500 off your next organizing session when the program launches',
  comingSoon: true,
}

export const DEMO_QUOTATIONS: AccountQuotation[] = [
  {
    id: 'QUO-2401',
    serviceSlug: 'storage-design-installation',
    serviceTitle: 'Storage Design & Installation',
    amount: 45000,
    status: 'sent',
    validUntil: '2026-06-20',
    createdAt: '2026-05-28T10:00:00.000Z',
  },
  {
    id: 'QUO-2388',
    serviceSlug: 'relocation-transition',
    serviceTitle: 'Relocation & Transition Services',
    amount: 82000,
    status: 'accepted',
    validUntil: '2026-05-15',
    createdAt: '2026-04-30T14:00:00.000Z',
  },
]

export const DEMO_INVOICES: AccountInvoice[] = [
  {
    id: 'INV-8842',
    title: 'Site visit fee',
    amount: 3000,
    status: 'paid',
    relatedTo: 'BK-230891',
    paidAt: '2026-05-20',
  },
  {
    id: 'INV-8901',
    title: 'Organizing session — deposit',
    amount: 22500,
    status: 'due',
    relatedTo: 'QUO-2401',
    dueDate: '2026-06-12',
  },
  {
    id: 'INV-8910',
    title: 'Shop order ORD-C2J9T7',
    amount: 18500,
    status: 'pending_verification',
    relatedTo: 'ORD-C2J9T7',
    dueDate: '2026-06-05',
  },
]

export const DEMO_FOLLOW_UP: FollowUpEvent[] = [
  {
    id: 'fu-1',
    date: '2026-06-09',
    title: 'Site visit reminder',
    description: 'WhatsApp reminder 24 hours before your Monday site visit.',
    status: 'upcoming',
  },
  {
    id: 'fu-2',
    date: '2026-06-16',
    title: 'Post-visit check-in',
    description: 'Faith’s team follows up on systems and any open questions.',
    status: 'scheduled',
  },
  {
    id: 'fu-3',
    date: '2026-05-22',
    title: 'Quote sent',
    description: 'Storage design quotation QUO-2401 shared for your review.',
    status: 'completed',
  },
]

export function getUpcomingBooking(bookings: Booking[]): Booking | undefined {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return bookings
    .filter((b) => ['new', 'confirmed', 'quoted'].includes(b.status))
    .filter((b) => {
      const d = new Date(b.date + 'T12:00:00')
      return d >= today
    })
    .sort((a, b) => a.date.localeCompare(b.date))[0]
}

export function getRecentOrders(limit = 3) {
  return [...MOCK_ORDERS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

/** Dashboard uses mock account exports */
export { MOCK_BOOKINGS, MOCK_ORDERS }
