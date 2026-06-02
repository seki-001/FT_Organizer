/**
 * Stage 13 — admin business module preview data.
 * Clearly marked demo records; no live financial processing.
 */

// ─── Quotations ───────────────────────────────────────────────────────────────

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'

export interface QuotationLineItem {
  id: string
  type: 'service' | 'product' | 'fee_redemption'
  description: string
  quantity: number
  unitPrice: number
}

export interface AdminQuotation {
  id: string
  clientId: string
  clientName: string
  status: QuotationStatus
  createdAt: string
  validUntil: string
  subtotal: number
  siteVisitFeeRedeemed?: number
  total: number
  lineItems: QuotationLineItem[]
}

export const MOCK_QUOTATIONS: AdminQuotation[] = [
  {
    id: 'QUO-1042',
    clientId: 'cust-001',
    clientName: 'Wanjiku Kamau',
    status: 'sent',
    createdAt: '2026-05-28',
    validUntil: '2026-06-15',
    subtotal: 28_000,
    siteVisitFeeRedeemed: 2_500,
    total: 25_500,
    lineItems: [
      { id: 'l1', type: 'service', description: 'Whole house organizing — 2 days', quantity: 1, unitPrice: 25_000 },
      { id: 'l2', type: 'product', description: 'Velvet hangers (50-pack)', quantity: 1, unitPrice: 3_000 },
      { id: 'l3', type: 'fee_redemption', description: 'Site visit fee redemption (50% rule)', quantity: 1, unitPrice: -2_500 },
    ],
  },
  {
    id: 'QUO-1038',
    clientId: 'cust-003',
    clientName: 'John Mutiso',
    status: 'accepted',
    createdAt: '2026-05-20',
    validUntil: '2026-06-05',
    subtotal: 18_000,
    total: 18_000,
    lineItems: [
      { id: 'l1', type: 'service', description: 'Home office setup', quantity: 1, unitPrice: 18_000 },
    ],
  },
  {
    id: 'QUO-1031',
    clientId: 'cust-004',
    clientName: 'Grace Njeri',
    status: 'draft',
    createdAt: '2026-06-01',
    validUntil: '2026-06-20',
    subtotal: 42_000,
    total: 42_000,
    lineItems: [
      { id: 'l1', type: 'service', description: 'Runda full-home staging', quantity: 1, unitPrice: 42_000 },
    ],
  },
  {
    id: 'QUO-1025',
    clientId: 'cust-002',
    clientName: 'Aisha Mohamed',
    status: 'expired',
    createdAt: '2026-04-10',
    validUntil: '2026-04-30',
    subtotal: 9_500,
    total: 9_500,
    lineItems: [
      { id: 'l1', type: 'service', description: 'Kitchen organization', quantity: 1, unitPrice: 9_500 },
    ],
  },
]

// ─── Invoices ─────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid' | 'overdue'

export interface AdminInvoice {
  id: string
  clientId: string
  clientName: string
  quotationId?: string
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
  total: number
  paid: number
  lineItems: QuotationLineItem[]
}

export const MOCK_INVOICES: AdminInvoice[] = [
  {
    id: 'INV-2041',
    clientId: 'cust-004',
    clientName: 'Grace Njeri',
    quotationId: 'QUO-1031',
    status: 'overdue',
    issuedAt: '2026-05-18',
    dueAt: '2026-05-28',
    total: 12_800,
    paid: 0,
    lineItems: [{ id: 'l1', type: 'service', description: 'Closet overhaul', quantity: 1, unitPrice: 12_800 }],
  },
  {
    id: 'INV-2038',
    clientId: 'cust-003',
    clientName: 'John Mutiso',
    quotationId: 'QUO-1038',
    status: 'partial',
    issuedAt: '2026-05-22',
    dueAt: '2026-06-10',
    total: 18_000,
    paid: 9_000,
    lineItems: [{ id: 'l1', type: 'service', description: 'Home office setup', quantity: 1, unitPrice: 18_000 }],
  },
  {
    id: 'INV-2050',
    clientId: 'cust-001',
    clientName: 'Wanjiku Kamau',
    status: 'paid',
    issuedAt: '2026-05-30',
    dueAt: '2026-06-15',
    total: 25_500,
    paid: 25_500,
    lineItems: [{ id: 'l1', type: 'service', description: 'Organizing package', quantity: 1, unitPrice: 25_500 }],
  },
]

// ─── Payments ─────────────────────────────────────────────────────────────────

export type AdminPaymentMethod = 'mpesa' | 'card' | 'bank' | 'cash'
export type AdminPaymentRecordStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export interface AdminPayment {
  id: string
  clientName: string
  invoiceId?: string
  amount: number
  method: AdminPaymentMethod
  status: AdminPaymentRecordStatus
  reference: string
  recordedAt: string
}

export const MOCK_PAYMENTS: AdminPayment[] = [
  { id: 'PAY-8821', clientName: 'John Mutiso', invoiceId: 'INV-2038', amount: 9_000, method: 'mpesa', status: 'paid', reference: 'QHK7X9B2LP', recordedAt: '2026-06-01T10:22:00Z' },
  { id: 'PAY-8819', clientName: 'Wanjiku Kamau', invoiceId: 'INV-2050', amount: 25_500, method: 'mpesa', status: 'paid', reference: 'PLM3N8K4WQ', recordedAt: '2026-05-31T14:05:00Z' },
  { id: 'PAY-8814', clientName: 'Fatuma Hassan', amount: 5_100, method: 'card', status: 'pending', reference: 'FLW-882914', recordedAt: '2026-05-30T09:15:00Z' },
  { id: 'PAY-8808', clientName: 'Esther Wangari', amount: 1_950, method: 'mpesa', status: 'failed', reference: '—', recordedAt: '2026-05-29T16:40:00Z' },
]

// ─── Debtors ──────────────────────────────────────────────────────────────────

export interface AdminDebtor {
  id: string
  clientId: string
  clientName: string
  phone: string
  amountDue: number
  overdueDays: number
  lastFollowUp: string
  nextFollowUp: string
}

export const MOCK_DEBTORS: AdminDebtor[] = [
  { id: 'd1', clientId: 'cust-004', clientName: 'Grace Njeri', phone: '+254 745 678 901', amountDue: 12_800, overdueDays: 14, lastFollowUp: '2026-05-30', nextFollowUp: '2026-06-03' },
  { id: 'd2', clientId: 'cust-003', clientName: 'John Mutiso', phone: '+254 734 567 890', amountDue: 9_000, overdueDays: 0, lastFollowUp: '2026-06-01', nextFollowUp: '2026-06-08' },
  { id: 'd3', clientId: 'cust-006', clientName: 'Brian Otieno', phone: '+254 711 222 333', amountDue: 8_400, overdueDays: 10, lastFollowUp: '2026-05-25', nextFollowUp: '2026-06-02' },
]

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryRow {
  productId: string
  name: string
  sku: string
  category: string
  onHand: number
  reserved: number
  reorderAt: number
  lastMovement: string
}

export const MOCK_INVENTORY: InventoryRow[] = [
  { productId: 'p1', name: 'Velvet Hangers (50-Pack)', sku: 'VH-50', category: 'Closet', onHand: 24, reserved: 3, reorderAt: 10, lastMovement: '2026-05-28' },
  { productId: 'p2', name: 'Fruit & Vegetable Holder', sku: 'FV-H1', category: 'Kitchen', onHand: 1, reserved: 0, reorderAt: 5, lastMovement: '2026-05-20' },
  { productId: 'p3', name: 'Under-Bed Storage Bag', sku: 'UB-01', category: 'Storage', onHand: 2, reserved: 1, reorderAt: 8, lastMovement: '2026-05-15' },
  { productId: 'p4', name: 'Cable Management Box', sku: 'CM-BX', category: 'Office', onHand: 3, reserved: 0, reorderAt: 6, lastMovement: '2026-06-01' },
]

// ─── Purchases ────────────────────────────────────────────────────────────────

export type PurchasePaymentStatus = 'unpaid' | 'partial' | 'paid'

export interface AdminPurchase {
  id: string
  supplier: string
  item: string
  quantity: number
  unitCost: number
  totalCost: number
  paymentStatus: PurchasePaymentStatus
  purchasedAt: string
  receiptNote?: string
}

export const MOCK_PURCHASES: AdminPurchase[] = [
  { id: 'PUR-301', supplier: 'Nairobi Storage Co.', item: 'Stacking bins (carton)', quantity: 40, unitCost: 850, totalCost: 34_000, paymentStatus: 'paid', purchasedAt: '2026-05-25', receiptNote: 'Delivery note #NS-8821' },
  { id: 'PUR-298', supplier: 'Velvet Imports Ltd', item: 'Hanger packs', quantity: 100, unitCost: 420, totalCost: 42_000, paymentStatus: 'partial', purchasedAt: '2026-05-18' },
]

// ─── Expenses ─────────────────────────────────────────────────────────────────

export interface AdminExpense {
  id: string
  category: string
  amount: number
  date: string
  method: AdminPaymentMethod
  description: string
  clientOrProject?: string
  receiptNote?: string
}

export const MOCK_EXPENSES: AdminExpense[] = [
  { id: 'EXP-441', category: 'Transport', amount: 3_200, date: '2026-06-01', method: 'mpesa', description: 'Team van fuel — Westlands jobs', clientOrProject: 'BK-2601A1' },
  { id: 'EXP-438', category: 'Supplies', amount: 1_850, date: '2026-05-28', method: 'cash', description: 'Labels & bins for Karen visit', clientOrProject: 'Wanjiku Kamau' },
  { id: 'EXP-430', category: 'Marketing', amount: 8_000, date: '2026-05-20', method: 'bank', description: 'Instagram ads — May', receiptNote: 'Invoice #MKT-22' },
]

// ─── Follow-ups ───────────────────────────────────────────────────────────────

export type FollowUpType = '1_week' | '1_month' | 'custom'
export type FollowUpChannel = 'whatsapp' | 'email' | 'phone'
export type FollowUpStatus = 'scheduled' | 'sent' | 'completed' | 'skipped'

export interface AdminFollowUp {
  id: string
  clientName: string
  type: FollowUpType
  channel: FollowUpChannel
  status: FollowUpStatus
  scheduledAt: string
  satisfaction?: 'great' | 'okay' | 'needs_attention'
  upsellNote?: string
}

export const MOCK_FOLLOW_UPS: AdminFollowUp[] = [
  { id: 'FU-88', clientName: 'Mary Waweru', type: '1_week', channel: 'whatsapp', status: 'completed', scheduledAt: '2026-06-01', satisfaction: 'great', upsellNote: 'Interested in pantry products' },
  { id: 'FU-89', clientName: 'Samuel Ndungu', type: '1_week', channel: 'phone', status: 'scheduled', scheduledAt: '2026-06-03' },
  { id: 'FU-90', clientName: 'Priya Patel', type: '1_month', channel: 'email', status: 'sent', scheduledAt: '2026-05-30' },
  { id: 'FU-91', clientName: 'Ruth Chebet', type: 'custom', channel: 'whatsapp', status: 'skipped', scheduledAt: '2026-05-28' },
]

// ─── Loyalty ──────────────────────────────────────────────────────────────────

export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  benefits: string[]
  memberCount: number
}

export interface LoyaltyRedemption {
  id: string
  clientName: string
  reward: string
  points: number
  date: string
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { id: 'bronze', name: 'Bronze', minPoints: 0, benefits: ['5% off shop'], memberCount: 98 },
  { id: 'silver', name: 'Silver', minPoints: 500, benefits: ['10% off shop', 'Priority booking'], memberCount: 32 },
  { id: 'gold', name: 'Gold', minPoints: 1500, benefits: ['15% off', 'Free site visit yearly', 'Referral bonus'], memberCount: 13 },
]

export const MOCK_REDEMPTIONS: LoyaltyRedemption[] = [
  { id: 'R-12', clientName: 'Wanjiku Kamau', reward: 'KSh 500 shop voucher', points: 200, date: '2026-05-20' },
  { id: 'R-11', clientName: 'Grace Njeri', reward: '10% service discount', points: 350, date: '2026-05-10' },
]

// ─── Reports catalog ──────────────────────────────────────────────────────────

export interface ReportCatalogItem {
  id: string
  title: string
  description: string
  category: 'sales' | 'operations' | 'finance' | 'inventory' | 'crm'
}

export const REPORT_CATALOG: ReportCatalogItem[] = [
  { id: 'sales', title: 'Sales overview', description: 'Shop + service revenue', category: 'sales' },
  { id: 'bookings', title: 'Bookings', description: 'Pipeline and conversion', category: 'operations' },
  { id: 'service-revenue', title: 'Service revenue', description: 'By service type', category: 'sales' },
  { id: 'product-sales', title: 'Product sales', description: 'Units and categories', category: 'sales' },
  { id: 'expenses', title: 'Expenses', description: 'By category', category: 'finance' },
  { id: 'purchases', title: 'Purchases', description: 'Supplier spend', category: 'finance' },
  { id: 'pnl', title: 'Profit & loss', description: 'Summary P&L preview', category: 'finance' },
  { id: 'debtors', title: 'Debtors', description: 'Aging and balances', category: 'finance' },
  { id: 'inventory', title: 'Inventory', description: 'Stock and movement', category: 'inventory' },
  { id: 'loyalty', title: 'Loyalty', description: 'Tiers and redemptions', category: 'crm' },
  { id: 'follow-ups', title: 'Follow-ups', description: 'Completion rates', category: 'crm' },
  { id: 'locations', title: 'Location performance', description: 'Revenue by area', category: 'sales' },
]
