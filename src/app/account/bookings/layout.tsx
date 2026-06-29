import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookings',
}

export default function AccountBookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
