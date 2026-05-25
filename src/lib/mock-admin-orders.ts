import type { Order } from '@/lib/types'
import { MOCK_PRODUCTS } from '@/lib/mock-products'

/**
 * 15 full Order objects for the admin orders management section.
 * Dates are relative to March 2026 so time-ago values are realistic.
 * Replace with real DB queries before launch.
 */
export const MOCK_ADMIN_ORDERS: Order[] = [

  // ── Processing (received, preparing) ──────────────────────────────────────

  {
    id: 'ORD-F9K2P4',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 }, // Cup Organizer ×2 = 4,400
    ],
    total: 4_400,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    customer: {
      name:    'Wanjiku Kamau',
      email:   'wanjiku.kamau@example.com',
      phone:   '+254 722 123 456',
      address: 'Apt 12, Park Suites, Waiyaki Way',
      city:    'Westlands',
    },
    createdAt: '2026-03-18T08:30:00.000Z',
  },

  {
    id: 'ORD-H3N7R1',
    items: [
      { product: MOCK_PRODUCTS[1], quantity: 1 }, // Fridge Organizer ×1 = 3,500
    ],
    total: 3_800,
    deliveryMethod: 'standard-nationwide',
    deliveryFee: 300,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    customer: {
      name:    'Aisha Mohamed',
      email:   'aisha.m@example.com',
      phone:   '+254 733 456 789',
      address: 'Unit 5, Al-Amin Complex, Ngong Road',
      city:    'Kilimani',
    },
    createdAt: '2026-03-18T06:15:00.000Z',
  },

  {
    id: 'ORD-S6P9B2',
    items: [
      { product: MOCK_PRODUCTS[6], quantity: 1 }, // Cable Box ×1 = 2,900
      { product: MOCK_PRODUCTS[3], quantity: 1 }, // Velvet Hangers ×1 = 1,200
    ],
    total: 4_100,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    customer: {
      name:    'Samuel Ndungu',
      email:   'samuel.n@example.com',
      phone:   '+254 711 987 654',
      address: '15B, Zimmerman Estate',
      city:    'Thika Road',
    },
    createdAt: '2026-03-17T14:20:00.000Z',
  },

  // ── Packed ────────────────────────────────────────────────────────────────

  {
    id: 'ORD-D5T8Q2',
    items: [
      { product: MOCK_PRODUCTS[3], quantity: 3 }, // Velvet Hangers ×3 = 3,600
    ],
    total: 3_600,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'packed',
    customer: {
      name:    'John Mutiso',
      email:   'j.mutiso@example.com',
      phone:   '+254 722 654 321',
      address: 'House 7, Nairobi South Estate',
      city:    'South B',
    },
    createdAt: '2026-03-15T10:00:00.000Z',
  },

  {
    id: 'ORD-P2W7X1',
    items: [
      { product: MOCK_PRODUCTS[10], quantity: 1 }, // Kitchen Bundle ×1 = 6,500
    ],
    total: 6_500,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'packed',
    customer: {
      name:    'Priya Patel',
      email:   'priya.patel@example.com',
      phone:   '+254 733 321 654',
      address: '4th Floor, Westgate Office Park',
      city:    'Westlands',
    },
    createdAt: '2026-03-14T16:45:00.000Z',
  },

  // ── Dispatched ────────────────────────────────────────────────────────────

  {
    id: 'ORD-G1M4L9',
    items: [
      { product: MOCK_PRODUCTS[7], quantity: 2 }, // Storage Bins ×2 = 8,400
      { product: MOCK_PRODUCTS[8], quantity: 1 }, // Fabric Baskets ×1 = 1,999
    ],
    total: 10_399,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    customer: {
      name:    'Grace Njeri',
      email:   'grace.njeri@example.com',
      phone:   '+254 722 987 123',
      address: 'Villa 3, Runda Meadows',
      city:    'Runda',
    },
    createdAt: '2026-03-13T09:00:00.000Z',
  },

  {
    id: 'ORD-K7P3V5',
    items: [
      { product: MOCK_PRODUCTS[5], quantity: 1 }, // File Organizer ×1 = 1,650
    ],
    total: 1_950,
    deliveryMethod: 'standard-nationwide',
    deliveryFee: 300,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    orderStatus: 'dispatched',
    customer: {
      name:    'Peter Ochieng',
      email:   'p.ochieng@example.com',
      phone:   '+254 711 456 123',
      address: 'House 22, Otiende Estate',
      city:    'Ngong Road',
      notes:   'Call 30 minutes before delivery.',
    },
    createdAt: '2026-03-12T11:30:00.000Z',
  },

  {
    id: 'ORD-B1Q5Y4',
    items: [
      { product: MOCK_PRODUCTS[8], quantity: 2 }, // Fabric Baskets ×2 = 3,998
    ],
    total: 4_298,
    deliveryMethod: 'standard-nationwide',
    deliveryFee: 300,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'dispatched',
    customer: {
      name:    'Brian Otieno',
      email:   'b.otieno@example.com',
      phone:   '+254 733 789 012',
      address: '42 Milimani Road',
      city:    'Kisumu',
    },
    createdAt: '2026-03-11T08:45:00.000Z',
  },

  // ── Delivered ─────────────────────────────────────────────────────────────

  {
    id: 'ORD-C9B6W8',
    items: [
      { product: MOCK_PRODUCTS[1], quantity: 1 }, // Fridge Organizer ×1 = 3,500
      { product: MOCK_PRODUCTS[0], quantity: 1 }, // Cup Organizer ×1 = 2,200
    ],
    total: 5_700,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'Fatuma Hassan',
      email:   'fatuma.h@example.com',
      phone:   '+254 722 234 567',
      address: 'Block C, Parklands Avenue',
      city:    'Parklands',
    },
    createdAt: '2026-03-10T13:00:00.000Z',
  },

  {
    id: 'ORD-J2X5A3',
    items: [
      { product: MOCK_PRODUCTS[11], quantity: 1 }, // Home Office Bundle ×1 = 3,800
    ],
    total: 3_800,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'James Kariuki',
      email:   'j.kariuki@example.com',
      phone:   '+254 711 678 234',
      address: 'Karen Plains Road, House 8',
      city:    'Karen',
    },
    createdAt: '2026-03-07T10:30:00.000Z',
  },

  {
    id: 'ORD-R4Y0E7',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1 }, // Cup Organizer ×1 = 2,200
    ],
    total: 2_200,
    deliveryMethod: 'pickup',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'Esther Wangari',
      email:   'e.wangari@example.com',
      phone:   '+254 733 890 345',
      address: 'Apt 6B, Kileleshwa Lane',
      city:    'Kileleshwa',
    },
    createdAt: '2026-03-05T15:00:00.000Z',
  },

  {
    id: 'ORD-M8T1K3',
    items: [
      { product: MOCK_PRODUCTS[4], quantity: 3 }, // Underbed Bag ×3 = 5,250
    ],
    total: 5_250,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'Mary Waweru',
      email:   'm.waweru@example.com',
      phone:   '+254 722 012 678',
      address: 'Lavington Green House, Garden Rd',
      city:    'Lavington',
    },
    createdAt: '2026-03-02T09:15:00.000Z',
  },

  {
    id: 'ORD-R3N8V6',
    items: [
      { product: MOCK_PRODUCTS[8], quantity: 3 }, // Fabric Baskets ×3 = 5,997
    ],
    total: 6_297,
    deliveryMethod: 'standard-nationwide',
    deliveryFee: 300,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'Ruth Chebet',
      email:   'r.chebet@example.com',
      phone:   '+254 711 234 890',
      address: '14 Kisumu–Eldoret Highway',
      city:    'Eldoret',
    },
    createdAt: '2026-02-28T11:00:00.000Z',
  },

  {
    id: 'ORD-D7L2M5',
    items: [
      { product: MOCK_PRODUCTS[3], quantity: 3 }, // Velvet Hangers ×3 = 3,600
      { product: MOCK_PRODUCTS[6], quantity: 2 }, // Cable Box ×2 = 5,800
    ],
    total: 9_400,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'mpesa',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    customer: {
      name:    'David Mwangi',
      email:   'd.mwangi@example.com',
      phone:   '+254 722 567 890',
      address: 'Kimathi Street Office, 3rd Floor',
      city:    'Nairobi CBD',
    },
    createdAt: '2026-02-25T14:30:00.000Z',
  },

  // ── Cancelled ─────────────────────────────────────────────────────────────

  {
    id: 'ORD-A9Z3K8',
    items: [
      { product: MOCK_PRODUCTS[7], quantity: 1 }, // Storage Bins ×1 = 4,200
    ],
    total: 4_200,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee: 0,
    paymentMethod: 'cod',
    paymentStatus: 'failed',
    orderStatus: 'cancelled',
    customer: {
      name:    'Alice Omondi',
      email:   'a.omondi@example.com',
      phone:   '+254 733 123 456',
      address: 'Embakasi Village, Phase 2',
      city:    'Embakasi',
    },
    createdAt: '2026-03-04T16:00:00.000Z',
  },
]
