'use client'

import AdminLayout from '@/components/admin/layout/AdminLayout'

/** @deprecated Use AdminLayout — kept for dashboard layout import path */
export default function AdminShell({
  children,
  userEmail,
  userName,
}: {
  children: React.ReactNode
  userEmail: string
  userName: string
}) {
  return (
    <AdminLayout userEmail={userEmail} userName={userName}>
      {children}
    </AdminLayout>
  )
}
