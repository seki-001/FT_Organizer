/**
 * Mock analytics data.
 * Each date-range key returns a complete dataset for that period.
 * In production, replace with API calls to your analytics backend.
 */

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

// ─── Mock data ─────────────────────────────────────────────────────────────────

const ORDER_STATUSES: OrderStatusSlice[] = [
  { status: 'Delivered',   count: 48, color: '#2D7A47' },
  { status: 'Processing',  count: 18, color: '#E8A020' },
  { status: 'Dispatched',  count: 11, color: '#6366F1' },
  { status: 'Packed',      count:  6, color: '#3B82F6' },
  { status: 'Cancelled',   count:  4, color: '#991010' },
]

const SERVICE_BOOKINGS: ServiceBookings[] = [
  { service: 'General Decluttering',    bookings: 12 },
  { service: 'Whole House Organizing',  bookings:  8 },
  { service: 'Wardrobe Overhaul',        bookings:  6 },
  { service: 'Office Organizing',        bookings:  5 },
  { service: 'Moving House Setup',       bookings:  4 },
  { service: 'Paperwork Management',     bookings:  3 },
  { service: 'New Home Setup',           bookings:  2 },
]

const TOP_PRODUCTS: TopProductRow[] = [
  { rank: 1, name: 'Velvet Hangers (50-Pack)',       unitsSold: 18, revenue: 81_000, sparkline: [3, 5, 4, 6] },
  { rank: 2, name: 'Rotating Cup & Mug Organizer',   unitsSold: 14, revenue: 30_800, sparkline: [2, 4, 3, 5] },
  { rank: 3, name: 'Storage Bins Set (3-Pack)',       unitsSold: 12, revenue: 54_000, sparkline: [4, 2, 3, 3] },
  { rank: 4, name: 'Fridge Organizer Set (6 Pcs)',    unitsSold: 11, revenue: 41_800, sparkline: [2, 3, 3, 3] },
  { rank: 5, name: 'Cable Management Box',            unitsSold:  8, revenue: 22_400, sparkline: [1, 2, 2, 3] },
]

const CATEGORY_REVENUE: CategoryRevenue[] = [
  { category: 'Kitchen',      revenue: 98_500 },
  { category: 'Wardrobe',     revenue: 87_200 },
  { category: 'Office',       revenue: 54_300 },
  { category: 'Bathroom',     revenue: 41_600 },
  { category: 'Living Room',  revenue: 38_900 },
  { category: 'Kids',         revenue: 21_500 },
]

const AREA_ROWS: AreaRow[] = [
  { area: 'Westlands',   customers: 22, orders: 38, revenue: 142_000 },
  { area: 'Karen',       customers: 18, orders: 31, revenue: 128_400 },
  { area: 'Kilimani',    customers: 16, orders: 27, revenue: 98_700  },
  { area: 'Runda',       customers: 12, orders: 21, revenue: 94_200  },
  { area: 'Kileleshwa',  customers: 11, orders: 18, revenue: 67_500  },
  { area: 'Lavington',   customers:  9, orders: 15, revenue: 54_300  },
  { area: 'CBD',         customers:  7, orders: 11, revenue: 31_200  },
  { area: 'Other',       customers: 48, orders: 84, revenue: 186_700 },
]

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: 'a01', type: 'order',    message: 'New order #ORD-F9K2P4 from Wanjiku Kamau — KSh 4,800',      timeAgo: '2 min ago'  },
  { id: 'a02', type: 'booking',  message: 'New booking: Whole House Organizing from Grace Njeri',       timeAgo: '14 min ago' },
  { id: 'a03', type: 'customer', message: 'New customer: David Mwangi from Thika Road',                 timeAgo: '28 min ago' },
  { id: 'a04', type: 'order',    message: 'New order #ORD-H3N7R1 from Aisha Mohamed — KSh 2,200',      timeAgo: '42 min ago' },
  { id: 'a05', type: 'stock',    message: 'Low stock alert: Fruit & Vegetable Holder (1 remaining)',    timeAgo: '1 hr ago'   },
  { id: 'a06', type: 'order',    message: 'New order #ORD-D5T8Q2 from John Mutiso — KSh 6,500',        timeAgo: '1 hr ago'   },
  { id: 'a07', type: 'customer', message: 'New customer: Mercy Waweru from Kasarani',                   timeAgo: '2 hr ago'   },
  { id: 'a08', type: 'booking',  message: 'New booking: Office Organizing from Priya Patel',            timeAgo: '3 hr ago'   },
  { id: 'a09', type: 'order',    message: 'New order #ORD-G1M4L9 from Grace Njeri — KSh 12,800',       timeAgo: '5 hr ago'   },
  { id: 'a10', type: 'stock',    message: 'Low stock alert: Under-Bed Storage Bag (2 remaining)',       timeAgo: '6 hr ago'   },
  { id: 'a11', type: 'order',    message: 'New order #ORD-K7P3V5 from Peter Ochieng — KSh 3,400',      timeAgo: '8 hr ago'   },
  { id: 'a12', type: 'booking',  message: 'New booking: General Decluttering from Samuel Ndungu',       timeAgo: '10 hr ago'  },
  { id: 'a13', type: 'customer', message: 'New customer: Amina Osman from Lavington',                   timeAgo: '1 day ago'  },
  { id: 'a14', type: 'order',    message: 'New order #ORD-C9B6W8 from Fatuma Hassan — KSh 5,100',      timeAgo: '1 day ago'  },
  { id: 'a15', type: 'stock',    message: 'Low stock alert: Cable Management Box (3 remaining)',        timeAgo: '1 day ago'  },
  { id: 'a16', type: 'order',    message: 'New order #ORD-J2X5A3 from James Kariuki — KSh 8,900',      timeAgo: '2 days ago' },
  { id: 'a17', type: 'booking',  message: 'New booking: Wardrobe Overhaul from Wanjiku Kamau',          timeAgo: '2 days ago' },
  { id: 'a18', type: 'customer', message: 'New customer: Faith Gitonga from Parklands',                 timeAgo: '2 days ago' },
  { id: 'a19', type: 'order',    message: 'New order #ORD-R4Y0E7 from Esther Wangari — KSh 1,950',     timeAgo: '3 days ago' },
  { id: 'a20', type: 'booking',  message: 'New booking: Moving House Setup from Brian Otieno',          timeAgo: '3 days ago' },
]

// ─── Period data keyed by range ────────────────────────────────────────────────

function makeSeries7d(): RevenueSeries[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const shop    = [8_200, 12_400, 6_800, 14_200, 9_600, 18_500, 11_300]
  const service = [3_000, 5_000,  4_500, 7_000,  3_500, 8_000,  4_200]
  return days.map((label, i) => ({ label, shop: shop[i], service: service[i] }))
}

function makeSeries30d(): RevenueSeries[] {
  return [
    { label: 'Feb 18', shop: 18_200, service:  7_400 },
    { label: 'Feb 21', shop: 21_500, service:  9_200 },
    { label: 'Feb 24', shop: 15_800, service:  6_100 },
    { label: 'Feb 27', shop: 24_300, service: 11_500 },
    { label: 'Mar 2',  shop: 19_700, service:  8_800 },
    { label: 'Mar 5',  shop: 28_100, service: 13_200 },
    { label: 'Mar 8',  shop: 22_400, service:  9_600 },
    { label: 'Mar 11', shop: 31_200, service: 14_800 },
    { label: 'Mar 14', shop: 25_600, service: 11_200 },
    { label: 'Mar 17', shop: 34_500, service: 16_100 },
  ]
}

function makeSeries3m(): RevenueSeries[] {
  return [
    { label: 'Jan W1', shop: 42_000, service: 18_000 },
    { label: 'Jan W2', shop: 38_500, service: 15_500 },
    { label: 'Jan W3', shop: 51_200, service: 22_000 },
    { label: 'Jan W4', shop: 44_800, service: 19_000 },
    { label: 'Feb W1', shop: 55_100, service: 24_500 },
    { label: 'Feb W2', shop: 48_700, service: 21_200 },
    { label: 'Feb W3', shop: 62_400, service: 27_800 },
    { label: 'Feb W4', shop: 57_300, service: 25_100 },
    { label: 'Mar W1', shop: 71_200, service: 31_500 },
    { label: 'Mar W2', shop: 65_800, service: 28_900 },
    { label: 'Mar W3', shop: 78_500, service: 34_200 },
  ]
}

function makeSeries1y(): RevenueSeries[] {
  return [
    { label: 'Apr',  shop: 142_000, service:  62_000 },
    { label: 'May',  shop: 168_500, service:  74_200 },
    { label: 'Jun',  shop: 154_200, service:  68_500 },
    { label: 'Jul',  shop: 181_400, service:  80_100 },
    { label: 'Aug',  shop: 172_800, service:  76_400 },
    { label: 'Sep',  shop: 198_600, service:  88_200 },
    { label: 'Oct',  shop: 221_500, service:  98_500 },
    { label: 'Nov',  shop: 245_800, service: 109_200 },
    { label: 'Dec',  shop: 312_400, service: 139_100 },
    { label: 'Jan',  shop: 264_100, service: 117_500 },
    { label: 'Feb',  shop: 298_700, service: 132_800 },
    { label: 'Mar',  shop: 342_000, service: 152_400 },
  ]
}

export const ANALYTICS_BY_RANGE: Record<DateRange, AnalyticsPeriod> = {
  '7d': {
    kpi: {
      revenue: 81_000, revenueChange: 14,
      orders:  22,     ordersChange:  8,
      bookings: 9,     bookingsChange: 18,
      newCustomers: 7, newCustomersChange: 5,
      avgOrderValue: 3_682, avgOrderChange: 6,
    },
    revenueSeries:   makeSeries7d(),
    orderStatuses:   ORDER_STATUSES,
    serviceBookings: SERVICE_BOOKINGS,
    topProducts:     TOP_PRODUCTS,
    categoryRevenue: CATEGORY_REVENUE,
    newCustomers: 7, returningCustomers: 15,
    areaRows: AREA_ROWS,
  },
  '30d': {
    kpi: {
      revenue: 241_000, revenueChange: 18,
      orders:  64,      ordersChange:  12,
      bookings: 24,     bookingsChange: 20,
      newCustomers: 28, newCustomersChange: 9,
      avgOrderValue: 3_766, avgOrderChange: 5,
    },
    revenueSeries:   makeSeries30d(),
    orderStatuses:   ORDER_STATUSES,
    serviceBookings: SERVICE_BOOKINGS,
    topProducts:     TOP_PRODUCTS,
    categoryRevenue: CATEGORY_REVENUE,
    newCustomers: 28, returningCustomers: 36,
    areaRows: AREA_ROWS,
  },
  '3m': {
    kpi: {
      revenue: 342_000, revenueChange: 24,
      orders:  87,      ordersChange:  19,
      bookings: 34,     bookingsChange: 28,
      newCustomers: 41, newCustomersChange: 15,
      avgOrderValue: 3_931, avgOrderChange: 4,
    },
    revenueSeries:   makeSeries3m(),
    orderStatuses:   ORDER_STATUSES,
    serviceBookings: SERVICE_BOOKINGS,
    topProducts:     TOP_PRODUCTS,
    categoryRevenue: CATEGORY_REVENUE,
    newCustomers: 41, returningCustomers: 46,
    areaRows: AREA_ROWS,
  },
  '1y': {
    kpi: {
      revenue: 2_302_500, revenueChange: 31,
      orders:  621,        ordersChange:  24,
      bookings: 187,       bookingsChange: 38,
      newCustomers: 143,   newCustomersChange: 22,
      avgOrderValue: 3_708, avgOrderChange: 6,
    },
    revenueSeries:   makeSeries1y(),
    orderStatuses:   ORDER_STATUSES,
    serviceBookings: SERVICE_BOOKINGS,
    topProducts:     TOP_PRODUCTS,
    categoryRevenue: CATEGORY_REVENUE,
    newCustomers: 143, returningCustomers: 112,
    areaRows: AREA_ROWS,
  },
}
