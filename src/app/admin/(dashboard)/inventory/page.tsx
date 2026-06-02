import { Boxes } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Inventory')

export default function AdminInventoryPage() {
  return (
    <AdminModulePlaceholderPage
      title="Inventory"
      description="Stock levels, adjustments, and warehouse counts."
      icon={Boxes}
      primaryHref="/admin/products"
      primaryLabel="Manage products"
    />
  )
}
