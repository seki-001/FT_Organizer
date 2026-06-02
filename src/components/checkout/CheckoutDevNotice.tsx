import { Info } from 'lucide-react'
import { CHECKOUT_DEV_PAYMENT_NOTICE } from '@/lib/checkout-ui'

export default function CheckoutDevNotice() {
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div
      className="flex gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-dark/75"
      role="status"
    >
      <Info size={18} className="shrink-0 text-dark/50 mt-0.5" aria-hidden="true" />
      <p>{CHECKOUT_DEV_PAYMENT_NOTICE}</p>
    </div>
  )
}
