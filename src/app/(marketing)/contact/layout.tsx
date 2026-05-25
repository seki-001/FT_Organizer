import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Faith The Organizer',
  description:
    'Get in touch with Faith The Organizer. Call, WhatsApp or email us to book a home or office organizing service anywhere in Nairobi. From Clutter to Order.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
