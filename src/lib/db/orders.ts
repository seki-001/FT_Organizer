import { randomBytes } from 'crypto'
import type { Order } from '@/lib/types'
import type { CreateOrderInput } from '@/lib/validations'
import { MOCK_ADMIN_ORDERS } from '@/lib/mock-admin-orders'
import { MOCK_ORDERS } from '@/lib/mock-account'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseAdminConfigured, isSupabaseConfigured } from '@/lib/supabase/env'
import { orderRowToOrder } from '@/lib/db/mappers'
import { listProducts } from '@/lib/db/products'
import { logger } from '@/lib/logger'
import { priceOrder, PricingError } from '@/lib/pricing'
import { allowMockData } from '@/lib/mock-guard'
import type { Json } from '@/types/database'

function generateOrderReference(): string {
  // Unguessable: the reference is the only secret protecting the public order-status lookup.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(10)
  return 'ORD-' + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

export async function listOrders(): Promise<Order[]> {
  if (!isSupabaseAdminConfigured()) {
    return allowMockData() ? [...MOCK_ADMIN_ORDERS] : []
  }

  const admin = createAdminClient()
  const { data: orders, error } = await admin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    logger.error({ event: 'orders_list_failed', error_code: error.code })
    throw error
  }

  const products = await listProducts({})
  const resolver = (slug: string) => products.find((p) => p.slug === slug)

  const result: Order[] = []
  for (const row of orders ?? []) {
    const { data: items } = await admin.from('order_items').select('*').eq('order_id', row.id)
    result.push(await orderRowToOrder(row, items ?? [], resolver))
  }
  return result
}

export async function updateOrderStatus(reference: string, orderStatus: Order['orderStatus']) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin.from('orders').update({ order_status: orderStatus }).eq('reference', reference)
  if (error) {
    logger.error({ event: 'order_status_update_failed', error_code: error.code, resource_id: reference })
    return false
  }
  return true
}

export async function updateOrderPaymentStatus(reference: string, paymentStatus: Order['paymentStatus']) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin.from('orders').update({ payment_status: paymentStatus }).eq('reference', reference)
  return !error
}

export async function listOrdersForUser(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return allowMockData() ? MOCK_ORDERS : []
  }

  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !orders?.length) {
    if (error) logger.error({ event: 'user_orders_list_failed', error_code: error.code, user_id: userId })
    return isSupabaseAdminConfigured() || !allowMockData() ? [] : MOCK_ORDERS
  }

  const products = await listProducts({})
  const resolver = (slug: string) => products.find((p) => p.slug === slug)
  const result: Order[] = []

  for (const row of orders) {
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', row.id)
    result.push(await orderRowToOrder(row, items ?? [], resolver))
  }

  return result
}

export async function createOrder(
  input: CreateOrderInput,
  userId?: string | null,
): Promise<{ reference: string; id: string }> {
  if (!isSupabaseAdminConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED')
  }

  // Never trust client-sent money fields: reprice from the database.
  const priced = await priceOrder(input)
  if (Math.abs(priced.total - input.total) > 1) {
    throw new PricingError('PRICE_CHANGED', 'Prices changed since you added items. Please review your cart and try again.')
  }

  const reference = generateOrderReference()
  const admin = createAdminClient()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      reference,
      user_id: userId ?? null,
      subtotal: priced.subtotal,
      delivery_fee: priced.deliveryFee,
      total: priced.total,
      delivery_method: input.deliveryMethod,
      payment_method: input.paymentMethod,
      payment_status: 'pending',
      order_status: 'processing',
      customer_name: input.customer.name,
      customer_email: input.customer.email,
      customer_phone: input.customer.phone,
      customer_address: input.customer.address,
      customer_city: input.customer.city,
      customer_notes: input.customer.notes ?? null,
    })
    .select('id, reference')
    .single()

  if (orderError || !order) {
    logger.error({ event: 'order_create_failed', error_code: orderError?.code })
    throw new Error('ORDER_CREATE_FAILED')
  }

  const orderItems = priced.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId ?? null,
    product_slug: item.productSlug,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    variant: (item.variant ?? null) as Json | null,
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) {
    logger.error({ event: 'order_items_create_failed', error_code: itemsError.code, resource_id: reference })
    throw new Error('ORDER_ITEMS_CREATE_FAILED')
  }

  // Reserve stock for the order (best effort; admin can restock if the order is cancelled).
  for (const item of priced.items) {
    if (!item.productId) continue
    const { data: p } = await admin.from('products').select('stock_count').eq('id', item.productId).maybeSingle()
    if (p) {
      const next = Math.max(0, p.stock_count - item.quantity)
      await admin.from('products').update({ stock_count: next, in_stock: next > 0 }).eq('id', item.productId)
    }
  }

  if (priced.couponId) {
    const { data: c } = await admin.from('coupons').select('uses').eq('id', priced.couponId).maybeSingle()
    if (c) await admin.from('coupons').update({ uses: c.uses + 1 }).eq('id', priced.couponId)
  }

  logger.info({
    event: 'order_created',
    resource_id: reference,
    user_id: userId ?? undefined,
    action: input.paymentMethod,
  })

  return { reference: order.reference, id: order.id }
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data: row, error } = await admin
    .from('orders')
    .select('*')
    .eq('reference', reference)
    .maybeSingle()

  if (error || !row) return null

  const { data: items } = await admin.from('order_items').select('*').eq('order_id', row.id)
  const products = await listProducts({})
  const resolver = (slug: string) => products.find((p) => p.slug === slug)
  return orderRowToOrder(row, items ?? [], resolver)
}

export async function updateOrderPaymentMethod(reference: string, paymentMethod: Order['paymentMethod']) {
  if (!isSupabaseAdminConfigured()) return false

  const admin = createAdminClient()
  const { error } = await admin
    .from('orders')
    .update({ payment_method: paymentMethod })
    .eq('reference', reference)

  return !error
}
