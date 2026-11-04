import { logger } from '@/lib/logger'
import { verifyPaystackTransaction } from '@/lib/payments/paystack'
import {
  getInitiationEvent, insertPaymentEvent, updatePaymentEventStatus,
} from '@/lib/db/payments'
import { updateOrderPaymentStatus } from '@/lib/db/orders'

export interface CompletionResult {
  paid: boolean
  amount: number
  currency: string
}

/**
 * Confirms a Paystack transaction with Paystack itself and marks the order paid only when
 * the currency is KES and the amount covers what we asked to charge at initiation.
 * Safe to call repeatedly (browser redirect + webhook).
 */
export async function completePaystackPayment(reference: string): Promise<CompletionResult> {
  const initiation = await getInitiationEvent(reference)
  if (!initiation) {
    // Unknown reference: never mark anything paid.
    return { paid: false, amount: 0, currency: 'KES' }
  }

  const result = await verifyPaystackTransaction(reference)
  const expected = Number(initiation.amount ?? 0)
  const amountOk = result.currency === 'KES' && result.amount + 0.5 >= expected && expected > 0
  const paid = result.paid && amountOk

  if (initiation.status !== 'paid') {
    await insertPaymentEvent({
      orderReference: initiation.order_reference,
      provider: 'paystack',
      eventType: paid ? 'payment_verified' : 'payment_failed',
      externalId: reference,
      amount: Math.round(result.amount),
      status: paid ? 'paid' : 'failed',
      verified: paid,
      payload: { currency: result.currency, expected },
    })
    if (paid) {
      await updatePaymentEventStatus(reference, 'paid', true)
      if (initiation.order_reference) await updateOrderPaymentStatus(initiation.order_reference, 'paid')
    }
  }

  if (result.paid && !amountOk) {
    logger.error({ event: 'paystack_amount_mismatch', resource_id: reference })
  }
  return { paid: paid || initiation.status === 'paid', amount: result.amount, currency: result.currency }
}
