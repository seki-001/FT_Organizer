import type { Metadata } from 'next'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, ShoppingBag, Calendar, Users,
  ArrowRight, AlertTriangle, BarChart2,
} from 'lucide-react'
import WelcomeBanner from './_components/WelcomeBanner'
import RevenueChart  from './_components/RevenueChart'
import {
  ADMIN_KPI,
  ADMIN_REVENUE_BY_WEEK,
  ADMIN_RECENT_ORDERS,
  ADMIN_PENDING_BOOKINGS,
  ADMIN_TOP_PRODUCTS,
  ADMIN_LOW_STOCK,
} from '@/lib/mock-admin-data'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard | FTO Admin' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ORDER_STATUS_COLORS: Record<string, string> = {
  processing: 'bg-accent/15 text-amber-700',
  packed:     'bg-blue-50 text-blue-700',
  dispatched: 'bg-primary/10 text-primary',
  delivered:  'bg-success/10 text-success',
  cancelled:  'bg-danger/10 text-danger',
}

const BOOKING_STATUS_COLORS: Record<string, string> = {
  new:       'bg-accent/15 text-amber-700',
  quoted:    'bg-blue-50 text-blue-700',
  confirmed: 'bg-success/10 text-success',
}

function StatusBadge({ status, colors }: { status: string; colors: Record<string, string> }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${colors[status] ?? 'bg-muted text-dark/60'}`}>
      {status}
    </span>
  )
}

function trendPct(current: number, prev: number) {
  return Math.round(((current - prev) / prev) * 100)
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  trend,
  borderColor,
}: {
  icon:         React.ElementType
  iconBg:       string
  iconColor:    string
  value:        string
  label:        string
  trend:        React.ReactNode
  borderColor:  string
}) {
  return (
    <div className={`bg-white rounded-2xl border border-dark/8 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4 border-l-4 ${borderColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={18} className={iconColor} aria-hidden="true" />
        </div>
        <div className="text-right min-w-0">
          <p className="font-mono text-3xl font-bold text-dark leading-none">{value}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-dark/55 text-sm font-medium">{label}</p>
        {trend}
      </div>
    </div>
  )
}

function TrendBadge({ pct }: { pct: number }) {
  return pct >= 0
    ? <span className="flex items-center gap-1 text-success text-xs font-semibold"><TrendingUp size={11} />+{pct}% vs last month</span>
    : <span className="flex items-center gap-1 text-danger  text-xs font-semibold"><TrendingDown size={11} />{pct}% vs last month</span>
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  href,
  children,
  headerRight,
}: {
  title:        string
  subtitle?:    string
  href?:        string
  children:     React.ReactNode
  headerRight?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-dark/6">
        <div>
          <h2 className="font-display text-base font-bold text-dark">{title}</h2>
          {subtitle && <p className="text-dark/40 text-xs mt-0.5">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="flex items-center gap-1 text-primary text-xs font-medium hover:underline flex-shrink-0">
            View all <ArrowRight size={12} aria-hidden="true" />
          </Link>
        )}
        {headerRight}
      </div>
      {children}
    </div>
  )
}

const revenuePct = trendPct(ADMIN_KPI.revenueThisMonth, ADMIN_KPI.revenuePrevMonth)
const ordersPct  = trendPct(ADMIN_KPI.ordersThisMonth,  ADMIN_KPI.ordersPrevMonth)
const maxUnits   = Math.max(...ADMIN_TOP_PRODUCTS.map(p => p.unitsSold))

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">

      {/* ── Welcome banner ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <WelcomeBanner name="Faith Admin" />
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2 text-sm font-medium text-dark/50 hover:text-primary transition-colors bg-white border border-dark/10 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-shadow whitespace-nowrap flex-shrink-0"
        >
          <BarChart2 size={15} />
          View Analytics
        </Link>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          iconBg="bg-primary/10" iconColor="text-primary"
          value={formatPrice(ADMIN_KPI.revenueThisMonth)}
          label="Revenue this month"
          borderColor="border-l-primary"
          trend={<TrendBadge pct={revenuePct} />}
        />
        <StatCard
          icon={ShoppingBag}
          iconBg="bg-accent/10" iconColor="text-accent"
          value={String(ADMIN_KPI.ordersThisMonth)}
          label="Orders this month"
          borderColor="border-l-accent"
          trend={<TrendBadge pct={ordersPct} />}
        />
        <StatCard
          icon={Calendar}
          iconBg="bg-success/10" iconColor="text-success"
          value={String(ADMIN_KPI.pendingBookings)}
          label="Pending bookings"
          borderColor="border-l-success"
          trend={
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              Needs attention
            </span>
          }
        />
        <StatCard
          icon={Users}
          iconBg="bg-blue-50" iconColor="text-blue-600"
          value={String(ADMIN_KPI.totalCustomers)}
          label="Total customers"
          borderColor="border-l-blue-400"
          trend={
            <span className="text-success text-xs font-semibold">
              +{ADMIN_KPI.newCustomersThisWeek} new this week
            </span>
          }
        />
      </div>

      {/* ── Revenue Chart ────────────────────────────────────────────────── */}
      <SectionCard title="Revenue — Last 8 Weeks" subtitle="Total KSh earned per week">
        <div className="px-4 py-6">
          <RevenueChart data={ADMIN_REVENUE_BY_WEEK} />
        </div>
      </SectionCard>

      {/* ── Recent Orders + Pending Bookings ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Recent Orders */}
        <div className="xl:col-span-3">
          <SectionCard title="Recent Orders" href="/admin/orders">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark/6 bg-muted/50">
                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-dark/50 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-dark/50 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-dark/50 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold text-dark/50 uppercase tracking-wider">When</th>
                  </tr>
                </thead>
                <tbody>
                  {ADMIN_RECENT_ORDERS.slice(0, 5).map((order, i) => (
                    <tr key={order.id} className={`border-b border-dark/5 hover:bg-primary/[0.02] transition-colors ${i % 2 !== 0 ? 'bg-muted/20' : ''}`}>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-dark text-sm">{order.customer}</p>
                        <p className="text-dark/40 text-xs">{order.area}</p>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-sm font-semibold text-dark whitespace-nowrap">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={order.status} colors={ORDER_STATUS_COLORS} />
                      </td>
                      <td className="px-4 py-3.5 text-dark/40 text-xs whitespace-nowrap">{order.timeAgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden flex flex-col divide-y divide-dark/5">
              {ADMIN_RECENT_ORDERS.slice(0, 4).map((order) => (
                <div key={order.id} className="px-5 py-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark text-sm">{order.customer}</p>
                    <p className="text-dark/40 text-xs mt-0.5">{order.area} · {order.timeAgo}</p>
                    <div className="mt-2">
                      <StatusBadge status={order.status} colors={ORDER_STATUS_COLORS} />
                    </div>
                  </div>
                  <p className="font-mono text-sm font-bold text-dark whitespace-nowrap flex-shrink-0">
                    {formatPrice(order.amount)}
                  </p>
                </div>
              ))}
              <div className="px-5 py-3">
                <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  View all orders <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Pending Bookings */}
        <div className="xl:col-span-2">
          <SectionCard title="Pending Bookings" href="/admin/bookings">
            <div className="flex flex-col divide-y divide-dark/5">
              {ADMIN_PENDING_BOOKINGS.map((booking) => (
                <div key={booking.id} className="px-6 py-4 hover:bg-primary/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-dark text-sm leading-snug">{booking.service}</p>
                    <StatusBadge status={booking.status} colors={BOOKING_STATUS_COLORS} />
                  </div>
                  <p className="text-dark/55 text-xs">{booking.customer}</p>
                  <p className="text-dark/35 text-xs font-mono mt-0.5">{booking.date}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Top Products + Low Stock ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Top Products */}
        <div className="xl:col-span-3">
          <SectionCard title="Top Products" subtitle="By units sold this month">
            <div className="flex flex-col divide-y divide-dark/5">
              {ADMIN_TOP_PRODUCTS.map((product, i) => {
                const pct = Math.round((product.unitsSold / maxUnits) * 100)
                return (
                  <div key={product.slug} className="px-6 py-4 flex items-center gap-4 hover:bg-primary/[0.02] transition-colors">
                    <span className="w-5 text-center text-xs font-bold text-dark/25 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <p className="text-sm font-medium text-dark truncate">{product.name}</p>
                      <div className="h-1.5 rounded-full bg-primary/8 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-dark">{product.unitsSold} units</p>
                      <p className="text-xs font-mono text-dark/40">{formatPrice(product.revenue)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        </div>

        {/* Low Stock Alert */}
        <div className="xl:col-span-2">
          <SectionCard
            title="Low Stock Alert"
            href="/admin/products"
            headerRight={
              <span className="flex items-center gap-1.5 text-xs font-semibold text-danger bg-danger/8 px-2.5 py-1 rounded-full">
                <AlertTriangle size={11} />{ADMIN_LOW_STOCK.length} items
              </span>
            }
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <p className="text-dark/45 text-sm">
                Restock these before they sell out.
              </p>
              {ADMIN_LOW_STOCK.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3 bg-danger/[0.04] border border-danger/12 rounded-xl px-4 py-3.5 hover:border-danger/25 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <AlertTriangle size={14} className="text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                      <p className="text-danger text-xs font-semibold mt-0.5">Only {item.stockCount} left</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/products"
                    className="text-xs font-semibold text-primary hover:underline whitespace-nowrap flex-shrink-0"
                  >
                    Update ↗
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

      </div>

    </div>
  )
}
