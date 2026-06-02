import { Receipt } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Invoices')

export default function AdminInvoicesPage() {
  return (
    <AdminModulePlaceholderPage
      title="Invoices"
      description="Issue invoices and monitor due dates — preview only, no payment processing."
      icon={Receipt}
    />
  )
}
