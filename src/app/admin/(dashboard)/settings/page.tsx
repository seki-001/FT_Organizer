import type { Metadata } from 'next'
import AdminSettingsClient from './_components/AdminSettingsClient'

export const metadata: Metadata = { title: 'Settings | FTO Admin' }

export default function AdminSettingsPage() {
  return <AdminSettingsClient />
}
