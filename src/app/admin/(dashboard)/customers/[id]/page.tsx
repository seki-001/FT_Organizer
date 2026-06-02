'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Mail, MapPin, Phone, MessageCircle, Tag } from 'lucide-react'
import AdminModuleFrame from '@/components/admin/business/AdminModuleFrame'
import AdminDetailTabs from '@/components/admin/business/AdminDetailTabs'
import StatusBadge from '@/components/ui/StatusBadge'
import { MOCK_CUSTOMERS } from '@/lib/mock-admin-customers'
import {
  adminBookingStatusVariant,
  adminOrderStatusVariant,
  adminQuotationStatusVariant,
  adminInvoiceStatusVariant,
  adminPaymentStatusVariant,
  formatAdminStatus,
} from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'orders', label: 'Orders' },
  { id: 'finance', label: 'Quotes & invoices' },
  { id: 'loyalty', label: 'Loyalty' },
  { id: 'followups', label: 'Follow-ups' },
  { id: 'notes', label: 'Notes & tags' },
]

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ClientDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [tab, setTab] = useState('overview')

  const client = useMemo(() => MOCK_CUSTOMERS.find((c) => c.id === id), [id])

  if (!client) {
    return (
      <AdminModuleFrame title="Client not found" subtitle="This preview client ID does not exist.">
        <Link href="/admin/customers" className="text-primary text-sm font-medium hover:underline">
          ← Back to clients
        </Link>
      </AdminModuleFrame>
    )
  }

  const whatsapp = `${COMPANY.whatsappLink}&text=${encodeURIComponent(`Hi ${client.name.split(' ')[0]}!`)}`

  return (
    <AdminModuleFrame
      title={client.name}
      subtitle={`${client.clientType} · ${client.area}, ${client.city}`}
    >
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-primary hover:underline -mt-2">
        <ArrowLeft size={14} /> All clients
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-dark/8 p-5 shadow-sm flex flex-col gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display text-xl font-bold">
            {client.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-dark/70 hover:text-primary">
              <Mail size={14} /> {client.email}
            </a>
            <span className="flex items-center gap-2 text-dark/70">
              <Phone size={14} /> {client.phone}
            </span>
            <span className="flex items-center gap-2 text-dark/70">
              <MapPin size={14} /> {client.area}, {client.city}, {client.country}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={client.clientType} variant="info" />
            <StatusBadge label={client.loyaltyTier} variant="success" />
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] font-medium text-sm py-2.5 hover:bg-[#25D366]/15"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark/8">
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="font-mono font-bold text-dark">{client.totalOrders}</p>
              <p className="text-[10px] text-dark/45 uppercase">Orders</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="font-mono font-bold text-dark">{formatPrice(client.totalSpent)}</p>
              <p className="text-[10px] text-dark/45 uppercase">Spent</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <AdminDetailTabs tabs={TABS} active={tab} onChange={setTab} />

          <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm min-h-[320px]">
            {tab === 'overview' && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><dt className="text-dark/45 text-xs uppercase">Joined</dt><dd className="font-medium">{fmt(client.joinedAt)}</dd></div>
                <div><dt className="text-dark/45 text-xs uppercase">Last order</dt><dd className="font-medium">{client.lastOrderAt ? fmt(client.lastOrderAt) : '—'}</dd></div>
                <div><dt className="text-dark/45 text-xs uppercase">Loyalty points</dt><dd className="font-mono font-bold">{client.loyaltyPoints}</dd></div>
                <div><dt className="text-dark/45 text-xs uppercase">Bookings</dt><dd className="font-medium">{client.bookings.length}</dd></div>
              </dl>
            )}

            {tab === 'bookings' && (
              <ul className="divide-y divide-dark/5">
                {client.bookings.length === 0 ? (
                  <p className="text-dark/40 text-sm py-6 text-center">No bookings yet.</p>
                ) : (
                  client.bookings.map((b) => (
                    <li key={b.id} className="py-3 flex justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{b.service}</p>
                        <p className="text-xs text-dark/45">{fmt(b.date)} · {b.propertyType}</p>
                      </div>
                      <StatusBadge label={formatAdminStatus(b.status)} variant={adminBookingStatusVariant(b.status)} />
                    </li>
                  ))
                )}
              </ul>
            )}

            {tab === 'orders' && (
              <ul className="divide-y divide-dark/5">
                {client.orders.map((o) => (
                  <li key={o.id} className="py-3 flex justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs text-dark/50">{o.id}</p>
                      <p className="text-sm font-medium">{o.items}</p>
                      <p className="text-xs text-dark/45">{fmt(o.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">{formatPrice(o.amount)}</p>
                      <StatusBadge label={formatAdminStatus(o.status)} variant={adminOrderStatusVariant(o.status)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'finance' && (
              <div className="flex flex-col gap-6">
                <section>
                  <h3 className="text-xs font-semibold uppercase text-dark/45 mb-2">Quotations</h3>
                  <ul className="divide-y divide-dark/5">
                    {client.quotations.map((q) => (
                      <li key={q.id} className="py-2 flex justify-between">
                        <Link href={`/admin/quotations`} className="font-mono text-sm text-primary hover:underline">{q.id}</Link>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{formatPrice(q.total)}</span>
                          <StatusBadge label={q.status} variant={adminQuotationStatusVariant(q.status)} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase text-dark/45 mb-2">Invoices & payments</h3>
                  {client.invoices.map((inv) => (
                    <div key={inv.id} className="py-2 flex justify-between border-b border-dark/5">
                      <span className="font-mono text-sm">{inv.id}</span>
                      <StatusBadge label={inv.status} variant={adminInvoiceStatusVariant(inv.status)} />
                    </div>
                  ))}
                  {client.payments.map((p) => (
                    <div key={p.id} className="py-2 flex justify-between">
                      <span className="text-sm">{p.method} · {fmt(p.date)}</span>
                      <div className="flex gap-2 items-center">
                        <span className="font-mono text-sm">{formatPrice(p.amount)}</span>
                        <StatusBadge label={p.status} variant={adminPaymentStatusVariant(p.status)} />
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {tab === 'loyalty' && (
              <div className="flex flex-col gap-3">
                <p className="text-sm">
                  <span className="text-dark/50">Tier:</span>{' '}
                  <strong>{client.loyaltyTier}</strong> · {client.loyaltyPoints} points
                </p>
                <p className="text-xs text-dark/45">Rewards and referral benefits connect when loyalty backend is ready.</p>
              </div>
            )}

            {tab === 'followups' && (
              <ul className="divide-y divide-dark/5">
                {client.followUps.length === 0 ? (
                  <p className="text-dark/40 text-sm py-4">No follow-ups logged.</p>
                ) : (
                  client.followUps.map((f) => (
                    <li key={f.id} className="py-3 text-sm">
                      <p className="font-medium">{f.channel} · {fmt(f.date)}</p>
                      <p className="text-dark/50 text-xs">{f.status}{f.note ? ` — ${f.note}` : ''}</p>
                    </li>
                  ))
                )}
              </ul>
            )}

            {tab === 'notes' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {client.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                      <Tag size={12} /> {t}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-dark/70 leading-relaxed whitespace-pre-wrap">{client.notes || 'No internal notes.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminModuleFrame>
  )
}
