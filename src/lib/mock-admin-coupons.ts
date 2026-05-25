/** Coupon stored in DB / used in admin + public validate */
export interface Coupon {
  id:         string
  code:       string          // uppercase, e.g. "FAITH20"
  type:       'percentage' | 'fixed'
  value:      number          // % or KSh
  minOrder:   number          // 0 = no minimum
  usageLimit: number | null   // null = unlimited
  uses:       number
  expiresAt:  string | null   // ISO date or null
  active:     boolean
  createdAt:  string
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'cp-001', code: 'FIRSTORDER', type: 'percentage', value: 10,
    minOrder: 0,    usageLimit: 100,  uses: 24, expiresAt: '2026-12-31', active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'cp-002', code: 'FAITH20', type: 'percentage', value: 20,
    minOrder: 5000, usageLimit: 50,   uses: 8,  expiresAt: '2026-06-30', active: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp-003', code: 'WELCOME500', type: 'fixed', value: 500,
    minOrder: 3000, usageLimit: null, uses: 45, expiresAt: null, active: false,
    createdAt: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 'cp-004', code: 'MARCH500', type: 'fixed', value: 500,
    minOrder: 2000, usageLimit: 200,  uses: 72, expiresAt: '2026-03-31', active: true,
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'cp-005', code: 'SAVE15', type: 'percentage', value: 15,
    minOrder: 0, usageLimit: null, uses: 3, expiresAt: '2026-09-30', active: true,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
]

/** Generate a random coupon code suggestion */
export function generateCouponCode(): string {
  const prefixes  = ['SAVE', 'GET', 'FAITH', 'SHOP', 'DEAL', 'OFF']
  const prefix    = prefixes[Math.floor(Math.random() * prefixes.length)]
  const num       = Math.floor(Math.random() * 50) * 5 + 5 // 5, 10, 15 … 255
  return `${prefix}${num}`
}
