import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import ShopCatalogClient from './ShopCatalogClient'

export const metadata: Metadata = {
  title: 'Shop | Faith The Organizer',
  description:
    'Curated organizing products for kitchen, closet, office, and home — delivered across Nairobi.',
}

function ShopFallback() {
  return (
    <main className="bg-surface min-h-[50vh] flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-dark/30" />
    </main>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopCatalogClient />
    </Suspense>
  )
}
