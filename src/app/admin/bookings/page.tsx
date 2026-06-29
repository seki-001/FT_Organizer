'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import {
  Search, ChevronDown, Download, Calendar, GripVertical,
  Eye, LayoutGrid, List,
} from 'lucide-react'
import AdminPageHeader  from '@/components/admin/AdminPageHeader'
import BookingSlideOver from './_components/BookingSlideOver'
import { MOCK_ADMIN_BOOKINGS } from '@/lib/mock-admin-bookings'
import type { AdminBooking }   from '@/lib/mock-admin-bookings'
import { SERVICES } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ─── Lookup tables ────────────────────────────────────────────────────────────

const PIPELINE_COLUMNS: {
  status: AdminBooking['status']
  label:  string
  bg:     string
  dot:    string
}[] = [
  { status: 'new',       label: 'New',       bg: 'bg-amber-50',   dot: 'bg-amber-400'  },
  { status: 'quoted',    label: 'Quoted',    bg: 'bg-blue-50',    dot: 'bg-blue-400'   },
  { status: 'confirmed', label: 'Confirmed', bg: 'bg-emerald-50', dot: 'bg-emerald-500'},
  { status: 'completed', label: 'Completed', bg: 'bg-dark/[.03]', dot: 'bg-dark/30'    },
  { status: 'cancelled', label: 'Cancelled', bg: 'bg-red-50',     dot: 'bg-red-400'    },
]

const STATUS_META: Record<AdminBooking['status'], { label: string; class: string }> = {
  new:       { label: 'New',       class: 'bg-amber-100 text-amber-700'  },
  quoted:    { label: 'Quoted',    class: 'bg-blue-100 text-blue-700'    },
  confirmed: { label: 'Confirmed', class: 'bg-success/15 text-success'   },
  completed: { label: 'Completed', class: 'bg-dark/10 text-dark/60'      },
  cancelled: { label: 'Cancelled', class: 'bg-danger/10 text-danger'     },
}

const PROPERTY_LABELS: Record<string, string> = {
  apartment: 'Apt',
  house:     'House',
  office:    'Office',
}

const SIZE_LABELS: Record<string, string> = {
  small:  'Small',
  medium: 'Medium',
  large:  'Large',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatShortDate(d: string) {
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Badge({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap', colorClass)}>
      {label}
    </span>
  )
}

function SelectFilter({
  value, onChange, label, children,
}: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
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
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" aria-hidden="true" />
    </div>
  )
}

// ─── Booking card (visual only, no DnD hooks) ─────────────────────────────────

function BookingCardContent({
  booking, isDragOverlay = false,
}: { booking: AdminBooking; isDragOverlay?: boolean }) {
  const service = SERVICES.find(s => s.slug === booking.service)
  const dateStr = new Date(booking.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })

  return (
    <div className={cn(
      'admin-card p-3.5 select-none',
      isDragOverlay && 'shadow-2xl ring-2 ring-primary/25 rotate-1 scale-105',
      !isDragOverlay && 'shadow-sm',
    )}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-dark text-sm leading-snug truncate">{booking.name}</p>
          <p className="text-primary text-xs mt-0.5 truncate">{service?.title ?? booking.service}</p>
        </div>
        <GripVertical
          size={14}
          className="text-dark/20 flex-shrink-0 mt-0.5 cursor-grab"
          aria-hidden="true"
        />
      </div>
      <div className="flex items-center gap-1.5 mt-2.5">
        <Calendar size={11} className="text-dark/35 flex-shrink-0" aria-hidden="true" />
        <p className="text-dark/60 text-xs">{dateStr}</p>
      </div>
      <p className="text-dark/35 text-[11px] mt-1.5 truncate">
        {PROPERTY_LABELS[booking.propertyType]} · {SIZE_LABELS[booking.propertySize]} · {booking.area}
      </p>
    </div>
  )
}

// ─── Draggable card ───────────────────────────────────────────────────────────

function DraggableCard({ booking, onClick }: { booking: AdminBooking; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: booking.id,
  })

  const style: React.CSSProperties = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
      aria-label={`Open booking: ${booking.name}`}
      className={cn(
        'rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        isDragging ? 'opacity-40' : 'hover:shadow-md transition-shadow cursor-pointer',
      )}
    >
      <BookingCardContent booking={booking} />
    </div>
  )
}

// ─── Kanban column ────────────────────────────────────────────────────────────

function KanbanColumn({
  column, bookings, onCardClick,
}: {
  column:      typeof PIPELINE_COLUMNS[number]
  bookings:    AdminBooking[]
  onCardClick: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status })

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full flex-shrink-0', column.dot)} aria-hidden="true" />
          <h3 className="font-semibold text-dark text-sm">{column.label}</h3>
        </div>
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {bookings.length}
        </span>
      </div>

      {/* Droppable zone */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2.5 flex-1 min-h-[220px] rounded-xl p-2.5 transition-all duration-150',
          isOver
            ? 'bg-primary/8 border-2 border-dashed border-primary/40 scale-[1.01]'
            : cn(column.bg, 'border-2 border-transparent'),
        )}
      >
        {bookings.map(b => (
          <DraggableCard
            key={b.id}
            booking={b}
            onClick={() => onCardClick(b.id)}
          />
        ))}

        {bookings.length === 0 && (
          <div className={cn(
            'flex-1 flex items-center justify-center rounded-lg border-2 border-dashed min-h-[80px]',
            isOver ? 'border-primary/40 bg-primary/5' : 'border-dark/10',
          )}>
            <p className="text-dark/25 text-xs">Drop here</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBookingsPage() {
  const [bookings,    setBookings]    = useState<AdminBooking[]>([])
  const [loading,     setLoading]     = useState(true)
  const [loadError,   setLoadError]   = useState('')
  const [selectedId,  setSelectedId]  = useState<string | null>(null)
  const [activeId,    setActiveId]    = useState<string | null>(null)
  const [view,        setView]        = useState<'pipeline' | 'list'>('pipeline')

  // List view filters
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [dateFilter,    setDateFilter]    = useState('all')

  useEffect(() => {
    void (async () => {
      setLoading(true)
      setLoadError('')
      try {
        const res = await fetch('/api/admin/bookings')
        if (!res.ok) throw new Error('Failed to load bookings')
        const data = await res.json() as { bookings: AdminBooking[] }
        setBookings(data.bookings ?? [])
      } catch {
        setLoadError('Could not load bookings. Showing sample data.')
        setBookings(MOCK_ADMIN_BOOKINGS)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ── DnD sensors with 8px activation distance ─────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  // ── Derived data ──────────────────────────────────────────────────────────

  const selectedBooking = useMemo(
    () => (selectedId ? bookings.find(b => b.id === selectedId) ?? null : null),
    [selectedId, bookings],
  )

  const activeBooking = useMemo(
    () => (activeId ? bookings.find(b => b.id === activeId) ?? null : null),
    [activeId, bookings],
  )

  const bookingsByStatus = useMemo(() => {
    const groups: Record<string, AdminBooking[]> = {
      new: [], quoted: [], confirmed: [], completed: [], cancelled: [],
    }
    bookings.forEach(b => { groups[b.status]?.push(b) })
    return groups
  }, [bookings])

  // Quick stats
  const stats = useMemo(() => {
    const now        = new Date()
    const weekAgo    = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
      newThisWeek:        bookings.filter(b => b.status === 'new' && new Date(b.createdAt) >= weekAgo).length,
      confirmedUpcoming:  bookings.filter(b => b.status === 'confirmed' && new Date(b.date) >= now).length,
      completedThisMonth: bookings.filter(b => b.status === 'completed' && new Date(b.date) >= monthStart).length,
      cancellationRate:   bookings.length > 0
        ? Math.round(bookings.filter(b => b.status === 'cancelled').length / bookings.length * 100)
        : 0,
    }
  }, [bookings])

  // Filtered list for list view
  const filteredBookings = useMemo(() => {
    let list = [...bookings]
    const q = search.toLowerCase().trim()
    if (q) list = list.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q),
    )
    if (statusFilter  !== 'all') list = list.filter(b => b.status  === statusFilter)
    if (serviceFilter !== 'all') list = list.filter(b => b.service === serviceFilter)
    if (dateFilter !== 'all') {
      const now        = new Date()
      const startOf    = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const todayStart = startOf(now)
      const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      list = list.filter(b => {
        const c = new Date(b.createdAt)
        if (dateFilter === 'today') return c >= todayStart
        if (dateFilter === 'week')  return c >= weekStart
        if (dateFilter === 'month') return c >= monthStart
        return true
      })
    }
    return list
  }, [bookings, search, statusFilter, serviceFilter, dateFilter])

  // ── DnD handlers ─────────────────────────────────────────────────────────

  const handleDragStart = useCallback(({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }, [])

  const VALID_STATUSES = PIPELINE_COLUMNS.map(c => c.status)

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (!over) return

    const bookingId    = active.id as string
    const targetStatus = over.id as AdminBooking['status']

    if (!VALID_STATUSES.includes(targetStatus)) return

    const booking = bookings.find(b => b.id === bookingId)
    if (!booking || booking.status === targetStatus) return

    // Optimistic update
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: targetStatus } : b,
    ))

    // Background sync — revert on failure
    fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetStatus }),
    }).catch(() => {
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: booking.status } : b,
      ))
    })
  }, [bookings, VALID_STATUSES])

  // ── Other handlers ────────────────────────────────────────────────────────

  const handleStatusUpdate = useCallback((id: string, status: string) => {
    setBookings(prev => prev.map(b =>
      b.id === id ? { ...b, status: status as AdminBooking['status'] } : b,
    ))
  }, [])

  const handleNotesUpdate = useCallback((id: string, notes: string) => {
    setBookings(prev => prev.map(b =>
      b.id === id ? { ...b, internalNotes: notes } : b,
    ))
  }, [])

  function handleExport() {
    const rows = [
      ['ID', 'Customer', 'Email', 'Phone', 'Service', 'Date', 'Property', 'Size', 'Area', 'Status', 'Submitted'],
      ...bookings.map(b => {
        const svc = SERVICES.find(s => s.slug === b.service)
        return [b.id, b.name, b.email, b.phone, svc?.title ?? b.service,
          b.date, b.propertyType, b.propertySize, b.area, b.status,
          new Date(b.createdAt).toLocaleDateString('en-KE')]
      }),
    ]
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'bookings-export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* Header */}
        <AdminPageHeader
          title="Bookings"
          subtitle={loading ? 'Loading bookings…' : `${bookings.length} bookings`}
          action={{ label: 'Export CSV', icon: Download, variant: 'outline', onClick: handleExport }}
        />

        {loadError && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
            {loadError}
          </p>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New this week',       value: stats.newThisWeek,        color: 'text-amber-600',  sub: 'bookings' },
            { label: 'Confirmed upcoming',  value: stats.confirmedUpcoming,  color: 'text-success',    sub: 'bookings' },
            { label: 'Completed this month',value: stats.completedThisMonth, color: 'text-dark/70',    sub: 'jobs done' },
            { label: 'Cancellation rate',   value: `${stats.cancellationRate}%`, color: 'text-danger', sub: 'of all bookings' },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="admin-card p-4 text-center">
              <p className={cn('font-display text-2xl font-bold', color)}>{value}</p>
              <p className="text-dark/50 text-xs mt-0.5 font-medium">{label}</p>
              <p className="text-dark/30 text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* View toggle + list filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Tab toggle */}
          <div className="flex gap-1 bg-muted/40 rounded-lg p-1 w-fit">
            {(['pipeline', 'list'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                  view === v ? 'bg-white text-dark shadow-sm' : 'text-dark/50 hover:text-dark',
                )}
              >
                {v === 'pipeline' ? <LayoutGrid size={14} aria-hidden="true" /> : <List size={14} aria-hidden="true" />}
                {v === 'pipeline' ? 'Pipeline' : 'List'}
              </button>
            ))}
          </div>

          {/* List view filters */}
          {view === 'list' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/35 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search bookings…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-sm border border-dark/15 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-dark/30 w-44"
                />
              </div>
              <SelectFilter value={statusFilter} onChange={setStatusFilter} label="Filter by status">
                <option value="all">All Statuses</option>
                {PIPELINE_COLUMNS.map(c => <option key={c.status} value={c.status}>{c.label}</option>)}
              </SelectFilter>
              <SelectFilter value={serviceFilter} onChange={setServiceFilter} label="Filter by service">
                <option value="all">All Services</option>
                {SERVICES.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </SelectFilter>
              <SelectFilter value={dateFilter} onChange={setDateFilter} label="Filter by date">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </SelectFilter>
              {(search || statusFilter !== 'all' || serviceFilter !== 'all' || dateFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setStatusFilter('all'); setServiceFilter('all'); setDateFilter('all') }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── PIPELINE VIEW ──────────────────────────────────────────── */}
        {view === 'pipeline' && (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
              {PIPELINE_COLUMNS.map(col => (
                <KanbanColumn
                  key={col.status}
                  column={col}
                  bookings={bookingsByStatus[col.status] ?? []}
                  onCardClick={(id) => setSelectedId(id)}
                />
              ))}
            </div>

            <DragOverlay
              dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}
            >
              {activeBooking && (
                <div className="w-72">
                  <BookingCardContent booking={activeBooking} isDragOverlay />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}

        {/* ── LIST VIEW ──────────────────────────────────────────────── */}
        {view === 'list' && (
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[750px]">
                <thead>
                  <tr className="border-b border-[#ECEEF2] bg-muted/30">
                    {['Customer', 'Service', 'Date', 'Property', 'Status', 'Submitted', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-dark/40 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-dark/40 text-sm">
                        No bookings match your filters.{' '}
                        <button
                          type="button"
                          onClick={() => { setSearch(''); setStatusFilter('all'); setServiceFilter('all'); setDateFilter('all') }}
                          className="text-primary hover:underline"
                        >
                          Clear filters
                        </button>
                      </td>
                    </tr>
                  ) : filteredBookings.map((b, i) => {
                    const svc    = SERVICES.find(s => s.slug === b.service)
                    const meta   = STATUS_META[b.status]
                    return (
                      <tr
                        key={b.id}
                        className={cn(
                          'border-b border-dark/5 hover:bg-muted/20 transition-colors',
                          i % 2 !== 0 && 'bg-muted/10',
                        )}
                      >
                        {/* Customer */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-dark text-sm">{b.name}</p>
                          <p className="text-dark/40 text-xs">{b.phone}</p>
                        </td>

                        {/* Service */}
                        <td className="px-5 py-4 text-dark/80 text-sm">
                          {svc?.title ?? b.service}
                        </td>

                        {/* Date requested */}
                        <td className="px-5 py-4">
                          <p className="text-dark/70 text-sm whitespace-nowrap">{formatShortDate(b.date)}</p>
                          <p className="text-dark/35 text-[11px] mt-0.5 capitalize">{b.timePreference}</p>
                        </td>

                        {/* Property */}
                        <td className="px-5 py-4 text-dark/60 text-xs whitespace-nowrap">
                          {PROPERTY_LABELS[b.propertyType]}, {SIZE_LABELS[b.propertySize]}
                          <br />
                          <span className="text-dark/35">{b.area}</span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <Badge label={meta.label} colorClass={meta.class} />
                        </td>

                        {/* Submitted */}
                        <td className="px-5 py-4 text-dark/45 text-xs whitespace-nowrap">
                          {formatShortDate(b.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            aria-label={`View booking from ${b.name}`}
                            onClick={() => setSelectedId(b.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-dark/40 hover:text-primary hover:bg-primary/8 transition-colors"
                          >
                            <Eye size={14} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredBookings.length > 0 && (
              <div className="px-5 py-3 border-t border-dark/5">
                <p className="text-xs text-dark/40">
                  Showing <span className="font-medium text-dark">{filteredBookings.length}</span> of{' '}
                  <span className="font-medium text-dark">{bookings.length}</span> bookings
                </p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Slide-over */}
      <BookingSlideOver
        booking={selectedBooking}
        onClose={useCallback(() => setSelectedId(null), [])}
        onStatusUpdate={handleStatusUpdate}
        onNotesUpdate={handleNotesUpdate}
      />
    </>
  )
}
