import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your shopping cart at Faith The Organizer — organizing products delivered across Kenya.',
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
