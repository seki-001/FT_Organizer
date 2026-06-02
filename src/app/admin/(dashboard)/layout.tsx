import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminShell from '../_components/AdminShell'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login?callbackUrl=/admin')
  }

  return (
    <AdminShell userEmail={session.user.email} userName={session.user.name}>
      {children}
    </AdminShell>
  )
}
