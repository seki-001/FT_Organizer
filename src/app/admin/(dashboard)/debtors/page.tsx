import { AlertCircle } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Debtors')

export default function AdminDebtorsPage() {
  return (
    <AdminModulePlaceholderPage
      title="Debtors"
      description="Track outstanding client balances and aging buckets."
      icon={AlertCircle}
    />
  )
}
