import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order at Faith The Organizer. Secure checkout with M-Pesa, card or cash on delivery.',
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-dark/50 text-sm">Loading checkout…</div>}>
      {children}
    </Suspense>
  )
}
