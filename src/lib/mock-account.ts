import type { Order, Booking } from '@/lib/types'
import { MOCK_PRODUCTS } from '@/lib/mock-products'

// ─── Mock Orders ──────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id:             'ORD-A4F2K1',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 2 },
      { product: MOCK_PRODUCTS[2], quantity: 1 },
    ],
    total:          7200,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee:    0,
    paymentMethod:  'mpesa',
    paymentStatus:  'paid',
    orderStatus:    'delivered',
    customer: {
      name:    'Demo User',
      email:   'demo@example.com',
      phone:   '0700 000 000',
      address: 'Apt 4B, Parklands Avenue',
      city:    'Parklands',
      notes:   'Call on arrival',
    },
    createdAt: '2025-02-14T10:30:00.000Z',
  },
  {
    id:             'ORD-B8G5R3',
    items: [
      { product: MOCK_PRODUCTS[5], quantity: 1 },
    ],
    total:          4500,
    deliveryMethod: 'standard-nationwide',
    deliveryFee:    300,
    paymentMethod:  'card',
    paymentStatus:  'paid',
    orderStatus:    'dispatched',
    customer: {
      name:    'Demo User',
      email:   'demo@example.com',
      phone:   '0700 000 000',
      address: 'House 12, Lavington Green',
      city:    'Lavington',
    },
    createdAt: '2025-03-01T14:15:00.000Z',
  },
  {
    id:             'ORD-C2J9T7',
    items: [
      { product: MOCK_PRODUCTS[10], quantity: 1 },
      { product: MOCK_PRODUCTS[11], quantity: 1 },
    ],
    total:          18500,
    deliveryMethod: 'nairobi-same-day',
    deliveryFee:    0,
    paymentMethod:  'mpesa',
    paymentStatus:  'pending',
    orderStatus:    'processing',
    customer: {
      name:    'Demo User',
      email:   'demo@example.com',
      phone:   '0700 000 000',
      address: 'Unit 8, Kilimani Court',
      city:    'Kilimani',
    },
    createdAt: '2025-03-10T09:00:00.000Z',
  },
]

// ─── Mock Bookings ────────────────────────────────────────────────────────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id:           'BK-230891',
    service:      'professional-organizing-decluttering',
    date:         '2026-06-09',
    name:         'Demo User',
    email:        'demo@example.com',
    phone:        '0700 000 000',
    propertyType: 'house',
    propertySize: 'large',
    notes:        'Three floors, master bedroom is priority.',
    status:       'confirmed',
    createdAt:    '2025-03-08T11:00:00.000Z',
  },
  {
    id:           'BK-112047',
    service:      'professional-organizing-decluttering',
    date:         '2025-02-20',
    name:         'Demo User',
    email:        'demo@example.com',
    phone:        '0700 000 000',
    propertyType: 'office',
    propertySize: 'medium',
    status:       'completed',
    createdAt:    '2025-02-10T08:30:00.000Z',
  },
  {
    id:           'BK-779534',
    service:      'storage-design-installation',
    date:         '2026-07-14',
    name:         'Demo User',
    email:        'demo@example.com',
    phone:        '0700 000 000',
    propertyType: 'apartment',
    propertySize: 'small',
    status:       'new',
    createdAt:    '2025-03-12T16:45:00.000Z',
  },
]
