import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import { SERVICES } from '@/lib/constants'
import { emptyAnalyticsPeriod } from '@/lib/analytics-types'
import type { AdminOverview } from '@/lib/db/analytics-shapes'
import type {
  AnalyticsPeriod, CategoryRevenue, DateRange, OrderStatusSlice, RevenueSeries,
  ServiceBookings, TopProductRow, AreaRow,
} from '@/lib/analytics-types'
import { BRAND } from '@/lib/brand-colors'

const RANGE_DAYS: Record<DateRange, number> = { '7d': 7, '30d': 30, '3m': 90, '1y': 365 }

const STATUS_COLORS: Record<string, string> = {
  delivered: '#2D7A47', processing: BRAND.accent, dispatched: '#6366F1', packed: '#3B82F6', cancelled: '#991010',
}

const DAY = 86_400_000

function pct(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0
  return Math.round(((curr - prev) / prev) * 100)
}

function titleCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function bucketKey(date: Date, range: DateRange): { key: string; label: string } {
  if (range === '1y') {
    const key = date.toISOString().slice(0, 7)
    return { key, label: date.toLocaleDateString('en-KE', { month: 'short' }) }
  }
  if (range === '3m') {
    const monday = new Date(date); monday.setDate(date.getDate() - ((date.getDay() + 6) % 7))
    const key = monday.toISOString().slice(0, 10)
    return { key, label: monday.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) }
  }
  const key = date.toISOString().slice(0, 10)
  return { key, label: date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }) }
}

const emptyAnalytics = emptyAnalyticsPeriod

/** Real analytics computed from orders, bookings, order items and profiles. */
export async function getAnalytics(range: DateRange): Promise<AnalyticsPeriod> {
  if (!isSupabaseAdminConfigured()) return emptyAnalytics()
  const admin = createAdminClient()

  const now = Date.now()
  const span = RANGE_DAYS[range] * DAY
  const start = new Date(now - span)
  const prevStart = new Date(now - 2 * span)

  const [ordersRes, bookingsRes, profilesRes, productsRes] = await Promise.all([
    admin.from('orders').select('id, total, order_status, payment_status, customer_email, customer_city, created_at')
      .gte('created_at', prevStart.toISOString()),
    admin.from('bookings').select('service_slug, quote_amount, status, created_at').gte('created_at', prevStart.toISOString()),
    admin.from('profiles').select('created_at').eq('role', 'customer').gte('created_at', prevStart.toISOString()),
    admin.from('products').select('slug, category'),
  ])
  if (ordersRes.error) throw ordersRes.error
  if (bookingsRes.error) throw bookingsRes.error

  const allOrders = ordersRes.data ?? []
  const allBookings = bookingsRes.data ?? []
  const inRange = <T extends { created_at: string }>(r: T) => new Date(r.created_at) >= start
  const inPrev = <T extends { created_at: string }>(r: T) => new Date(r.created_at) < start

  const counted = (o: { order_status: string; payment_status: string }) =>
    o.order_status !== 'cancelled' && o.payment_status !== 'failed'

  const orders = allOrders.filter(inRange)
  const prevOrders = allOrders.filter(inPrev)
  const bookings = allBookings.filter(inRange)
  const prevBookings = allBookings.filter(inPrev)
  const earnedBooking = (b: { status: string; quote_amount: number | null }) =>
    (b.status === 'confirmed' || b.status === 'completed') ? Number(b.quote_amount ?? 0) : 0

  const shopRevenue = orders.filter(counted).reduce((s, o) => s + Number(o.total), 0)
  const prevShopRevenue = prevOrders.filter(counted).reduce((s, o) => s + Number(o.total), 0)
  const serviceRevenue = bookings.reduce((s, b) => s + earnedBooking(b), 0)
  const prevServiceRevenue = prevBookings.reduce((s, b) => s + earnedBooking(b), 0)
  const revenue = shopRevenue + serviceRevenue
  const prevRevenue = prevShopRevenue + prevServiceRevenue

  const countedOrders = orders.filter(counted)
  const prevCountedOrders = prevOrders.filter(counted)
  const avg = countedOrders.length ? Math.round(shopRevenue / countedOrders.length) : 0
  const prevAvg = prevCountedOrders.length ? Math.round(prevShopRevenue / prevCountedOrders.length) : 0

  const newCustomers = (profilesRes.data ?? []).filter(inRange).length
  const prevNewCustomers = (profilesRes.data ?? []).filter(inPrev).length

  // Revenue series (bucketed)
  const buckets = new Map<string, RevenueSeries>()
  const seed = (d: Date) => {
    const { key, label } = bucketKey(d, range)
    if (!buckets.has(key)) buckets.set(key, { label, shop: 0, service: 0 })
    return buckets.get(key)!
  }
  const steps = range === '1y' ? 12 : range === '3m' ? 13 : RANGE_DAYS[range]
  const stepMs = range === '1y' ? 30.4 * DAY : range === '3m' ? 7 * DAY : DAY
  for (let i = steps - 1; i >= 0; i--) seed(new Date(now - i * stepMs))
  for (const o of countedOrders) seed(new Date(o.created_at)).shop += Number(o.total)
  for (const b of bookings) seed(new Date(b.created_at)).service += earnedBooking(b)
  const revenueSeries = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)

  // Order statuses
  const statusCounts = new Map<string, number>()
  for (const o of orders) statusCounts.set(o.order_status, (statusCounts.get(o.order_status) ?? 0) + 1)
  const orderStatuses: OrderStatusSlice[] = Array.from(statusCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({ status: titleCase(status), count, color: STATUS_COLORS[status] ?? '#999999' }))

  // Bookings by service
  const serviceName = (slug: string) => SERVICES.find((s) => s.slug === slug)?.title ?? titleCase(slug)
  const svcCounts = new Map<string, number>()
  for (const b of bookings) svcCounts.set(b.service_slug, (svcCounts.get(b.service_slug) ?? 0) + 1)
  const serviceBookings: ServiceBookings[] = Array.from(svcCounts.entries())
    .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([slug, n]) => ({ service: serviceName(slug), bookings: n }))

  // Products + categories from order items
  const orderIds = countedOrders.map((o) => o.id)
  const orderDate = new Map(countedOrders.map((o) => [o.id, new Date(o.created_at).getTime()]))
  const categoryBySlug = new Map((productsRes.data ?? []).map((p) => [p.slug, p.category]))
  const productAgg = new Map<string, { units: number; revenue: number; weeks: number[] }>()
  const categoryAgg = new Map<string, number>()
  if (orderIds.length) {
    const { data: items, error } = await admin.from('order_items')
      .select('order_id, product_slug, product_name, quantity, unit_price').in('order_id', orderIds)
    if (error) throw error
    for (const it of items ?? []) {
      const line = it.quantity * Number(it.unit_price)
      const agg = productAgg.get(it.product_name) ?? { units: 0, revenue: 0, weeks: [0, 0, 0, 0] }
      agg.units += it.quantity
      agg.revenue += line
      const weeksAgo = Math.floor((now - (orderDate.get(it.order_id) ?? now)) / (7 * DAY))
      if (weeksAgo >= 0 && weeksAgo < 4) agg.weeks[3 - weeksAgo] += it.quantity
      productAgg.set(it.product_name, agg)
      const cat = titleCase(categoryBySlug.get(it.product_slug) ?? 'other')
      categoryAgg.set(cat, (categoryAgg.get(cat) ?? 0) + line)
    }
  }
  const topProducts: TopProductRow[] = Array.from(productAgg.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5)
    .map(([name, a], i) => ({ rank: i + 1, name, unitsSold: a.units, revenue: a.revenue, sparkline: a.weeks }))
  const categoryRevenue: CategoryRevenue[] = Array.from(categoryAgg.entries())
    .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([category, rev]) => ({ category, revenue: rev }))

  // Customers: returning = ordered in-range and also ordered before this period
  const priorEmails = new Set(prevOrders.map((o) => o.customer_email.toLowerCase()))
  const periodEmails = new Set(countedOrders.map((o) => o.customer_email.toLowerCase()))
  const returningCustomers = Array.from(periodEmails).filter((e) => priorEmails.has(e)).length
  const newBuyers = periodEmails.size - returningCustomers

  // Areas
  const areaMap = new Map<string, { emails: Set<string>; orders: number; revenue: number }>()
  for (const o of countedOrders) {
    const area = o.customer_city?.trim() || 'Other'
    const a = areaMap.get(area) ?? { emails: new Set<string>(), orders: 0, revenue: 0 }
    a.emails.add(o.customer_email.toLowerCase()); a.orders += 1; a.revenue += Number(o.total)
    areaMap.set(area, a)
  }
  const areaRows: AreaRow[] = Array.from(areaMap.entries()).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 8)
    .map(([area, a]) => ({ area, customers: a.emails.size, orders: a.orders, revenue: a.revenue }))

  return {
    kpi: {
      revenue, revenueChange: pct(revenue, prevRevenue),
      orders: orders.length, ordersChange: pct(orders.length, prevOrders.length),
      bookings: bookings.length, bookingsChange: pct(bookings.length, prevBookings.length),
      newCustomers, newCustomersChange: pct(newCustomers, prevNewCustomers),
      avgOrderValue: avg, avgOrderChange: pct(avg, prevAvg),
    },
    revenueSeries, orderStatuses, serviceBookings, topProducts, categoryRevenue,
    newCustomers: newBuyers, returningCustomers, areaRows,
  }
}

export async function getOverview(): Promise<AdminOverview> {
  if (!isSupabaseAdminConfigured()) return { pendingBookings: [], processingOrders: [], lowStock: [] }
  const admin = createAdminClient()
  const [b, o, p] = await Promise.all([
    admin.from('bookings').select('id, reference, service_slug, name, preferred_date, status')
      .in('status', ['new', 'quoted']).order('created_at', { ascending: false }).limit(8),
    admin.from('orders').select('reference, customer_name, created_at').eq('order_status', 'processing')
      .order('created_at', { ascending: false }).limit(5),
    admin.from('products').select('slug, name, stock_count').lt('stock_count', 5).gt('stock_count', -1)
      .eq('in_stock', true).order('stock_count', { ascending: true }).limit(8),
  ])
  return {
    pendingBookings: (b.data ?? []).map((r) => ({
      id: r.reference, service: SERVICES.find((s) => s.slug === r.service_slug)?.title ?? titleCase(r.service_slug),
      customer: r.name, date: r.preferred_date, status: r.status,
    })),
    processingOrders: (o.data ?? []).map((r) => ({ id: r.reference, customer: r.customer_name, createdAt: r.created_at })),
    lowStock: (p.data ?? []).map((r) => ({ slug: r.slug, name: r.name, stockCount: r.stock_count })),
  }
}
