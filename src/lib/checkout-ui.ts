/**
 * Checkout UI copy and client-side confirmation payload (no payment logic).
 */

export const CHECKOUT_CONFIRMATION_KEY = 'fto-checkout-confirmation'

export type PaymentMethodId = 'mpesa' | 'card' | 'cod'

/** Never use "paid" in UI unless a verified backend flag exists. */
export type PaymentStatusUi =
  | 'pending_verification'
  | 'awaiting_delivery'
  | 'redirected_to_gateway'
  | 'order_received'

export interface CheckoutConfirmationPayload {
  ref: string
  name: string
  email?: string
  paymentMethod: PaymentMethodId
  paymentStatus: PaymentStatusUi
  deliveryLabel: string
  total: number
  itemCount: number
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  mpesa: 'M-Pesa',
  card: 'Card (Flutterwave)',
  cod: 'Cash on delivery',
}

export const PAYMENT_STATUS_MESSAGES: Record<PaymentStatusUi, string> = {
  pending_verification:
    'We received your order. Payment is not marked complete until M-Pesa is verified by our system.',
  awaiting_delivery:
    'Pay when your order arrives. Our team will confirm details on WhatsApp.',
  redirected_to_gateway:
    'Complete card payment on Flutterwave. Your order is held until payment is confirmed.',
  order_received:
    'Your order is received. We will confirm payment and delivery details shortly.',
}

export const CHECKOUT_DEV_PAYMENT_NOTICE =
  'Development mode: payment APIs may simulate success without a real charge. Orders are not marked as paid until production verification is enabled.'

export function saveCheckoutConfirmation(payload: CheckoutConfirmationPayload): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CHECKOUT_CONFIRMATION_KEY, JSON.stringify(payload))
}

export function loadCheckoutConfirmation(): CheckoutConfirmationPayload | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(CHECKOUT_CONFIRMATION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CheckoutConfirmationPayload
  } catch {
    return null
  }
}

export function clearCheckoutConfirmation(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(CHECKOUT_CONFIRMATION_KEY)
}
