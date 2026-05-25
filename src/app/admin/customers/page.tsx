'use client'

import { useMemo, useState } from 'react'
import { Search, Eye, MessageCircle } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { MOCK_CUSTOMERS } from '@/lib/mock-admin-customers'
import { cn, formatPrice } from '@/lib/utils'
import { COMPANY } from '@/lib/constants'
import CustomerSlideOver from './_components/CustomerSlideOver'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function formatDate(str: string | null) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'new',    label: 'New' },
] as const
type FilterId = typeof FILTERS[number]['id']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminCustomersPage() {
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState<FilterId>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const customers = MOCK_CUSTOMERS

  const now       = new Date()
  const active90  = new Date(now); active90.setDate(active90.getDate() - 90)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const filtered = useMemo(() => {
    let list = [...customers]
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
      )
    }
    if (filter === 'active') list = list.filter(c => c.lastOrderAt && new Date(c.lastOrderAt) >= active90)
    if (filter === 'new')    list = list.filter(c => new Date(c.joinedAt) >= thisMonth)
    return list
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, search, filter])

  function whatsappUrl(name: string) {
    const firstName = name.split(' ')[0]
    const msg       = encodeURIComponent(`Hi ${firstName}! This is Faith from Faith The Organizer. How can I help you today?`)
    return `${COMPANY.whatsappLink}&text=${msg}`
  }

  const AVATAR_COLORS = [
    'bg-primary/10 text-primary',
    'bg-emerald-100 text-emerald-700',
    'bg-blue-100 text-blue-700',
    'bg-orange-100 text-orange-700',
    'bg-purple-100 text-purple-700',
    'bg-rose-100 text-rose-700',
  ]

  return (
    <>
      <div className="flex flex-col gap-6">

        <AdminPageHeader
          title="Customers"
          subtitle={`${customers.length} registered customer${customers.length !== 1 ? 's' : ''}`}
        />

        {/* Filters */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
            />
          </div>
          {/* Tabs */}
          <div className="flex gap-1 p-0.5 bg-muted/60 rounded-lg">
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={cn('px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                  filter === f.id ? 'bg-white shadow-sm text-dark' : 'text-dark/50 hover:text-dark')}>
                {f.label}
                {f.id !== 'all' && (
                  <span className="ml-1.5 text-xs text-dark/35">
                    {f.id === 'active' ? customers.filter(c => c.lastOrderAt && new Date(c.lastOrderAt) >= active90).length
                      : customers.filter(c => new Date(c.joinedAt) >= thisMonth).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          {(search || filter !== 'all') && (
            <button onClick={() => { setSearch(''); setFilter('all') }} className="text-xs text-primary hover:underline">Clear</button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-dark/8 bg-muted/30">
                  {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-dark/40 text-sm">No customers match your search.</td></tr>
                ) : filtered.map((customer, i) => {
                  const colorCls = AVATAR_COLORS[i % AVATAR_COLORS.length]
                  const isNew    = new Date(customer.joinedAt) >= thisMonth

                  return (
                    <tr key={customer.id} className={cn('border-b border-dark/5 hover:bg-muted/20 transition-colors cursor-pointer', i % 2 !== 0 && 'bg-muted/10')}
                      onClick={() => setSelectedId(customer.id)}>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold font-display', colorCls)}>
                            {getInitials(customer.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-dark text-sm">{customer.name}</p>
                              {isNew && <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">New</span>}
                            </div>
                            <p className="text-xs text-dark/40">{customer.area}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <a href={`mailto:${customer.email}`} onClick={e => e.stopPropagation()}
                          className="text-sm text-dark/60 hover:text-primary transition-colors truncate block">{customer.email}</a>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5 text-sm text-dark/60 whitespace-nowrap">{customer.phone}</td>

                      {/* Orders */}
                      <td className="px-5 py-3.5 text-sm font-semibold text-dark tabular-nums">{customer.totalOrders}</td>

                      {/* Total spent */}
                      <td className="px-5 py-3.5 text-sm font-semibold text-dark tabular-nums">{formatPrice(customer.totalSpent)}</td>

                      {/* Last order */}
                      <td className="px-5 py-3.5 text-xs text-dark/50 whitespace-nowrap">{formatDate(customer.lastOrderAt)}</td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSelectedId(customer.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors">
                            <Eye size={14} />
                          </button>
                          <a href={whatsappUrl(customer.name)} target="_blank" rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-[#25D366] hover:bg-[#25D366]/10 transition-colors">
                            <MessageCircle size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-dark/5">
              <p className="text-xs text-dark/40">
                Showing <span className="font-medium text-dark">{filtered.length}</span> of{' '}
                <span className="font-medium text-dark">{customers.length}</span> customers
              </p>
            </div>
          )}
        </div>

      </div>

      <CustomerSlideOver customerId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  )
}
