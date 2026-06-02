import type { Booking } from '@/lib/types'

// ─── Extended type for admin use ──────────────────────────────────────────────

export type AdminBookingStatus = Booking['status'] | 'retained'

export interface AdminBooking extends Omit<Booking, 'status'> {
  status: AdminBookingStatus
  /** Nairobi neighbourhood / location */
  area:           string
  /** Preferred appointment time */
  timePreference: 'morning' | 'afternoon' | 'flexible'
  /** Admin-only notes, never shown to customer */
  internalNotes?: string
  /** Quote amount in KSh — set by admin before sending WhatsApp quote */
  quoteAmount?:   number
}

// ─── 15 mock bookings (March/April 2026 dates for realistic quick-stats) ─────

export const MOCK_ADMIN_BOOKINGS: AdminBooking[] = [

  // ── CONFIRMED ──────────────────────────────────────────────────────────────

  {
    id:             'BK-2601A1',
    service:        'professional-organizing-decluttering',
    date:           '2026-04-08',
    name:           'Wanjiku Kamau',
    email:          'wanjiku.kamau@gmail.com',
    phone:          '+254 722 123 456',
    propertyType:   'house',
    propertySize:   'large',
    notes:          "Four bedrooms. Master and kids' rooms are priority. Dog in the house — please note.",
    status:         'confirmed',
    area:           'Karen',
    timePreference: 'morning',
    quoteAmount:    25000,
    createdAt:      '2026-03-04T09:15:00.000Z',
  },

  {
    id:             'BK-2601A5',
    service:        'home-staging',
    date:           '2026-04-03',
    name:           'Mercy Ndungu',
    email:          'mercy.ndungu@gmail.com',
    phone:          '+254 700 567 890',
    propertyType:   'house',
    propertySize:   'medium',
    notes:          'Preparing house for sale. Full staging needed — we have no furniture yet.',
    status:         'confirmed',
    area:           'Lavington',
    timePreference: 'morning',
    quoteAmount:    18000,
    internalNotes:  'Agent referral from Pamela Homes. High-value lead.',
    createdAt:      '2026-03-06T11:45:00.000Z',
  },

  {
    id:             'BK-2601B0',
    service:        'online-consulting',
    date:           '2026-04-10',
    name:           'James Kariuki',
    email:          'james.kariuki@techcorp.co.ke',
    phone:          '+254 712 012 345',
    propertyType:   'apartment',
    propertySize:   'small',
    notes:          'Moving into a studio apartment, need virtual consultation on layout.',
    status:         'confirmed',
    area:           'Nairobi (Virtual)',
    timePreference: 'morning',
    quoteAmount:    3500,
    createdAt:      '2026-03-07T10:30:00.000Z',
  },

  // ── RETAINED (site visit fee redeemed, job booked) ─────────────────────────

  {
    id:             'BK-2601R1',
    service:        'professional-organizing-decluttering',
    date:           '2026-04-14',
    name:           'Wanjiku Kamau',
    email:          'wanjiku.kamau@gmail.com',
    phone:          '+254 722 123 456',
    propertyType:   'apartment',
    propertySize:   'medium',
    notes:          'Retained after site visit — full kitchen and pantry scope.',
    status:         'retained',
    area:           'Westlands',
    timePreference: 'morning',
    quoteAmount:    25500,
    internalNotes:  'Site visit fee redeemed per 50% rule.',
    createdAt:      '2026-03-12T08:00:00.000Z',
  },

  // ── QUOTED ─────────────────────────────────────────────────────────────────

  {
    id:             'BK-2601A4',
    service:        'relocation-transition',
    date:           '2026-04-22',
    name:           'Kiptoo Ruto',
    email:          'kiptoo.ruto@outlook.com',
    phone:          '+254 720 456 789',
    propertyType:   'house',
    propertySize:   'large',
    notes:          "Moving from Lang'ata to Runda. Need full packing + moving help.",
    status:         'quoted',
    area:           "Lang'ata",
    timePreference: 'flexible',
    quoteAmount:    32000,
    createdAt:      '2026-03-08T16:30:00.000Z',
  },

  {
    id:             'BK-2601A7',
    service:        'space-planning',
    date:           '2026-04-17',
    name:           'Fatuma Ali',
    email:          'fatuma.ali@gmail.com',
    phone:          '+254 725 789 012',
    propertyType:   'apartment',
    propertySize:   'medium',
    notes:          'New apartment — need layout plan before furniture arrives next month.',
    status:         'quoted',
    area:           'Kileleshwa',
    timePreference: 'flexible',
    quoteAmount:    9500,
    createdAt:      '2026-03-09T14:00:00.000Z',
  },

  {
    id:             'BK-2601B4',
    service:        'storage-design-installation',
    date:           '2026-04-28',
    name:           'Moses Kipchoge',
    email:          'moses.kipchoge@run.co.ke',
    phone:          '+254 722 456 789',
    propertyType:   'house',
    propertySize:   'medium',
    notes:          'New shelving in garage and pantry. Custom built-ins preferred.',
    status:         'quoted',
    area:           'Hurlingham',
    timePreference: 'afternoon',
    quoteAmount:    8500,
    createdAt:      '2026-03-10T11:00:00.000Z',
  },

  // ── NEW (4 new — 3 created this week Mar 12–18, 1 earlier) ────────────────

  {
    id:             'BK-2601A2',
    service:        'professional-organizing-decluttering',
    date:           '2026-04-15',
    name:           'Otieno Odhiambo',
    email:          'otieno.odhiambo@email.com',
    phone:          '+254 733 234 567',
    propertyType:   'apartment',
    propertySize:   'medium',
    notes:          'Mostly clothes, kitchen items and old documents.',
    status:         'new',
    area:           'Westlands',
    timePreference: 'afternoon',
    createdAt:      '2026-03-15T14:20:00.000Z', // this week
  },

  {
    id:             'BK-2601A6',
    service:        'storage-design-installation',
    date:           '2026-04-20',
    name:           'Brian Otieno',
    email:          'brian.otieno@ymail.com',
    phone:          '+254 715 678 901',
    propertyType:   'apartment',
    propertySize:   'small',
    notes:          'Small studio — need creative shelving solutions to maximise vertical space.',
    status:         'new',
    area:           'Kilimani',
    timePreference: 'afternoon',
    createdAt:      '2026-03-16T09:00:00.000Z', // this week
  },

  {
    id:             'BK-2601A9',
    service:        'paperwork-management',
    date:           '2026-04-25',
    name:           'Grace Akinyi',
    email:          'grace.akinyi@protonmail.com',
    phone:          '+254 730 901 234',
    propertyType:   'office',
    propertySize:   'small',
    notes:          '3 years of backlogged filing. Mostly tax and financial documents.',
    status:         'new',
    area:           'CBD',
    timePreference: 'afternoon',
    createdAt:      '2026-03-17T17:00:00.000Z', // this week
  },

  {
    id:             'BK-2601B3',
    service:        'professional-organizing-decluttering',
    date:           '2026-05-02',
    name:           'Hannah Njenga',
    email:          'hannah.njenga@gmail.com',
    phone:          '+254 710 345 678',
    propertyType:   'house',
    propertySize:   'large',
    notes:          'Full house with 5 bedrooms. Storage room and kitchen are highest priority.',
    status:         'new',
    area:           'Runda',
    timePreference: 'flexible',
    createdAt:      '2026-03-05T15:00:00.000Z',
  },

  // ── COMPLETED (3 — 2 in March 2026, 1 in Feb) ────────────────────────────

  {
    id:             'BK-2601A3',
    service:        'professional-organizing-decluttering',
    date:           '2026-03-10',
    name:           'Amina Hassan',
    email:          'amina.hassan@business.co.ke',
    phone:          '+254 711 345 678',
    propertyType:   'office',
    propertySize:   'medium',
    notes:          'Open-plan office, 12 workstations. Need a filing system and cable management.',
    status:         'completed',
    area:           'Upperhill',
    timePreference: 'morning',
    quoteAmount:    14000,
    internalNotes:  'Great client. Enquired about a monthly retainer — follow up.',
    createdAt:      '2026-03-01T10:00:00.000Z',
  },

  {
    id:             'BK-2601A8',
    service:        'packing-and-removal',
    date:           '2026-03-05',
    name:           'David Mwangi',
    email:          'david.mwangi@company.co.ke',
    phone:          '+254 701 890 123',
    propertyType:   'house',
    propertySize:   'medium',
    status:         'completed',
    area:           'South B',
    timePreference: 'morning',
    quoteAmount:    11000,
    internalNotes:  'Fast job — done in 6 hours. Left a 5-star Google review.',
    createdAt:      '2026-02-26T08:30:00.000Z',
  },

  {
    id:             'BK-2601B2',
    service:        'professional-organizing-decluttering',
    date:           '2026-02-25',
    name:           'Patrick Omondi',
    email:          'patrick.omondi@ngo.org',
    phone:          '+254 726 234 567',
    propertyType:   'office',
    propertySize:   'large',
    status:         'completed',
    area:           'Gigiri',
    timePreference: 'morning',
    quoteAmount:    22000,
    createdAt:      '2026-02-12T09:00:00.000Z',
  },

  // ── CANCELLED (2) ─────────────────────────────────────────────────────────

  {
    id:             'BK-2601B1',
    service:        'professional-organizing-decluttering',
    date:           '2026-03-28',
    name:           'Sophia Mutua',
    email:          'sophia.mutua@gmail.com',
    phone:          '+254 748 123 456',
    propertyType:   'house',
    propertySize:   'small',
    notes:          'Changed mind for now — will rebook when I move in March.',
    status:         'cancelled',
    area:           'Thika Road',
    timePreference: 'flexible',
    internalNotes:  'Wants to reschedule in May. Follow up end of April.',
    createdAt:      '2026-03-11T12:00:00.000Z',
  },

  {
    id:             'BK-2601B5',
    service:        'relocation-transition',
    date:           '2026-03-30',
    name:           'Rosemary Wekesa',
    email:          'rosemary.wekesa@gmail.com',
    phone:          '+254 735 567 890',
    propertyType:   'apartment',
    propertySize:   'medium',
    status:         'cancelled',
    area:           'Parklands',
    timePreference: 'morning',
    internalNotes:  'Found cheaper mover. Lost deal — consider a low-price tier.',
    createdAt:      '2026-03-02T10:30:00.000Z',
  },
]
