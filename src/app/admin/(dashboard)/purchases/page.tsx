import { ShoppingCart } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Purchases')

export default function AdminPurchasesPage() {
  return (
    <AdminModulePlaceholderPage
      title="Purchases"
      description="Supplier orders and goods received — preview module."
      icon={ShoppingCart}
    />
  )
}
