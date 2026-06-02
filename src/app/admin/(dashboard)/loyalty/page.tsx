import { Gift } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Loyalty Program')

export default function AdminLoyaltyPage() {
  return (
    <AdminModulePlaceholderPage
      title="Loyalty Program"
      description="Points, tiers, and rewards for returning clients."
      icon={Gift}
    />
  )
}
