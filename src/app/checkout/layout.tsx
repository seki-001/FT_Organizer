import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Faith The Organizer',
  description: 'Complete your order at Faith The Organizer. Secure checkout with M-Pesa, card or cash on delivery.',
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
