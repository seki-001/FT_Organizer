import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Create Account | Faith The Organizer',
  description: 'Create your Faith The Organizer customer account.',
}

export default function RegisterPage() {
  return <RegisterClient />
}
