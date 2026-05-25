import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Faith The Organizer',
}

export default function AccountProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
