import { NextRequest } from 'next/server'
import { z } from 'zod'
import { apiError, apiSuccess } from '@/lib/api-response'
import { getOrderByReference, updateOrderPaymentMethod } from '@/lib/db/orders'
import { enforceRateLimit } from '@/lib/rate-limit'

const PatchSchema = z.object({
  paymentMethod: z.enum(['mpesa', 'card', 'cod']).optional(),
}).strict()

export async function GET(
  _request: NextRequest,
  { params }: { params: { reference: string } },
) {
  const limited = enforceRateLimit(_request, 'orders-get', { limit: 60, windowMs: 60_000 })
  if (limited) return limited

  const order = await getOrderByReference(params.reference)
  if (!order) {
    return apiError('Order not found.', 'NOT_FOUND', 404)
  }

  return apiSuccess({ order })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { reference: string } },
) {
  const limited = enforceRateLimit(request, 'orders-patch', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  const body = await request.json() as unknown
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Invalid update.', 'VALIDATION_ERROR', 400)
  }

  if (parsed.data.paymentMethod) {
    const ok = await updateOrderPaymentMethod(params.reference, parsed.data.paymentMethod)
    if (!ok) return apiError('Order not found.', 'NOT_FOUND', 404)
  }

  const order = await getOrderByReference(params.reference)
  return apiSuccess({ success: true, order })
}
