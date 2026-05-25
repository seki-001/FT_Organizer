import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import OrderConfirmationClient from '@/components/sections/OrderConfirmationClient'

export const metadata: Metadata = {
  title: 'Order Confirmed | Faith The Organizer',
  description: 'Your order has been placed with Faith The Organizer. Thank you for your purchase.',
}

export default function OrderConfirmationPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-dark/40 gap-2">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-sm">Loading confirmation…</span>
          </div>
        }
      >
        <OrderConfirmationClient />
      </Suspense>
    </main>
  )
}
