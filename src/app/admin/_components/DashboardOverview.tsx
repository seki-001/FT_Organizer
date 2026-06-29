'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AdminCard from '@/components/admin/AdminCard'
import { ANALYTICS_BY_RANGE, ACTIVITY_FEED } from '@/lib/mock-analytics'
import {
  ADMIN_PENDING_BOOKINGS,
  ADMIN_LOW_STOCK,
} from '@/lib/mock-admin-data'
import { formatPrice } from '@/lib/utils'

const RevenueChart = dynamic(() => import('@/components/admin/charts/RevenueChart'), { ssr: false })
const OrderStatusChart = dynamic(() => import('@/components/admin/charts/OrderStatusChart'), { ssr: false })
const BookingsByServiceChart = dynamic(() => import('@/components/admin/charts/BookingsByServiceChart'), { ssr: false })
const TopProductsChart = dynamic(() => import('@/components/admin/charts/TopProductsChart'), { ssr: false })
const CategoryRevenueChart = dynamic(() => import('@/components/admin/charts/CategoryRevenueChart'), { ssr: false })

const BOOKING_STATUS_COLORS: Record<string, string> = {
  new: 'bg-amber-50 text-amber-700',
  quoted: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-success/10 text-success',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize whitespace-nowrap ${BOOKING_STATUS_COLORS[status] ?? 'bg-[#F4F5F7] text-dark/60'}`}>
      {status}
    </span>
  )
}

export default function DashboardOverview() {
  const data = ANALYTICS_BY_RANGE['30d']
  const totalOrders = data.orderStatuses.reduce((s, o) => s + o.count, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Primary charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AdminCard title="Revenue Overview" subtitle="Shop vs services — last 30 days" className="xl:col-span-2" bodyClassName="p-4">
          <RevenueChart data={data.revenueSeries} />
        </AdminCard>

        <AdminCard title="Orders by Status" subtitle={`${totalOrders} orders this month`} bodyClassName="p-4">
          <OrderStatusChart data={data.orderStatuses} total={totalOrders} />
        </AdminCard>
      </div>

      {/* Secondary charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Bookings by Service" subtitle="Most requested services" bodyClassName="p-4">
          <BookingsByServiceChart data={data.serviceBookings} />
        </AdminCard>

        <AdminCard title="Revenue by Category" subtitle="Shop category breakdown" bodyClassName="p-4">
          <CategoryRevenueChart data={data.categoryRevenue} />
        </AdminCard>
      </div>

      {/* Products + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <AdminCard title="Top Products" subtitle="Units sold with 4-week trend" bodyClassName="p-4">
            <TopProductsChart data={data.topProducts} />
          </AdminCard>
        </div>

        <div className="xl:col-span-2">
          <AdminCard title="Recent Activity" subtitle="Latest across shop & services">
            <div className="divide-y divide-[#ECEEF2] max-h-[340px] overflow-y-auto">
              {ACTIVITY_FEED.slice(0, 8).map((item) => (
                <div key={item.id} className="px-5 py-3.5 admin-row-hover transition-colors">
                  <p className="text-sm text-dark leading-snug">{item.message}</p>
                  <p className="text-[11px] text-dark/35 mt-1">{item.timeAgo}</p>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Operational tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Pending Bookings" href="/admin/bookings" subtitle="Awaiting your action">
          <div className="divide-y divide-[#ECEEF2]">
            {ADMIN_PENDING_BOOKINGS.slice(0, 4).map((booking) => (
              <div key={booking.id} className="px-5 py-4 admin-row-hover transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-dark text-sm">{booking.service}</p>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-dark/55 text-xs">{booking.customer}</p>
                <p className="text-dark/35 text-xs font-mono mt-0.5">{booking.date}</p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Low Stock"
          href="/admin/products"
          headerRight={
            <span className="text-xs font-semibold text-danger bg-danger/8 px-2 py-1 rounded-md">
              {ADMIN_LOW_STOCK.length} items
            </span>
          }
        >
          <div className="px-5 py-4 flex flex-col gap-3">
            {ADMIN_LOW_STOCK.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between gap-3 rounded-lg border border-danger/10 bg-danger/[0.04] px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{item.name}</p>
                  <p className="text-danger text-xs font-semibold mt-0.5">Only {item.stockCount} left</p>
                </div>
                <Link href="/admin/products" className="text-xs font-semibold text-primary hover:underline flex-shrink-0">
                  Restock <ArrowRight size={11} className="inline" />
                </Link>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '30-day revenue', value: formatPrice(data.kpi.revenue) },
          { label: 'Orders', value: String(data.kpi.orders) },
          { label: 'Bookings', value: String(data.kpi.bookings) },
          { label: 'Avg order value', value: formatPrice(data.kpi.avgOrderValue) },
        ].map((stat) => (
          <div key={stat.label} className="admin-stat-card py-4">
            <p className="font-mono text-xl font-bold text-dark">{stat.value}</p>
            <p className="text-dark/50 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
