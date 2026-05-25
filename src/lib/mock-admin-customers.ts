/** Lightweight order record for customer history */
export interface CustomerOrder {
  id:     string
  date:   string
  amount: number
  status: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
  items:  string
}

/** Lightweight booking record for customer history */
export interface CustomerBooking {
  id:          string
  date:        string
  service:     string
  status:      'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  propertyType: string
}

/** Full customer record (used in detail slide-over) */
export interface Customer {
  id:          string
  name:        string
  email:       string
  phone:       string
  joinedAt:    string   // ISO date
  totalOrders: number
  totalSpent:  number
  lastOrderAt: string | null
  orders:      CustomerOrder[]
  bookings:    CustomerBooking[]
  area:        string
}

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001', name: 'Wanjiku Kamau', email: 'wanjiku.kamau@email.com', phone: '+254 712 345 678',
    joinedAt: '2025-06-14', totalOrders: 8, totalSpent: 42_800, lastOrderAt: '2026-03-16', area: 'Westlands',
    orders: [
      { id: 'ORD-F9K2P4', date: '2026-03-16', amount: 4_800, status: 'processing', items: 'Pantry Organiser Set, Label Maker' },
      { id: 'ORD-A1B2C3', date: '2026-02-10', amount: 7_200, status: 'delivered',  items: 'Wardrobe Shelf Dividers x4' },
      { id: 'ORD-D4E5F6', date: '2026-01-05', amount: 3_500, status: 'delivered',  items: 'Cable Management Kit' },
      { id: 'ORD-G7H8I9', date: '2025-11-22', amount: 5_600, status: 'delivered',  items: 'Under-Bed Storage Bags x3' },
      { id: 'ORD-J0K1L2', date: '2025-09-08', amount: 2_900, status: 'delivered',  items: 'Drawer Divider Set' },
    ],
    bookings: [
      { id: 'BK-001', date: '2026-02-20', service: 'Home Organizing — Full House',      status: 'completed',  propertyType: 'apartment' },
      { id: 'BK-002', date: '2025-10-15', service: 'Wardrobe Overhaul',                status: 'completed',  propertyType: 'apartment' },
    ],
  },
  {
    id: 'cust-002', name: 'Aisha Mohamed', email: 'aisha.m@gmail.com', phone: '+254 723 456 789',
    joinedAt: '2025-09-03', totalOrders: 4, totalSpent: 18_400, lastOrderAt: '2026-03-16', area: 'Kilimani',
    orders: [
      { id: 'ORD-H3N7R1', date: '2026-03-16', amount: 2_200, status: 'processing', items: 'Acrylic Fridge Organiser' },
      { id: 'ORD-M3N4O5', date: '2026-01-30', amount: 6_700, status: 'delivered',  items: 'Kitchen Drawer Organiser Set' },
      { id: 'ORD-P6Q7R8', date: '2025-11-11', amount: 5_100, status: 'delivered',  items: 'Bathroom Caddy + Towel Rack' },
      { id: 'ORD-S9T0U1', date: '2025-10-02', amount: 4_400, status: 'delivered',  items: 'Office Desk Organiser' },
    ],
    bookings: [
      { id: 'BK-010', date: '2026-01-18', service: 'Kitchen Organization', status: 'completed', propertyType: 'apartment' },
    ],
  },
  {
    id: 'cust-003', name: 'John Mutiso', email: 'jmutiso@work.co.ke', phone: '+254 734 567 890',
    joinedAt: '2025-07-22', totalOrders: 6, totalSpent: 31_600, lastOrderAt: '2026-03-14', area: 'South B',
    orders: [
      { id: 'ORD-D5T8Q2', date: '2026-03-14', amount: 6_500, status: 'packed',     items: 'Garage Storage System' },
      { id: 'ORD-V2W3X4', date: '2026-02-28', amount: 3_800, status: 'delivered',  items: 'Filing Cabinet + Desk Tray' },
      { id: 'ORD-Y5Z6A7', date: '2025-12-20', amount: 8_900, status: 'delivered',  items: 'Full Wardrobe System' },
      { id: 'ORD-B8C9D0', date: '2025-11-05', amount: 4_200, status: 'delivered',  items: 'Kitchen Organiser Kit' },
      { id: 'ORD-E1F2G3', date: '2025-09-10', amount: 4_600, status: 'delivered',  items: 'Pantry Bin Set' },
    ],
    bookings: [
      { id: 'BK-020', date: '2026-02-10', service: 'Home Office Setup',              status: 'confirmed',  propertyType: 'house' },
      { id: 'BK-021', date: '2025-08-15', service: 'Garage & Store Organization',    status: 'completed',  propertyType: 'house' },
      { id: 'BK-022', date: '2025-07-30', service: 'New Home Setup — Move-In',       status: 'completed',  propertyType: 'house' },
    ],
  },
  {
    id: 'cust-004', name: 'Grace Njeri', email: 'grace.njeri@yahoo.com', phone: '+254 745 678 901',
    joinedAt: '2024-11-10', totalOrders: 14, totalSpent: 87_500, lastOrderAt: '2026-03-13', area: 'Runda',
    orders: [
      { id: 'ORD-G1M4L9', date: '2026-03-13', amount: 12_800, status: 'dispatched', items: 'Luxury Closet System x2 + Laundry' },
      { id: 'ORD-H4I5J6', date: '2026-02-01', amount:  9_200, status: 'delivered',  items: 'Master Suite Organiser Set' },
      { id: 'ORD-K7L8M9', date: '2026-01-14', amount:  6_800, status: 'delivered',  items: 'Kids Room Storage System' },
      { id: 'ORD-N0O1P2', date: '2025-12-05', amount: 11_400, status: 'delivered',  items: 'Pantry + Kitchen Complete Kit' },
      { id: 'ORD-Q3R4S5', date: '2025-10-19', amount:  7_900, status: 'delivered',  items: 'Wardrobe Dividers + Shoe Rack' },
    ],
    bookings: [
      { id: 'BK-030', date: '2026-03-20', service: 'Whole Home Organization — 4BR',   status: 'confirmed',  propertyType: 'villa' },
      { id: 'BK-031', date: '2025-09-05', service: 'Annual Refresh — Full Property',  status: 'completed',  propertyType: 'villa' },
    ],
  },
  {
    id: 'cust-005', name: 'Peter Ochieng', email: 'p.ochieng@safaricom.co.ke', phone: '+254 756 789 012',
    joinedAt: '2025-04-18', totalOrders: 5, totalSpent: 24_700, lastOrderAt: '2026-03-13', area: 'Ngong Road',
    orders: [
      { id: 'ORD-K7P3V5', date: '2026-03-13', amount: 3_400, status: 'dispatched', items: 'Bathroom Organiser x3' },
      { id: 'ORD-T6U7V8', date: '2026-02-14', amount: 5_600, status: 'delivered',  items: 'Kitchen Drawer + Pantry Bins' },
      { id: 'ORD-W9X0Y1', date: '2025-12-22', amount: 7_200, status: 'delivered',  items: 'Office Filing + Desk System' },
      { id: 'ORD-Z2A3B4', date: '2025-10-30', amount: 4_100, status: 'delivered',  items: 'Shoe Cabinet + Boot Tray' },
      { id: 'ORD-C5D6E7', date: '2025-06-05', amount: 4_400, status: 'delivered',  items: 'Living Room Storage Baskets Set' },
    ],
    bookings: [
      { id: 'BK-040', date: '2025-11-20', service: 'Office Organization',            status: 'completed',  propertyType: 'office' },
    ],
  },
  {
    id: 'cust-006', name: 'Fatuma Hassan', email: 'fatuma.h@hotmail.com', phone: '+254 767 890 123',
    joinedAt: '2026-01-05', totalOrders: 2, totalSpent: 10_700, lastOrderAt: '2026-03-11', area: 'Parklands',
    orders: [
      { id: 'ORD-C9B6W8', date: '2026-03-11', amount: 5_100, status: 'delivered', items: 'Complete Pantry Organisation Set' },
      { id: 'ORD-F8G9H0', date: '2026-02-03', amount: 5_600, status: 'delivered', items: 'Wardrobe System — Starter Kit' },
    ],
    bookings: [],
  },
  {
    id: 'cust-007', name: 'James Kariuki', email: 'james.kariuki@proton.me', phone: '+254 778 901 234',
    joinedAt: '2024-08-30', totalOrders: 11, totalSpent: 64_300, lastOrderAt: '2026-03-10', area: 'Karen',
    orders: [
      { id: 'ORD-J2X5A3', date: '2026-03-10', amount: 8_900, status: 'delivered',  items: 'Karen Home Full Kit' },
      { id: 'ORD-I1J2K3', date: '2026-01-25', amount: 6_200, status: 'delivered',  items: 'Garage + Utility Room Set' },
      { id: 'ORD-L4M5N6', date: '2025-12-12', amount: 9_400, status: 'delivered',  items: 'Master Closet System' },
      { id: 'ORD-O7P8Q9', date: '2025-10-08', amount: 5_300, status: 'delivered',  items: 'Kids Bedroom Storage Set x2' },
      { id: 'ORD-R0S1T2', date: '2025-08-17', amount: 7_100, status: 'delivered',  items: 'Home Office Complete Setup' },
    ],
    bookings: [
      { id: 'BK-050', date: '2026-02-25', service: 'Annual Review — Full Property',  status: 'completed',  propertyType: 'villa' },
      { id: 'BK-051', date: '2025-07-10', service: 'Karen Move-In Setup',            status: 'completed',  propertyType: 'villa' },
      { id: 'BK-052', date: '2024-09-12', service: 'Initial Consultation',           status: 'completed',  propertyType: 'villa' },
    ],
  },
  {
    id: 'cust-008', name: 'Mercy Waweru', email: 'mercy.w@gmail.com', phone: '+254 789 012 345',
    joinedAt: '2026-03-01', totalOrders: 1, totalSpent: 3_200, lastOrderAt: '2026-03-08', area: 'Kasarani',
    orders: [
      { id: 'ORD-U3V4W5', date: '2026-03-08', amount: 3_200, status: 'delivered', items: 'Starter Organiser Bundle' },
    ],
    bookings: [],
  },
  {
    id: 'cust-009', name: 'David Mwangi', email: 'dmwangi@co.ke', phone: '+254 790 123 456',
    joinedAt: '2026-03-10', totalOrders: 1, totalSpent: 2_800, lastOrderAt: '2026-03-10', area: 'Thika Road',
    orders: [
      { id: 'ORD-X6Y7Z8', date: '2026-03-10', amount: 2_800, status: 'processing', items: 'Kitchen Bin Set + Drawer Dividers' },
    ],
    bookings: [
      { id: 'BK-060', date: '2026-03-25', service: 'Home Assessment', status: 'new', propertyType: 'apartment' },
    ],
  },
  {
    id: 'cust-010', name: 'Amina Osman', email: 'aminaosman@icloud.com', phone: '+254 701 234 567',
    joinedAt: '2025-02-11', totalOrders: 7, totalSpent: 38_100, lastOrderAt: '2026-02-28', area: 'Lavington',
    orders: [
      { id: 'ORD-A9B0C1', date: '2026-02-28', amount: 4_900, status: 'delivered',  items: 'Bathroom Storage System' },
      { id: 'ORD-D2E3F4', date: '2026-01-19', amount: 6_800, status: 'delivered',  items: 'Kitchen Command Centre Set' },
      { id: 'ORD-G5H6I7', date: '2025-12-01', amount: 5_200, status: 'delivered',  items: 'Wardrobe Insert Set' },
      { id: 'ORD-J8K9L0', date: '2025-10-14', amount: 7_600, status: 'delivered',  items: 'Pantry Makeover Kit' },
      { id: 'ORD-M1N2O3', date: '2025-08-09', amount: 4_500, status: 'delivered',  items: 'Laundry Room System' },
    ],
    bookings: [
      { id: 'BK-070', date: '2025-12-10', service: 'Lavington Apartment — Full',    status: 'completed',  propertyType: 'apartment' },
      { id: 'BK-071', date: '2025-03-04', service: 'Kitchen Organization Consult',  status: 'completed',  propertyType: 'apartment' },
    ],
  },
]
