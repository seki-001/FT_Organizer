import type { Metadata } from 'next'
import { getAdminSession } from '@/lib/auth'
import AdminDashboardClient from './_components/AdminDashboardClient'

export const metadata: Metadata = { title: 'Dashboard | FTO Admin' }

export default async function AdminDashboardPage() {
  const session = await getAdminSession()
  const name = session?.user.name ?? 'Faith Admin'

  return <AdminDashboardClient userName={name} />
}
