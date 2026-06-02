import { Wallet } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Expenses')

export default function AdminExpensesPage() {
  return (
    <AdminModulePlaceholderPage
      title="Expenses"
      description="Operating costs and categories for your organizing business."
      icon={Wallet}
    />
  )
}
