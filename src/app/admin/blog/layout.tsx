import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog Posts | FTO Admin' }

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
