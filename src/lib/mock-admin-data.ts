/**
 * Mock data for the admin dashboard.
 * Replace with real DB queries / API calls before launch.
 */

// ─── KPI stats ────────────────────────────────────────────────────────────────

export const ADMIN_KPI = {
  revenueThisMonth:      87_500,
  revenuePrevMonth:      78_125,   // +12 %
  ordersThisMonth:       24,
  ordersPrevMonth:       22,        // +8 %
  pendingBookings:       6,
  totalCustomers:        143,
  newCustomersThisWeek:  5,
}

// ─── Revenue by week (last 8 weeks) ──────────────────────────────────────────

export interface WeekRevenue {
  week:    string   // display label
  revenue: number   // KSh
}

export const ADMIN_REVENUE_BY_WEEK: WeekRevenue[] = [
  { week: 'Jan 27', revenue: 28_400 },
  { week: 'Feb 3',  revenue: 31_200 },
  { week: 'Feb 10', revenue: 24_800 },
  { week: 'Feb 17', revenue: 38_500 },
  { week: 'Feb 24', revenue: 32_100 },
  { week: 'Mar 3',  revenue: 41_300 },
  { week: 'Mar 10', revenue: 35_700 },
  { week: 'Mar 17', revenue: 44_900 },
]

// ─── Recent orders ────────────────────────────────────────────────────────────

export type OrderStatus = 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'

export interface AdminOrder {
  id:       string
  customer: string
  area:     string       // Nairobi neighbourhood
  amount:   number       // KSh
  status:   OrderStatus
  timeAgo:  string       // pre-formatted relative time for mock
}

export const ADMIN_RECENT_ORDERS: AdminOrder[] = [
  { id: 'ORD-F9K2P4', customer: 'Wanjiku Kamau',    area: 'Westlands',  amount:  4_800, status: 'processing', timeAgo: '2 hours ago'   },
  { id: 'ORD-H3N7R1', customer: 'Aisha Mohamed',    area: 'Kilimani',   amount:  2_200, status: 'processing', timeAgo: '4 hours ago'   },
  { id: 'ORD-D5T8Q2', customer: 'John Mutiso',      area: 'South B',    amount:  6_500, status: 'packed',     timeAgo: '8 hours ago'   },
  { id: 'ORD-G1M4L9', customer: 'Grace Njeri',      area: 'Runda',      amount: 12_800, status: 'dispatched', timeAgo: '1 day ago'     },
  { id: 'ORD-K7P3V5', customer: 'Peter Ochieng',    area: 'Ngong Road', amount:  3_400, status: 'dispatched', timeAgo: '1 day ago'     },
  { id: 'ORD-C9B6W8', customer: 'Fatuma Hassan',    area: 'Parklands',  amount:  5_100, status: 'delivered',  timeAgo: '2 days ago'    },
  { id: 'ORD-J2X5A3', customer: 'James Kariuki',    area: 'Karen',      amount:  8_900, status: 'delivered',  timeAgo: '3 days ago'    },
  { id: 'ORD-R4Y0E7', customer: 'Esther Wangari',   area: 'Kileleshwa', amount:  1_950, status: 'delivered',  timeAgo: '4 days ago'    },
]

// ─── Pending bookings ─────────────────────────────────────────────────────────

export type BookingStatus = 'new' | 'quoted' | 'confirmed'

export interface AdminBooking {
  id:       string
  service:  string
  customer: string
  date:     string      // human-readable, e.g. "Apr 8, 2025"
  status:   BookingStatus
}

export const ADMIN_PENDING_BOOKINGS: AdminBooking[] = [
  { id: 'BK-884721', service: 'Whole House Organizing',  customer: 'Mary Waweru',      date: 'Apr 8, 2025',  status: 'confirmed' },
  { id: 'BK-661033', service: 'General Decluttering',    customer: 'Samuel Ndungu',    date: 'Apr 10, 2025', status: 'new'       },
  { id: 'BK-773912', service: 'Office Organizing',       customer: 'Priya Patel',      date: 'Apr 12, 2025', status: 'quoted'    },
  { id: 'BK-559241', service: 'Moving House',            customer: 'Brian Otieno',     date: 'Apr 15, 2025', status: 'confirmed' },
  { id: 'BK-447680', service: 'Shelving & Storage',      customer: 'Ruth Chebet',      date: 'Apr 18, 2025', status: 'new'       },
]

// ─── Top products by units sold ───────────────────────────────────────────────

export interface TopProduct {
  slug:      string
  name:      string
  unitsSold: number
  revenue:   number   // KSh
}

export const ADMIN_TOP_PRODUCTS: TopProduct[] = [
  { slug: 'velvet-slim-hangers-50pk',       name: 'Velvet Hangers (50-Pack)',        unitsSold: 18, revenue: 81_000 },
  { slug: 'rotating-cup-organizer',         name: 'Rotating Cup & Mug Organizer',   unitsSold: 14, revenue: 30_800 },
  { slug: 'stacking-storage-bins',          name: 'Storage Bins Set (3-Pack)',       unitsSold: 12, revenue: 54_000 },
  { slug: 'fridge-organizer-set',           name: 'Fridge Organizer Set (6 Pcs)',    unitsSold: 11, revenue: 41_800 },
  { slug: 'cable-management-box',           name: 'Cable Management Box',            unitsSold:  8, revenue: 22_400 },
]

// ─── Top services by booking count ────────────────────────────────────────────

export interface TopService {
  service:  string
  bookings: number
}

export const ADMIN_TOP_SERVICES: TopService[] = [
  { service: 'Professional Organizing & Decluttering', bookings: 12 },
  { service: 'Relocation & Transition Services',       bookings:  8 },
  { service: 'Storage Design & Installation',          bookings:  5 },
  { service: 'Home Management Services',               bookings:  4 },
  { service: 'Cleaning & Housekeeping Services',       bookings:  3 },
]

// ─── Low stock products ───────────────────────────────────────────────────────

export interface LowStockItem {
  slug:       string
  name:       string
  stockCount: number
}

export const ADMIN_LOW_STOCK: LowStockItem[] = [
  { slug: 'fruit-and-vegetable-holder', name: 'Fruit & Vegetable Holder',  stockCount: 1 },
  { slug: 'under-bed-storage-bag',      name: 'Under-Bed Storage Bag',     stockCount: 2 },
  { slug: 'cable-management-box',       name: 'Cable Management Box',      stockCount: 3 },
]
