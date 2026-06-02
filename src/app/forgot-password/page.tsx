import type { Metadata } from 'next'
import ForgotPasswordClient from './ForgotPasswordClient'

export const metadata: Metadata = {
  title: 'Forgot Password | Faith The Organizer',
  description: 'Reset your Faith The Organizer account password.',
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />
}
