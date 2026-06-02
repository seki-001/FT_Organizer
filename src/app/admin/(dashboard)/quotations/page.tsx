import { FileText } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Quotations')

export default function AdminQuotationsPage() {
  return (
    <AdminModulePlaceholderPage
      title="Quotations"
      description="Create, send, and track service quotes for clients."
      icon={FileText}
    />
  )
}
