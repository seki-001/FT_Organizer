'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Phone, Loader2, Inbox } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

interface ContactInquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
}

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/inquiries')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then((data: { inquiries?: ContactInquiry[] }) => {
        setInquiries(data.inquiries ?? [])
        if (data.inquiries?.[0]) setSelectedId(data.inquiries[0].id)
      })
      .catch(() => setError('Could not load inquiries. Check your admin session and database connection.'))
      .finally(() => setLoading(false))
  }, [])

  const selected = inquiries.find((i) => i.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <AdminPageHeader
        title="Inquiries"
        subtitle={loading ? 'Loading…' : `${inquiries.length} contact form messages`}
        action={{
          label: 'Quote Requests',
          href: '/admin/bookings',
          variant: 'outline',
        }}
      />

      {error && (
        <div className="bg-danger/5 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-dark/50 gap-2">
          <Loader2 size={20} className="animate-spin" />
          Loading inquiries…
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dark/8 p-12 text-center">
          <Inbox size={40} className="mx-auto text-dark/20 mb-3" />
          <p className="text-dark font-medium">No inquiries yet</p>
          <p className="text-dark/50 text-sm mt-1 max-w-sm mx-auto">
            Messages from the contact form appear here. Service booking quote requests are under{' '}
            <Link href="/admin/bookings" className="text-primary hover:underline">Quote Requests</Link>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-dark/8 overflow-hidden">
            <div className="px-4 py-3 border-b border-dark/6 text-xs font-semibold uppercase tracking-wider text-dark/40">
              Inbox
            </div>
            <ul className="divide-y divide-dark/5 max-h-[70vh] overflow-y-auto">
              {inquiries.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-primary/[0.03] transition-colors ${
                      selectedId === item.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <p className="font-medium text-sm text-dark truncate">{item.name}</p>
                    <p className="text-xs text-primary truncate mt-0.5">{item.subject}</p>
                    <p className="text-[11px] text-dark/40 mt-1">{formatWhen(item.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selected && (
            <div className="lg:col-span-3 bg-white rounded-2xl border border-dark/8 p-6 flex flex-col gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-dark/40 font-semibold mb-1">Subject</p>
                <h2 className="font-display text-xl text-dark">{selected.subject}</h2>
                <p className="text-xs text-dark/40 mt-1">{formatWhen(selected.createdAt)}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  className="inline-flex items-center gap-2 text-sm text-dark/70 hover:text-primary border border-dark/10 rounded-lg px-3 py-2"
                >
                  <Mail size={14} />
                  {selected.email}
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="inline-flex items-center gap-2 text-sm text-dark/70 hover:text-primary border border-dark/10 rounded-lg px-3 py-2"
                >
                  <Phone size={14} />
                  {selected.phone}
                </a>
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '').replace(/^0/, '254')}?text=${encodeURIComponent(`Hi ${selected.name}, thank you for contacting ${COMPANY.name} about "${selected.subject}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#25D366] border border-[#25D366]/30 rounded-lg px-3 py-2 hover:bg-[#25D366]/5"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>

              <div className="bg-surface rounded-xl p-4 border border-dark/8">
                <p className="text-sm text-dark/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
