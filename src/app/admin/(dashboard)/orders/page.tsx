'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, ChevronDown, Eye, Pencil, Download,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminDemoNotice from '@/components/admin/AdminDemoNotice'
import FilterBar from '@/components/admin/ui/FilterBar'
import OrderSlideOver  from './_components/OrderSlideOver'
import { MOCK_ADMIN_ORDERS } from '@/lib/mock-admin-orders'
import { cn, formatPrice } from '@/lib/utils'
import type { Order } from '@/lib/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const PER_PAGE = 20

const ORDER_TYPE_FILTERS = [
  { id: 'all', label: 'All orders' },
  { id: 'shop', label: 'Shop' },
  { id: 'service', label: 'Service' },
]

const STATUS_CLASS: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-700',
  packed:     'bg-blue-100 text-blue-700',
  dispatched: 'bg-purple-100 text-purple-700',
  delivered:  'bg-success/15 text-success',
  cancelled:  'bg-danger/15 text-danger',
}
const PAYMENT_CLASS: Record<string, string> = {
  mpesa: 'bg-green-100 text-green-700',
  card:  'bg-blue-100 text-blue-700',
  cod:   'bg-amber-100 text-amber-700',
}
const PAYMENT_LABEL: Record<string, string> = {
  mpesa: 'M-Pesa', card: 'Card', cod: 'COD',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const ms   = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(ms / 60_000)
  const hrs  = Math.floor(ms / 3_600_000)
  const days = Math.floor(ms / 86_400_000)
  if (mins < 60)  return `${mins}m ago`
  if (hrs  < 24)  return `${hrs}h ago`
  if (days < 30)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
}

function fullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-KE', {
    weekday: 'short', day: 'numeric', month: 'long',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize whitespace-nowrap',
      colorClass,
    )}>
      {label}
    </span>
  )
}

function SelectWrapper({
  value, onChange, children, label,
}: {
  value:    string
  onChange: (v: string) => void
  children: React.ReactNode
  label:    string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-dark/15 rounded-lg pl-3 pr-8 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders,          setOrders]          = useState<Order[]>(MOCK_ADMIN_ORDERS)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Filters
  const [search,         setSearch]         = useState('')
  const [statusFilter,   setStatusFilter]   = useState('all')
  const [dateFilter,     setDateFilter]     = useState('all')
  const [paymentFilter,  setPaymentFilter]  = useState('all')
  const [orderType,      setOrderType]      = useState('all')
  const [currentPage,    setCurrentPage]    = useState(1)

  // Derived: selected order (live from orders array)
  const selectedOrder = selectedOrderId
    ? (orders.find(o => o.id === selectedOrderId) ?? null)
    : null

  // Filtering
  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim()
    return orders.filter(order => {
      if (q) {
        const hit =
          order.id.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.email.toLowerCase().includes(q)
        if (!hit) return false
      }
      if (statusFilter !== 'all' && order.orderStatus !== statusFilter) return false
      if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false
      if (dateFilter !== 'all') {
        const created = new Date(order.createdAt)
        const now     = new Date()
        if (dateFilter === 'today' && created.toDateString() !== now.toDateString()) return false
        if (dateFilter === 'week'  && created < new Date(now.getTime() - 7  * 86_400_000)) return false
        if (dateFilter === 'month' && created < new Date(now.getTime() - 30 * 86_400_000)) return false
      }
      if (orderType === 'service') return false
      return true
    })
  }, [orders, search, statusFilter, paymentFilter, dateFilter, orderType])

  const totalPages     = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE))
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function changeFilter<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setCurrentPage(1) }
  }

  const handleClose = useCallback(() => setSelectedOrderId(null), [])
  const handleStatusUpdate = useCallback((orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId
        ? { ...o, orderStatus: newStatus as Order['orderStatus'] }
        : o,
    ))
  }, [])

  // Status counts for the summary row
  const counts = {
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    packed:     orders.filter(o => o.orderStatus === 'packed').length,
    dispatched: orders.filter(o => o.orderStatus === 'dispatched').length,
    delivered:  orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled:  orders.filter(o => o.orderStatus === 'cancelled').length,
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <AdminDemoNotice />

        <AdminPageHeader
          title="Orders"
          subtitle="Shop fulfillment, delivery, and payment status (preview)"
          action={{ label: 'Export CSV', icon: Download, variant: 'outline' }}
        />

        <FilterBar
          options={[...ORDER_TYPE_FILTERS]}
          value={orderType}
          onChange={(v) => changeFilter(setOrderType)(v)}
          ariaLabel="Order type"
        />

        {/* Status summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {([
            { label: 'Processing', count: counts.processing, color: 'text-amber-600' },
            { label: 'Packed',     count: counts.packed,     color: 'text-blue-600'  },
            { label: 'Dispatched', count: counts.dispatched, color: 'text-purple-600'},
            { label: 'Delivered',  count: counts.delivered,  color: 'text-success'   },
            { label: 'Cancelled',  count: counts.cancelled,  color: 'text-danger'    },
          ] as const).map(({ label, count, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                changeFilter(setStatusFilter)(label.toLowerCase())
              }}
              className={cn(
                'bg-white rounded-xl border border-dark/8 shadow-sm p-4 text-center transition-all hover:border-primary/40 hover:shadow-md',
                statusFilter === label.toLowerCase() && 'border-primary ring-2 ring-primary/20',
              )}
            >
              <p className={cn('font-display text-2xl font-bold', color)}>{count}</p>
              <p className="text-dark/50 text-xs mt-0.5">{label}</p>
            </button>
          ))}
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm p-4 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by order ref, customer name or email…"
              value={search}
              onChange={(e) => changeFilter(setSearch)(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30"
            />
          </div>

          {/* Status */}
          <SelectWrapper value={statusFilter} onChange={changeFilter(setStatusFilter)} label="Filter by status">
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </SelectWrapper>

          {/* Date */}
          <SelectWrapper value={dateFilter} onChange={changeFilter(setDateFilter)} label="Filter by date range">
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </SelectWrapper>

          {/* Payment */}
          <SelectWrapper value={paymentFilter} onChange={changeFilter(setPaymentFilter)} label="Filter by payment method">
            <option value="all">All Payments</option>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
            <option value="cod">COD</option>
          </SelectWrapper>

          {/* Clear filters */}
          {(statusFilter !== 'all' || dateFilter !== 'all' || paymentFilter !== 'all' || search) && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setDateFilter('all')
                setPaymentFilter('all')
                setCurrentPage(1)
              }}
              className="text-xs text-primary hover:underline whitespace-nowrap self-center"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-dark/8 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-dark/8 bg-muted/30">
                  {['Order Ref', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center text-dark/40 text-sm">
                      No orders match your filters.{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('')
                          setStatusFilter('all')
                          setDateFilter('all')
                          setPaymentFilter('all')
                          setCurrentPage(1)
                        }}
                        className="text-primary hover:underline"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={cn(
                        'border-b border-dark/5 cursor-pointer transition-colors',
                        i % 2 !== 0 ? 'bg-muted/10' : '',
                        'hover:bg-primary/5',
                      )}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      {/* Order ref */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-sm font-bold text-primary hover:underline">
                          {order.id}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-dark text-sm leading-tight">{order.customer.name}</p>
                        <p className="text-dark/45 text-xs mt-0.5">{order.customer.city}</p>
                      </td>

                      {/* Items count with tooltip */}
                      <td
                        className="px-4 py-3.5 text-dark/60 text-sm whitespace-nowrap"
                        title={order.items
                          .map(i => `${i.product.name} ×${i.quantity}`)
                          .join('\n')}
                      >
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 font-mono text-sm font-medium text-dark whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-3.5">
                        <Badge
                          label={PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                          colorClass={PAYMENT_CLASS[order.paymentMethod] ?? 'bg-muted text-dark/60'}
                        />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <Badge
                          label={order.orderStatus}
                          colorClass={STATUS_CLASS[order.orderStatus] ?? 'bg-muted text-dark/60'}
                        />
                      </td>

                      {/* Date with full-date tooltip */}
                      <td
                        className="px-4 py-3.5 text-dark/45 text-xs whitespace-nowrap"
                        title={fullDate(order.createdAt)}
                      >
                        {timeAgo(order.createdAt)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label={`View order ${order.id}`}
                            onClick={() => setSelectedOrderId(order.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors"
                          >
                            <Eye size={15} aria-hidden="true" />
                          </button>
                          <Link
                            href={`/admin/orders/${order.id}`}
                            aria-label={`Full page for order ${order.id}`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors"
                          >
                            <Pencil size={14} aria-hidden="true" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-dark/5">
              <p className="text-xs text-dark/40">
                Showing{' '}
                <span className="font-medium text-dark">
                  {Math.min((currentPage - 1) * PER_PAGE + 1, filteredOrders.length)}–{Math.min(currentPage * PER_PAGE, filteredOrders.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-dark">{filteredOrders.length}</span>{' '}
                orders
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  aria-label="Previous page"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-dark/10 text-dark/40 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => idx + 1).map(pg => (
                  <button
                    key={pg}
                    type="button"
                    onClick={() => setCurrentPage(pg)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors',
                      pg === currentPage
                        ? 'bg-primary text-white'
                        : 'text-dark/60 hover:bg-muted',
                    )}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  aria-label="Next page"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-dark/10 text-dark/40 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Slide-over */}
      <OrderSlideOver
        order={selectedOrder}
        onClose={handleClose}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  )
}
