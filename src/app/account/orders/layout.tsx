import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Orders',
}

export default function AccountOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
