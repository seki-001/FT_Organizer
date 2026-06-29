import type { Metadata } from 'next'
import PayPageClient from './PayPageClient'

export const metadata: Metadata = {
  title: 'Pay | Faith The Organizer',
  description: 'Pay for your order via Paystack — M-Pesa, card, or bank transfer.',
}

export default function PayPage() {
  return <PayPageClient />
}
