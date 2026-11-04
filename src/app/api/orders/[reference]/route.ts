import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { getOrderByReference, updateOrderPaymentMethod } from '@/lib/db/orders'
import { enforceRateLimit } from '@/lib/rate-limit'
import type { Order } from '@/lib/types'

/** The order reference is the only secret on this public endpoint, so never return contact details. */
function publicOrder(order: Order) {
  return {
    id: order.id,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    deliveryFee: order.deliveryFee,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
    customer: { name: order.customer.name.split(' ')[0] ?? '' },
    items: order.items.map((i) => ({
      quantity: i.quantity,
      product: { name: i.product.name, slug: i.product.slug },
      unitPrice: i.product.salePrice ?? i.product.price,
    })),
  }
}

const PatchSchema = z.object({
  paymentMethod: z.enum(['mpesa', 'card', 'cod']).optional(),
}).strict()

export async function GET(_request: NextRequest, props: { params: Promise<{ reference: string }> }) {
  const params = await props.params;
  const limited = await enforceRateLimit(_request, 'orders-get', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const order = await getOrderByReference(params.reference)
  if (!order) {
    return apiError('Order not found.', 'NOT_FOUND', 404)
  }

  return apiSuccess({ order: publicOrder(order) })
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ reference: string }> }) {
  const params = await props.params;
  const limited = await enforceRateLimit(request, 'orders-patch', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  const body = await request.json() as unknown
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Invalid update.', 'VALIDATION_ERROR', 400)
  }

  if (parsed.data.paymentMethod) {
    // Payment method may only change while the order is still unpaid and open.
    const current = await getOrderByReference(params.reference)
    if (!current) return apiError('Order not found.', 'NOT_FOUND', 404)
    if (current.paymentStatus !== 'pending' || current.orderStatus === 'cancelled') {
      return apiError('This order can no longer be changed.', 'ORDER_LOCKED', 409)
    }
    const ok = await updateOrderPaymentMethod(params.reference, parsed.data.paymentMethod)
    if (!ok) return apiError('Order not found.', 'NOT_FOUND', 404)
  }

  const order = await getOrderByReference(params.reference)
  return apiSuccess({ success: true, order: order ? publicOrder(order) : null })
}
