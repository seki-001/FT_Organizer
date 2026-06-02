import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import AdminInviteClient from './AdminInviteClient'

export const metadata: Metadata = {
  title: 'Staff Invitation | FTO Admin',
  description: 'Accept a staff invitation or invite a team member to Faith The Organizer admin.',
  robots: { index: false, follow: false },
}

function InviteFallback() {
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen bg-[#ebeae6] min-h-[50vh] flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-dark/30" />
    </div>
  )
}

export default function AdminInvitePage() {
  return (
    <Suspense fallback={<InviteFallback />}>
      <AdminInviteClient />
    </Suspense>
  )
}
