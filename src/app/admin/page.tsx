import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, BarChart2 } from 'lucide-react'
import WelcomeBanner   from './_components/WelcomeBanner'
import RevenueChart    from './_components/RevenueChart'
import LiveKPICards    from './_components/LiveKPICards'
import {
  ADMIN_REVENUE_BY_WEEK,
  ADMIN_PENDING_BOOKINGS,
  ADMIN_TOP_PRODUCTS,
  ADMIN_LOW_STOCK,
} from '@/lib/mock-admin-data'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard | FTO Admin' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const maxUnits = Math.max(...ADMIN_TOP_PRODUCTS.map(p => p.unitsSold))

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

      {/* ── Live KPI cards + Recent POS Sales (from localStorage) ───────── */}
      <LiveKPICards />

      {/* ── Pending Bookings ─────────────────────────────────────────────── */}
      <SectionCard title="Pending Bookings" href="/admin/bookings" subtitle="Service bookings awaiting action">
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
