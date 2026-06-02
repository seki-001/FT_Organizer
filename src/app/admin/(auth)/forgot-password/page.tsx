import type { Metadata } from 'next'
import AdminForgotPasswordClient from './AdminForgotPasswordClient'

export const metadata: Metadata = {
  title: 'Forgot Password | FTO Admin',
  description: 'Reset your Faith The Organizer admin password.',
  robots: { index: false, follow: false },
}

export default function AdminForgotPasswordPage() {
  return <AdminForgotPasswordClient />
}
