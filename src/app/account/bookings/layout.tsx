import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bookings | Faith The Organizer',
}

export default function AccountBookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
