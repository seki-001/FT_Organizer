/** Shared analytics data shapes used by the admin dashboard, charts and API. */

export type DateRange = '7d' | '30d' | '3m' | '1y'

// ─── Top-level KPIs ────────────────────────────────────────────────────────────

export interface AnalyticsKPI {
  revenue:       number
  revenueChange: number   // % vs previous period
  orders:        number
  ordersChange:  number
  bookings:      number
  bookingsChange:number
  newCustomers:  number
  newCustomersChange: number
  avgOrderValue: number
  avgOrderChange:number
}

// ─── Revenue over time ─────────────────────────────────────────────────────────

export interface RevenueSeries {
  label:   string   // date / week label shown on X-axis
  shop:    number   // shop / product revenue
  service: number   // service / booking revenue
}

// ─── Orders by status ──────────────────────────────────────────────────────────

export interface OrderStatusSlice {
  status: string
  count:  number
  color:  string
}

// ─── Bookings by service ───────────────────────────────────────────────────────

export interface ServiceBookings {
  service:  string
  bookings: number
}

// ─── Top products ──────────────────────────────────────────────────────────────

export interface TopProductRow {
  rank:      number
  name:      string
  unitsSold: number
  revenue:   number
  sparkline: number[]   // last 4 weeks unit sales
}

// ─── Revenue by category ───────────────────────────────────────────────────────

export interface CategoryRevenue {
  category: string
  revenue:  number
}

// ─── Customer areas ────────────────────────────────────────────────────────────

export interface AreaRow {
  area:      string
  customers: number
  orders:    number
  revenue:   number
}

// ─── Activity feed ─────────────────────────────────────────────────────────────

export type ActivityType = 'order' | 'booking' | 'customer' | 'stock'

export interface ActivityItem {
  id:        string
  type:      ActivityType
  message:   string
  timeAgo:   string
}

// ─── Full period dataset ───────────────────────────────────────────────────────

export interface AnalyticsPeriod {
  kpi:              AnalyticsKPI
  revenueSeries:    RevenueSeries[]
  orderStatuses:    OrderStatusSlice[]
  serviceBookings:  ServiceBookings[]
  topProducts:      TopProductRow[]
  categoryRevenue:  CategoryRevenue[]
  newCustomers:     number
  returningCustomers: number
  areaRows:         AreaRow[]
}

export function emptyAnalyticsPeriod(): AnalyticsPeriod {
  return {
    kpi: { revenue: 0, revenueChange: 0, orders: 0, ordersChange: 0, bookings: 0, bookingsChange: 0,
      newCustomers: 0, newCustomersChange: 0, avgOrderValue: 0, avgOrderChange: 0 },
    revenueSeries: [], orderStatuses: [], serviceBookings: [], topProducts: [], categoryRevenue: [],
    newCustomers: 0, returningCustomers: 0, areaRows: [],
  }
}
