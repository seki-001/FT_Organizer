import { CreditCard } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Payments')

export default function AdminPaymentsPage() {
  return (
    <AdminModulePlaceholderPage
      title="Payments"
      description="View M-Pesa and card payment records. Live payment APIs are not triggered from this UI."
      icon={CreditCard}
    />
  )
}
