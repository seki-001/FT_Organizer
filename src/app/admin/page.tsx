import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, AlertTriangle, BarChart2 } from 'lucide-react'
import WelcomeBanner from './_components/WelcomeBanner'
import RevenueChart from './_components/RevenueChart'
import LiveKPICards from './_components/LiveKPICards'
import AdminCard from '@/components/admin/AdminCard'
import {
  ADMIN_REVENUE_BY_WEEK,
  ADMIN_PENDING_BOOKINGS,
  ADMIN_TOP_PRODUCTS,
  ADMIN_LOW_STOCK,
} from '@/lib/mock-admin-data'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard | FTO Admin' }

const BOOKING_STATUS_COLORS: Record<string, string> = {
  new:       'bg-amber-50 text-amber-700',
  quoted:    'bg-blue-50 text-blue-700',
  confirmed: 'bg-success/10 text-success',
}

function StatusBadge({ status, colors }: { status: string; colors: Record<string, string> }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize whitespace-nowrap ${colors[status] ?? 'bg-[#F4F5F7] text-dark/60'}`}>
      {status}
    </span>
  )
}

const maxUnits = Math.max(...ADMIN_TOP_PRODUCTS.map(p => p.unitsSold))

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <WelcomeBanner name="Faith Admin" />
        <Link
          href="/admin/analytics"
          className="flex items-center gap-2 text-sm font-medium text-dark/60 hover:text-primary transition-colors bg-white border border-[#ECEEF2] px-4 py-2.5 rounded-lg hover:shadow-sm transition-shadow whitespace-nowrap flex-shrink-0"
        >
          <BarChart2 size={15} />
          View Analytics
        </Link>
      </div>

      <LiveKPICards />

      <AdminCard title="Revenue Overview" subtitle="Weekly POS + online revenue">
        <div className="px-2 pb-2 pt-4">
          <RevenueChart data={ADMIN_REVENUE_BY_WEEK} />
        </div>
      </AdminCard>

      <AdminCard title="Pending Bookings" href="/admin/bookings" subtitle="Service bookings awaiting action">
        <div className="flex flex-col divide-y divide-[#ECEEF2]">
          {ADMIN_PENDING_BOOKINGS.map((booking) => (
            <div key={booking.id} className="px-5 py-4 admin-row-hover transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="font-medium text-dark text-sm leading-snug">{booking.service}</p>
                <StatusBadge status={booking.status} colors={BOOKING_STATUS_COLORS} />
              </div>
              <p className="text-dark/55 text-xs">{booking.customer}</p>
              <p className="text-dark/35 text-xs font-mono mt-0.5">{booking.date}</p>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        <div className="xl:col-span-3">
          <AdminCard title="Top Products" subtitle="By units sold this month">
            <div className="flex flex-col divide-y divide-[#ECEEF2]">
              {ADMIN_TOP_PRODUCTS.map((product, i) => {
                const pct = Math.round((product.unitsSold / maxUnits) * 100)
                return (
                  <div key={product.slug} className="px-5 py-4 flex items-center gap-4 admin-row-hover transition-colors">
                    <span className="w-5 text-center text-xs font-semibold text-dark/25 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <p className="text-sm font-medium text-dark truncate">{product.name}</p>
                      <div className="h-1.5 rounded-full bg-[#F4F5F7] overflow-hidden">
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
          </AdminCard>
        </div>

        <div className="xl:col-span-2">
          <AdminCard
            title="Low Stock Alert"
            href="/admin/products"
            headerRight={
              <span className="flex items-center gap-1.5 text-xs font-semibold text-danger bg-danger/8 px-2.5 py-1 rounded-md">
                <AlertTriangle size={11} />{ADMIN_LOW_STOCK.length} items
              </span>
            }
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              <p className="text-dark/45 text-sm">Restock these before they sell out.</p>
              {ADMIN_LOW_STOCK.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center justify-between gap-3 bg-danger/[0.04] border border-danger/10 rounded-lg px-4 py-3.5 hover:border-danger/20 transition-colors"
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
                    Update <ArrowRight size={11} className="inline" />
                  </Link>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

      </div>
    </div>
  )
}
