import { getOrderByReference } from '@/lib/db/orders'

export class PayableError extends Error {
  constructor(public code: string, message: string, public status: number) {
    super(message)
    this.name = 'PayableError'
  }
}

export interface Payable {
  amount: number
  /** True when the reference is a real shop order whose total is enforced server-side. */
  isOrder: boolean
  email?: string
}

const MAX_ADHOC_AMOUNT = 500_000

/**
 * Decides how much may be charged for a reference.
 * Shop orders (ORD-…) always use the stored order total — never a client-supplied amount.
 * Ad-hoc payment references (PAY-…) from /pay use the customer-entered invoice amount, bounded.
 */
export async function resolvePayable(orderRef: string, clientAmount: number): Promise<Payable> {
  if (orderRef.startsWith('ORD-')) {
    const order = await getOrderByReference(orderRef)
    if (!order) throw new PayableError('ORDER_NOT_FOUND', 'We could not find that order.', 404)
    if (order.paymentStatus === 'paid') throw new PayableError('ALREADY_PAID', 'This order is already paid.', 409)
    if (order.orderStatus === 'cancelled') throw new PayableError('ORDER_CANCELLED', 'This order was cancelled.', 409)
    return { amount: order.total, isOrder: true, email: order.customer.email }
  }
  if (!Number.isFinite(clientAmount) || clientAmount < 1 || clientAmount > MAX_ADHOC_AMOUNT) {
    throw new PayableError('INVALID_AMOUNT', `Enter an amount between KSh 1 and KSh ${MAX_ADHOC_AMOUNT.toLocaleString('en-KE')}.`, 400)
  }
  return { amount: Math.round(clientAmount), isOrder: false }
}
