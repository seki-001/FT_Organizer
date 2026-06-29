import { redirect }      from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import AdminShell          from './_components/AdminShell'

export const metadata = {
  title: {
    template: '%s | FTO Admin',
    default:  'Dashboard | FTO Admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  // Auth guard — redirect to login if no session or not admin role
  if (!session || session.user.role !== 'admin') {
    redirect('/login?callbackUrl=/admin')
  }

  return (
    <AdminShell
      userEmail={session.user.email}
      userName={session.user.name}
    >
      {children}
    </AdminShell>
  )
}
