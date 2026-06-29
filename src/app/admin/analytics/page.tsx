'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import {
  TrendingUp, TrendingDown,
  ShoppingBag, Calendar, User, Package,
  DollarSign, ShoppingCart, Users, BookOpen, ArrowUpRight,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { ANALYTICS_BY_RANGE, ACTIVITY_FEED } from '@/lib/mock-analytics'
import type { DateRange, ActivityItem } from '@/lib/mock-analytics'
import { cn, formatPrice } from '@/lib/utils'

// Lazy-load chart components (recharts needs client-side only)
const RevenueChart         = dynamic(() => import('@/components/admin/charts/RevenueChart'),         { ssr: false })
const OrderStatusChart     = dynamic(() => import('@/components/admin/charts/OrderStatusChart'),     { ssr: false })
const BookingsByServiceChart = dynamic(() => import('@/components/admin/charts/BookingsByServiceChart'), { ssr: false })
const TopProductsChart     = dynamic(() => import('@/components/admin/charts/TopProductsChart'),     { ssr: false })
const CategoryRevenueChart = dynamic(() => import('@/components/admin/charts/CategoryRevenueChart'), { ssr: false })

// ─── Small Donut (New vs Returning) ──────────────────────────────────────────
// Using a simple SVG arc so we avoid another recharts dynamic import
function MiniDonut({ pct, primary, accent }: { pct: number; primary: string; accent: string }) {
  const r     = 32
  const circ  = 2 * Math.PI * r
  const dash  = (pct / 100) * circ
  const gap   = circ - dash
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="flex-shrink-0">
      <circle cx="40" cy="40" r={r} fill="none" stroke={accent}   strokeWidth="10" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={primary}  strokeWidth="10"
        strokeDasharray={`${dash} ${gap}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
      />
    </svg>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DATE_RANGES: { id: DateRange; label: string }[] = [
  { id: '7d',  label: 'Last 7 days'  },
  { id: '30d', label: 'Last 30 days' },
  { id: '3m',  label: 'Last 3 months' },
  { id: '1y',  label: 'This year'    },
]

function ChangeLabel({ pct }: { pct: number }) {
  if (pct === 0) return null
  const pos = pct > 0
  return (
    <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', pos ? 'text-success' : 'text-danger')}>
      {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {Math.abs(pct)}%
    </span>
  )
}

function ChartCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('admin-card overflow-hidden', className)}>
      <div className="px-5 py-4 border-b border-[#ECEEF2]">
        <h2 className="text-[15px] font-semibold text-dark tracking-tight">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

// ─── Activity feed ────────────────────────────────────────────────────────────

const ACTIVITY_ICONS: Record<ActivityItem['type'], React.ReactNode> = {
  order:    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><ShoppingBag size={14} className="text-primary" /></div>,
  booking:  <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0"><Calendar size={14} className="text-success" /></div>,
  customer: <div className="w-8 h-8 rounded-xl bg-accent/10  flex items-center justify-center flex-shrink-0"><User size={14} className="text-accent" /></div>,
  stock:    <div className="w-8 h-8 rounded-xl bg-muted      flex items-center justify-center flex-shrink-0"><Package size={14} className="text-dark/50" /></div>,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>('3m')

  const data   = useMemo(() => ANALYTICS_BY_RANGE[range], [range])
  const { kpi } = data

  const totalOrders       = data.orderStatuses.reduce((s, o) => s + o.count, 0)
  const returningPct      = Math.round(data.returningCustomers / (data.newCustomers + data.returningCustomers) * 100)
  const maxAreaRevenue    = Math.max(...data.areaRows.map(r => r.revenue))

  const KPI_CARDS = [
    {
      label:  'Total Revenue',
      value:  formatPrice(kpi.revenue),
      change: kpi.revenueChange,
      icon:   <DollarSign size={18} className="text-primary" />,
      bg:     'bg-primary/8',
    },
    {
      label:  'Total Orders',
      value:  kpi.orders.toString(),
      change: kpi.ordersChange,
      icon:   <ShoppingCart size={18} className="text-blue-600" />,
      bg:     'bg-blue-50',
    },
    {
      label:  'Total Bookings',
      value:  kpi.bookings.toString(),
      change: kpi.bookingsChange,
      icon:   <BookOpen size={18} className="text-success" />,
      bg:     'bg-success/8',
    },
    {
      label:  'New Customers',
      value:  kpi.newCustomers.toString(),
      change: kpi.newCustomersChange,
      icon:   <Users size={18} className="text-accent" />,
      bg:     'bg-accent/10',
    },
    {
      label:  'Avg Order Value',
      value:  formatPrice(kpi.avgOrderValue),
      change: kpi.avgOrderChange,
      icon:   <ArrowUpRight size={18} className="text-purple-600" />,
      bg:     'bg-purple-50',
    },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header + date range ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <AdminPageHeader
          title="Analytics"
          subtitle="Business performance overview"
        />
        <div className="flex gap-1 p-0.5 admin-card flex-shrink-0">
          {DATE_RANGES.map(r => (
            <button key={r.id} onClick={() => setRange(r.id)}
              className={cn(
                'px-3.5 py-2 text-xs font-medium rounded-md transition-all whitespace-nowrap',
                range === r.id ? 'bg-dark text-white' : 'text-dark/50 hover:text-dark hover:bg-[#F4F5F7]',
              )}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Section 1: KPI cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {KPI_CARDS.map(card => (
          <div key={card.label} className="admin-stat-card flex flex-col gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', card.bg)}>
              {card.icon}
            </div>
            <div>
              <p className="font-mono text-xl font-bold text-dark leading-tight">{card.value}</p>
              <p className="text-xs text-dark/45 mt-0.5">{card.label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <ChangeLabel pct={card.change} />
              <span className="text-xs text-dark/35">vs prev period</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 2: Revenue chart ─────────────────────────────────────── */}
      <ChartCard title="Revenue Over Time — Shop vs Services">
        <RevenueChart data={data.revenueSeries} />
      </ChartCard>

      {/* ── Section 3: Orders by status + Bookings by service ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Orders by Status">
          <OrderStatusChart data={data.orderStatuses} total={totalOrders} />
        </ChartCard>

        <ChartCard title="Bookings by Service">
          <BookingsByServiceChart data={data.serviceBookings} />
        </ChartCard>
      </div>

      {/* ── Section 4: Top products + Category revenue ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Selling Products">
          <TopProductsChart data={data.topProducts} />
        </ChartCard>

        <ChartCard title="Revenue by Category">
          <CategoryRevenueChart data={data.categoryRevenue} />
        </ChartCard>
      </div>

      {/* ── Section 5: Customer insights ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* New vs Returning */}
        <ChartCard title="New vs Returning Customers">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <MiniDonut pct={returningPct} primary="#CC1212" accent="#E8A020" />
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-display text-3xl font-bold text-dark">{returningPct}%</p>
                  <p className="text-sm text-dark/50">returning customers</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-dark/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Returning: {data.returningCustomers}
                  </span>
                  <span className="flex items-center gap-1.5 text-dark/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                    New: {data.newCustomers}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-dark">{data.newCustomers}</p>
                <p className="text-xs text-dark/45 mt-0.5">New customers</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-dark">{data.returningCustomers}</p>
                <p className="text-xs text-dark/45 mt-0.5">Returning customers</p>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Top areas */}
        <ChartCard title="Top Customer Areas">
          <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="grid grid-cols-[1fr_52px_52px_80px] gap-2 pb-2 border-b border-[#ECEEF2]">
              {['Area', 'Cust.', 'Orders', 'Revenue'].map(h => (
                <p key={h} className="text-[10px] font-semibold uppercase tracking-wide text-dark/35">{h}</p>
              ))}
            </div>
            {data.areaRows.map((row, i) => {
              const barPct = Math.round(row.revenue / maxAreaRevenue * 100)
              return (
                <div key={row.area} className={cn('py-2.5 border-b border-dark/5', i % 2 !== 0 && 'bg-muted/10 -mx-6 px-6')}>
                  <div className="grid grid-cols-[1fr_52px_52px_80px] gap-2 items-center mb-1.5">
                    <p className="text-xs font-medium text-dark">{row.area}</p>
                    <p className="text-xs text-dark/60 tabular-nums">{row.customers}</p>
                    <p className="text-xs text-dark/60 tabular-nums">{row.orders}</p>
                    <p className="text-xs font-mono font-semibold text-dark tabular-nums">{formatPrice(row.revenue)}</p>
                  </div>
                  <div className="w-full bg-dark/6 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${barPct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── Section 6: Activity feed ─────────────────────────────────────── */}
      <ChartCard title="Recent Activity">
        <div className="flex flex-col gap-0 -mx-6">
          {ACTIVITY_FEED.map((item, i) => (
            <div key={item.id}
              className={cn(
                'flex items-start gap-3 px-6 py-3 border-b border-dark/5',
                i % 2 !== 0 && 'bg-muted/15',
              )}>
              {ACTIVITY_ICONS[item.type]}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark leading-snug">{item.message}</p>
              </div>
              <span className="text-xs text-dark/35 whitespace-nowrap flex-shrink-0 mt-0.5">{item.timeAgo}</span>
            </div>
          ))}
        </div>
      </ChartCard>

    </div>
  )
}
