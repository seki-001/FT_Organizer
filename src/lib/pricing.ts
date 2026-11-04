import { createAdminClient } from '@/lib/supabase/admin'
import { DELIVERY_OPTIONS } from '@/lib/constants'
import { findCouponByCode } from '@/lib/db/coupons'
import { rowToProduct } from '@/lib/db/mappers'
import type { CreateOrderInput } from '@/lib/validations'

export class PricingError extends Error {
  constructor(public code: string, message: string) {
    super(code)
    this.name = 'PricingError'
    this.message = message
  }
}

export interface PricedOrder {
  items: (CreateOrderInput['items'][number] & { productId?: string })[]
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  couponId: string | null
}

/**
 * Recomputes every monetary field of an order from the database.
 * Client-supplied prices, discounts and delivery fees are never trusted.
 */
export async function priceOrder(input: CreateOrderInput): Promise<PricedOrder> {
  const admin = createAdminClient()
  const slugs = Array.from(new Set(input.items.map((i) => i.productSlug)))
  const { data, error } = await admin.from('products').select('*').in('slug', slugs)
  if (error) throw error
  const bySlug = new Map((data ?? []).map((row) => [row.slug, rowToProduct(row)]))

  // Merge duplicate lines so stock checks see the true quantity.
  const qtyBySlug = new Map<string, number>()
  for (const i of input.items) qtyBySlug.set(i.productSlug, (qtyBySlug.get(i.productSlug) ?? 0) + i.quantity)

  const items = input.items.map((item) => {
    const product = bySlug.get(item.productSlug)
    if (!product) throw new PricingError('PRODUCT_UNAVAILABLE', `"${item.productName}" is no longer available.`)
    if (!product.inStock || product.stockCount <= 0) {
      throw new PricingError('OUT_OF_STOCK', `"${product.name}" is out of stock.`)
    }
    if ((qtyBySlug.get(item.productSlug) ?? 0) > product.stockCount) {
      throw new PricingError('INSUFFICIENT_STOCK', `Only ${product.stockCount} of "${product.name}" left in stock.`)
    }
    const variantId = typeof item.variant?.id === 'string' ? item.variant.id : undefined
    const variant = variantId ? product.variants?.find((v) => v.id === variantId) : undefined
    if (variantId && !variant) throw new PricingError('VARIANT_UNAVAILABLE', `That option for "${product.name}" is unavailable.`)
    if (variant && !variant.inStock) throw new PricingError('OUT_OF_STOCK', `That option for "${product.name}" is out of stock.`)
    const unitPrice = (product.salePrice ?? product.price) + (variant?.priceModifier ?? 0)
    return { ...item, productId: product.id, productName: product.name, unitPrice }
  })

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === input.deliveryMethod)
  if (!delivery) throw new PricingError('INVALID_DELIVERY', 'Invalid delivery method.')
  const deliveryFee = delivery.price

  let discount = 0
  let couponId: string | null = null
  if (input.promoCode?.trim()) {
    const coupon = await findCouponByCode(input.promoCode)
    const valid = coupon && coupon.active
      && !(coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
      && !(coupon.usageLimit !== null && coupon.uses >= coupon.usageLimit)
      && subtotal >= coupon.minOrder
    if (!coupon || !valid) throw new PricingError('INVALID_COUPON', 'That coupon code is not valid for this order.')
    discount = Math.min(subtotal, coupon.type === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : coupon.value)
    couponId = coupon.id
  }

  return { items, subtotal, deliveryFee, discount, total: subtotal - discount + deliveryFee, couponId }
}
