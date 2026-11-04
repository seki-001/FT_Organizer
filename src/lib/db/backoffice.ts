import type {
  BusinessCustomer, Expense, ExpenseCategory, PaymentMethod, Purchase, Sale, SaleItem,
} from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import type { Json, Tables } from '@/types/database'

/** Thrown when the database is not configured so API routes can return a clear 503. */
export class BackofficeUnavailableError extends Error {
  constructor() {
    super('Database is not configured')
    this.name = 'BackofficeUnavailableError'
  }
}

function db() {
  if (!isSupabaseAdminConfigured()) throw new BackofficeUnavailableError()
  return createAdminClient()
}

/* ───────────── Customers ───────────── */

function rowToCustomer(r: Tables<'business_customers'>): BusinessCustomer {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    address: r.address ?? undefined,
    creditBalance: Number(r.credit_balance),
    totalPurchases: Number(r.total_purchases),
    lastPurchaseAt: r.last_purchase_at ?? undefined,
    createdAt: r.created_at,
    notes: r.notes ?? undefined,
  }
}

export async function listCustomers(): Promise<BusinessCustomer[]> {
  const { data, error } = await db().from('business_customers').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(rowToCustomer)
}

export async function createCustomer(input: {
  name: string; phone: string; email?: string; address?: string; notes?: string
}): Promise<BusinessCustomer> {
  const { data, error } = await db().from('business_customers').insert({
    name: input.name, phone: input.phone,
    email: input.email || null, address: input.address || null, notes: input.notes || null,
  }).select().single()
  if (error) throw error
  return rowToCustomer(data)
}

/** Adjust a customer's outstanding balance. delta > 0 = they owe more (credit sale); < 0 = payment received. */
export async function adjustCustomerBalance(id: string, delta: number): Promise<BusinessCustomer | null> {
  const client = db()
  const { data: current, error: readErr } = await client.from('business_customers').select('*').eq('id', id).maybeSingle()
  if (readErr) throw readErr
  if (!current) return null
  const patch: { credit_balance: number; total_purchases?: number; last_purchase_at?: string } = {
    credit_balance: Number(current.credit_balance) + delta,
  }
  if (delta > 0) {
    patch.total_purchases = Number(current.total_purchases) + delta
    patch.last_purchase_at = new Date().toISOString()
  }
  const { data, error } = await client.from('business_customers').update(patch).eq('id', id).select().single()
  if (error) throw error
  return rowToCustomer(data)
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await db().from('business_customers').delete().eq('id', id)
  if (error) throw error
}

/* ───────────── Expenses ───────────── */

function rowToExpense(r: Tables<'expenses'>): Expense {
  return {
    id: r.id,
    description: r.description,
    category: r.category as ExpenseCategory,
    amount: Number(r.amount),
    paymentMethod: r.payment_method,
    date: r.expense_date,
    createdAt: r.created_at,
    attachmentUrl: r.attachment_url ?? undefined,
    note: r.note ?? undefined,
  }
}

export async function listExpenses(): Promise<Expense[]> {
  const { data, error } = await db().from('expenses').select('*').order('expense_date', { ascending: false }).limit(5000)
  if (error) throw error
  return (data ?? []).map(rowToExpense)
}

export async function createExpense(input: {
  description: string; category: ExpenseCategory; amount: number
  paymentMethod: PaymentMethod; date: string; note?: string
}): Promise<Expense> {
  const { data, error } = await db().from('expenses').insert({
    description: input.description, category: input.category, amount: input.amount,
    payment_method: input.paymentMethod, expense_date: input.date, note: input.note || null,
  }).select().single()
  if (error) throw error
  return rowToExpense(data)
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await db().from('expenses').delete().eq('id', id)
  if (error) throw error
}

/* ───────────── Stock helpers ───────────── */

async function adjustStock(items: { productId?: string; quantity: number }[], direction: 1 | -1) {
  const client = db()
  for (const item of items) {
    if (!item.productId) continue
    const { data: p } = await client.from('products').select('id, stock_count').eq('id', item.productId).maybeSingle()
    if (!p) continue
    const next = Math.max(0, p.stock_count + direction * item.quantity)
    await client.from('products').update({ stock_count: next, in_stock: next > 0 }).eq('id', p.id)
  }
}

/* ───────────── Purchases ───────────── */

function rowToPurchase(r: Tables<'purchases'>): Purchase {
  return {
    id: r.id,
    supplierName: r.supplier_name,
    items: (r.items as unknown as Purchase['items']) ?? [],
    subtotal: Number(r.subtotal),
    total: Number(r.total),
    paymentMethod: r.payment_method,
    date: r.purchase_date,
    createdAt: r.created_at,
    invoiceNo: r.invoice_no ?? undefined,
    note: r.note ?? undefined,
  }
}

export async function listPurchases(): Promise<Purchase[]> {
  const { data, error } = await db().from('purchases').select('*').order('purchase_date', { ascending: false }).limit(5000)
  if (error) throw error
  return (data ?? []).map(rowToPurchase)
}

export async function createPurchase(input: {
  supplierName: string; items: Purchase['items']; paymentMethod: PaymentMethod
  date: string; invoiceNo?: string; note?: string
}): Promise<Purchase> {
  const subtotal = input.items.reduce((s, i) => s + i.quantity * i.unitCost, 0)
  const items = input.items.map((i) => ({ ...i, total: i.quantity * i.unitCost }))
  const { data, error } = await db().from('purchases').insert({
    supplier_name: input.supplierName, items: items as unknown as Json,
    subtotal, total: subtotal, payment_method: input.paymentMethod,
    purchase_date: input.date, invoice_no: input.invoiceNo || null, note: input.note || null,
  }).select().single()
  if (error) throw error
  await adjustStock(items, 1)
  return rowToPurchase(data)
}

export async function deletePurchase(id: string): Promise<void> {
  const { error } = await db().from('purchases').delete().eq('id', id)
  if (error) throw error
}

/* ───────────── Sales (POS) ───────────── */

function rowToSale(r: Tables<'sales'>): Sale {
  return {
    id: r.id,
    items: (r.items as unknown as SaleItem[]) ?? [],
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    total: Number(r.total),
    paymentMethod: r.payment_method,
    customerId: r.customer_id ?? undefined,
    customerName: r.customer_name ?? undefined,
    cashierName: r.cashier_name,
    createdAt: r.created_at,
    receiptNo: r.receipt_no,
    note: r.note ?? undefined,
  }
}

export async function listSales(limit = 2000): Promise<Sale[]> {
  const { data, error } = await db().from('sales').select('*').order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []).map(rowToSale)
}

function newReceiptNo(): string {
  const d = new Date()
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `RCP-${stamp}-${Math.random().toString(36).toUpperCase().slice(2, 7)}`
}

export async function createSale(input: {
  items: SaleItem[]; discount: number; paymentMethod: PaymentMethod
  customerId?: string; customerName?: string; cashierName: string; note?: string
}): Promise<Sale> {
  const items = input.items.map((i) => ({ ...i, total: i.quantity * i.unitPrice }))
  const subtotal = items.reduce((s, i) => s + i.total, 0)
  const discount = Math.min(Math.max(0, input.discount), subtotal)
  const total = subtotal - discount

  if (input.paymentMethod === 'credit' && !input.customerId) {
    throw new Error('A customer is required for credit sales')
  }

  const { data, error } = await db().from('sales').insert({
    receipt_no: newReceiptNo(), items: items as unknown as Json, subtotal, discount, total,
    payment_method: input.paymentMethod, customer_id: input.customerId ?? null,
    customer_name: input.customerName ?? null, cashier_name: input.cashierName, note: input.note || null,
  }).select().single()
  if (error) throw error

  await adjustStock(items, -1)
  if (input.customerId) {
    // Credit sales raise the balance; other methods only add to purchase history.
    if (input.paymentMethod === 'credit') {
      await adjustCustomerBalance(input.customerId, total)
    } else {
      const client = db()
      const { data: c } = await client.from('business_customers').select('total_purchases').eq('id', input.customerId).maybeSingle()
      if (c) {
        await client.from('business_customers').update({
          total_purchases: Number(c.total_purchases) + total, last_purchase_at: new Date().toISOString(),
        }).eq('id', input.customerId)
      }
    }
  }
  return rowToSale(data)
}
