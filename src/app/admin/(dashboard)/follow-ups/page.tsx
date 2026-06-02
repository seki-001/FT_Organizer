import { ListChecks } from 'lucide-react'
import { AdminModulePlaceholderPage, buildPlaceholderMetadata } from '../_components/AdminModulePlaceholder'

export const metadata = buildPlaceholderMetadata('Follow-ups')

export default function AdminFollowUpsPage() {
  return (
    <AdminModulePlaceholderPage
      title="Follow-ups"
      description="Post-visit timelines and client check-ins after organizing sessions."
      icon={ListChecks}
    />
  )
}
