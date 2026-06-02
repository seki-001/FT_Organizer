/**
 * Demo data for admin dashboard (Stage 12).
 * Preview only — not connected to live financial actions.
 */

import type { RevenueSeries } from '@/lib/mock-analytics'
import {
  ADMIN_KPI,
  ADMIN_RECENT_ORDERS,
  ADMIN_PENDING_BOOKINGS,
  ADMIN_LOW_STOCK,
} from '@/lib/mock-admin-data'

export const ADMIN_DASHBOARD_DEMO_NOTICE =
  'Dashboard preview uses sample data. Charts and totals are for layout review only — no payments or invoices are processed from this screen.'

export { ADMIN_KPI, ADMIN_RECENT_ORDERS, ADMIN_PENDING_BOOKINGS, ADMIN_LOW_STOCK }

// ─── KPI extended ─────────────────────────────────────────────────────────────

export const ADMIN_DASHBOARD_KPI = {
  ...ADMIN_KPI,
  revenueToday: 12_400,
  revenueTodayChange: 8,
  shopRevenueMonth: 52_300,
  serviceRevenueMonth: 35_200,
  outstandingInvoices: 48_600,
  overdueInvoices: 3,
  debtorBalance: 124_800,
  expensesMonth: 18_400,
  purchasesMonth: 22_100,
  followUpCompletionPct: 72,
  lowStockCount: ADMIN_LOW_STOCK.length,
  paymentsPending: 5,
}

export const KPI_SPARKLINES = {
  revenue: [28, 31, 25, 38, 32, 41, 36, 45],
  orders: [18, 20, 19, 22, 21, 24, 23, 26],
  bookings: [4, 6, 5, 7, 6, 8, 7, 9],
  customers: [120, 125, 128, 131, 135, 138, 140, 143],
}

// ─── Charts ───────────────────────────────────────────────────────────────────

export const DASHBOARD_REVENUE_SERIES: RevenueSeries[] = [
  { label: 'Jan 6', shop: 18_200, service: 12_400 },
  { label: 'Jan 13', shop: 21_500, service: 14_800 },
  { label: 'Jan 20', shop: 19_800, service: 11_200 },
  { label: 'Jan 27', shop: 24_100, service: 16_500 },
  { label: 'Feb 3', shop: 22_400, service: 15_900 },
  { label: 'Feb 10', shop: 26_800, service: 18_200 },
  { label: 'Feb 17', shop: 25_300, service: 17_600 },
  { label: 'Feb 24', shop: 28_900, service: 19_400 },
]

export const SERVICE_VS_PRODUCT_MONTH = [
  { name: 'Shop products', value: ADMIN_DASHBOARD_KPI.shopRevenueMonth, color: '#CC1212' },
  { name: 'Services', value: ADMIN_DASHBOARD_KPI.serviceRevenueMonth, color: '#E8A020' },
]

export const BOOKINGS_BY_WEEK = [
  { week: 'W1', bookings: 4, confirmed: 3 },
  { week: 'W2', bookings: 6, confirmed: 5 },
  { week: 'W3', bookings: 5, confirmed: 4 },
  { week: 'W4', bookings: 8, confirmed: 6 },
  { week: 'W5', bookings: 7, confirmed: 6 },
  { week: 'W6', bookings: 9, confirmed: 7 },
  { week: 'W7', bookings: 6, confirmed: 5 },
  { week: 'W8', bookings: 10, confirmed: 8 },
]

export const EXPENSES_VS_PURCHASES = [
  { month: 'Oct', expenses: 14_200, purchases: 19_800 },
  { month: 'Nov', expenses: 16_500, purchases: 21_400 },
  { month: 'Dec', expenses: 15_800, purchases: 24_600 },
  { month: 'Jan', expenses: 17_200, purchases: 20_300 },
  { month: 'Feb', expenses: 18_400, purchases: 22_100 },
]

export const PAYMENT_STATUS_SLICES = [
  { status: 'Paid', count: 42, color: '#2D7A47' },
  { status: 'Pending', count: 8, color: '#E8A020' },
  { status: 'Failed', count: 2, color: '#991010' },
  { status: 'Refunded', count: 3, color: '#9CA3AF' },
]

export const DEBTOR_SLICES = [
  { status: 'Current', count: 18, color: '#2D7A47' },
  { status: '30 days', count: 7, color: '#E8A020' },
  { status: '60+ days', count: 4, color: '#991010' },
]

export const REGIONAL_PERFORMANCE = [
  { area: 'Westlands', revenue: 186_000 },
  { area: 'Karen', revenue: 142_500 },
  { area: 'Kilimani', revenue: 128_400 },
  { area: 'Runda', revenue: 98_200 },
  { area: 'South B', revenue: 76_800 },
  { area: 'Parklands', revenue: 64_300 },
]

export const FOLLOW_UP_COMPLETION = [
  { week: 'W1', completed: 8, total: 12 },
  { week: 'W2', completed: 10, total: 14 },
  { week: 'W3', completed: 9, total: 11 },
  { week: 'W4', completed: 11, total: 13 },
  { week: 'W5', completed: 12, total: 15 },
  { week: 'W6', completed: 14, total: 16 },
]

// ─── Activity feed ────────────────────────────────────────────────────────────

export type DashboardActivityType =
  | 'order'
  | 'booking'
  | 'payment'
  | 'invoice'
  | 'stock'
  | 'follow_up'

export interface DashboardActivity {
  id: string
  type: DashboardActivityType
  message: string
  detail?: string
  timeAgo: string
}

export const DASHBOARD_ACTIVITY: DashboardActivity[] = [
  { id: 'a1', type: 'order', message: 'New order ORD-F9K2P4', detail: 'Wanjiku Kamau · Westlands', timeAgo: '12 min ago' },
  { id: 'a2', type: 'booking', message: 'Booking confirmed BK-884721', detail: 'Whole House · Apr 8', timeAgo: '1 hr ago' },
  { id: 'a3', type: 'payment', message: 'M-Pesa payment received', detail: 'KSh 6,500 · John Mutiso', timeAgo: '2 hr ago' },
  { id: 'a4', type: 'invoice', message: 'Invoice INV-2041 overdue', detail: 'Grace Njeri · KSh 12,800', timeAgo: '3 hr ago' },
  { id: 'a5', type: 'stock', message: 'Low stock alert', detail: 'Fruit & Vegetable Holder — 1 left', timeAgo: '5 hr ago' },
  { id: 'a6', type: 'follow_up', message: 'Follow-up completed', detail: 'Post-visit check-in · Mary Waweru', timeAgo: 'Yesterday' },
  { id: 'a7', type: 'order', message: 'Order dispatched ORD-G1M4L9', detail: 'Grace Njeri · Runda', timeAgo: 'Yesterday' },
  { id: 'a8', type: 'booking', message: 'New booking request', detail: 'General Decluttering · Samuel Ndungu', timeAgo: '2 days ago' },
]

// ─── Monday bookings ──────────────────────────────────────────────────────────

export interface MondayBooking {
  id: string
  customer: string
  service: string
  time: string
  area: string
  status: 'confirmed' | 'new' | 'quoted'
}

export const MONDAY_BOOKINGS: MondayBooking[] = [
  { id: 'BK-M01', customer: 'Mary Waweru', service: 'Whole House Organizing', time: '9:00 AM', area: 'Runda', status: 'confirmed' },
  { id: 'BK-M02', customer: 'Samuel Ndungu', service: 'General Decluttering', time: '11:30 AM', area: 'South B', status: 'new' },
  { id: 'BK-M03', customer: 'Priya Patel', service: 'Office Organizing', time: '2:00 PM', area: 'Westlands', status: 'quoted' },
]

// ─── Overdue invoices ─────────────────────────────────────────────────────────

export interface OverdueInvoice {
  id: string
  client: string
  amount: number
  dueDate: string
  daysOverdue: number
}

export const OVERDUE_INVOICES: OverdueInvoice[] = [
  { id: 'INV-2038', client: 'Grace Njeri', amount: 12_800, dueDate: 'May 18, 2026', daysOverdue: 14 },
  { id: 'INV-2029', client: 'Brian Otieno', amount: 8_400, dueDate: 'May 22, 2026', daysOverdue: 10 },
  { id: 'INV-2015', client: 'Ruth Chebet', amount: 5_200, dueDate: 'May 28, 2026', daysOverdue: 4 },
]

// ─── Recent payments ──────────────────────────────────────────────────────────

export interface RecentPayment {
  id: string
  client: string
  amount: number
  method: string
  status: 'paid' | 'pending' | 'failed'
  timeAgo: string
}

export const RECENT_PAYMENTS: RecentPayment[] = [
  { id: 'PAY-8821', client: 'John Mutiso', amount: 6_500, method: 'M-Pesa', status: 'paid', timeAgo: '2 hr ago' },
  { id: 'PAY-8819', client: 'Fatuma Hassan', amount: 5_100, method: 'Card', status: 'paid', timeAgo: '1 day ago' },
  { id: 'PAY-8814', client: 'James Kariuki', amount: 8_900, method: 'M-Pesa', status: 'pending', timeAgo: '1 day ago' },
  { id: 'PAY-8808', client: 'Esther Wangari', amount: 1_950, method: 'M-Pesa', status: 'failed', timeAgo: '2 days ago' },
]

// ─── Quick actions (navigation only) ──────────────────────────────────────────

export const DASHBOARD_QUICK_ACTIONS = [
  { label: 'New booking', href: '/admin/bookings', description: 'Review calendar requests' },
  { label: 'Add product', href: '/admin/products/new', description: 'Catalogue a new item' },
  { label: 'View clients', href: '/admin/customers', description: 'Customer directory' },
  { label: 'Open reports', href: '/admin/reports', description: 'Analytics & exports' },
] as const
