import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products | FTO Admin',
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
