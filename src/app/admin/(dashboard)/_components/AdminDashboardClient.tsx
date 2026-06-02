'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Users,
  Wallet,
} from 'lucide-react'
import WelcomeBanner from '../../_components/WelcomeBanner'
import AdminDemoNotice from '@/components/admin/AdminDemoNotice'
import MetricCard from '@/components/admin/ui/MetricCard'
import SparklineMetricCard from '@/components/admin/ui/SparklineMetricCard'
import ChartCard from '@/components/admin/ui/ChartCard'
import DataTable from '@/components/admin/ui/DataTable'
import ActivityFeedCard from '@/components/admin/ui/ActivityFeedCard'
import AlertListCard from '@/components/admin/ui/AlertListCard'
import QuickActionsCard from '@/components/admin/ui/QuickActionsCard'
import StatusBadge from '@/components/ui/StatusBadge'
import {
  ADMIN_DASHBOARD_KPI,
  KPI_SPARKLINES,
  DASHBOARD_REVENUE_SERIES,
  SERVICE_VS_PRODUCT_MONTH,
  BOOKINGS_BY_WEEK,
  EXPENSES_VS_PURCHASES,
  PAYMENT_STATUS_SLICES,
  DEBTOR_SLICES,
  REGIONAL_PERFORMANCE,
  FOLLOW_UP_COMPLETION,
  DASHBOARD_ACTIVITY,
  MONDAY_BOOKINGS,
  OVERDUE_INVOICES,
  ADMIN_RECENT_ORDERS,
  ADMIN_PENDING_BOOKINGS,
  ADMIN_LOW_STOCK,
  RECENT_PAYMENTS,
  DASHBOARD_QUICK_ACTIONS,
} from '@/lib/admin-dashboard-data'
import {
  adminOrderStatusVariant,
  adminBookingStatusVariant,
  adminPaymentStatusVariant,
  formatAdminStatus,
} from '@/lib/admin-status'
import { formatPrice } from '@/lib/utils'

const RevenueChart = dynamic(() => import('@/components/admin/charts/RevenueChart'), { ssr: false })
const ServiceProductBarChart = dynamic(
  () => import('@/components/admin/dashboard/ServiceProductBarChart'),
  { ssr: false },
)
const BookingsBarChart = dynamic(() => import('@/components/admin/dashboard/BookingsBarChart'), { ssr: false })
const ExpensesPurchasesChart = dynamic(
  () => import('@/components/admin/dashboard/ExpensesPurchasesChart'),
  { ssr: false },
)
const AdminDonutChart = dynamic(() => import('@/components/admin/dashboard/AdminDonutChart'), { ssr: false })
const RegionalBarChart = dynamic(() => import('@/components/admin/dashboard/RegionalBarChart'), { ssr: false })
const FollowUpCompletionChart = dynamic(
  () => import('@/components/admin/dashboard/FollowUpCompletionChart'),
  { ssr: false },
)

function trendPct(current: number, prev: number) {
  if (!prev) return 0
  return Math.round(((current - prev) / prev) * 100)
}

const paymentTotal = PAYMENT_STATUS_SLICES.reduce((s, x) => s + x.count, 0)
const debtorTotal = DEBTOR_SLICES.reduce((s, x) => s + x.count, 0)

export default function AdminDashboardClient({ userName }: { userName: string }) {
  const revenuePct = trendPct(ADMIN_DASHBOARD_KPI.revenueThisMonth, ADMIN_DASHBOARD_KPI.revenuePrevMonth)
  const ordersPct = trendPct(ADMIN_DASHBOARD_KPI.ordersThisMonth, ADMIN_DASHBOARD_KPI.ordersPrevMonth)

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[1600px] mx-auto">
      <AdminDemoNotice />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <WelcomeBanner name={userName} />
        <QuickActionsCard actions={DASHBOARD_QUICK_ACTIONS} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          label="Revenue this month"
          value={formatPrice(ADMIN_DASHBOARD_KPI.revenueThisMonth)}
          icon={TrendingUp}
          trend={{ pct: revenuePct }}
          accentBorder="border-l-primary"
        />
        <MetricCard
          label="Orders this month"
          value={String(ADMIN_DASHBOARD_KPI.ordersThisMonth)}
          icon={ShoppingBag}
          iconClassName="text-accent"
          iconBgClassName="bg-accent/10"
          trend={{ pct: ordersPct }}
          accentBorder="border-l-accent"
        />
        <MetricCard
          label="Pending bookings"
          value={String(ADMIN_DASHBOARD_KPI.pendingBookings)}
          icon={Calendar}
          iconClassName="text-success"
          iconBgClassName="bg-success/10"
          accentBorder="border-l-success"
          footer={
            <span className="text-xs font-semibold text-accent bg-accent/15 px-2 py-0.5 rounded-full w-fit">
              Needs review
            </span>
          }
        />
        <MetricCard
          label="Total clients"
          value={String(ADMIN_DASHBOARD_KPI.totalCustomers)}
          icon={Users}
          iconClassName="text-primary"
          iconBgClassName="bg-primary/10"
          accentBorder="border-l-primary/60"
          footer={
            <span className="text-success text-xs font-semibold">
              +{ADMIN_DASHBOARD_KPI.newCustomersThisWeek} this week
            </span>
          }
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SparklineMetricCard
          label="Revenue trend (8 wks)"
          value={formatPrice(ADMIN_DASHBOARD_KPI.revenueToday)}
          icon={Wallet}
          data={KPI_SPARKLINES.revenue}
        />
        <SparklineMetricCard
          label="Order volume"
          value={String(ADMIN_DASHBOARD_KPI.ordersThisMonth)}
          icon={ShoppingBag}
          data={KPI_SPARKLINES.orders}
          strokeColor="#E8A020"
        />
        <SparklineMetricCard
          label="Booking requests"
          value={String(ADMIN_DASHBOARD_KPI.pendingBookings)}
          icon={Calendar}
          data={KPI_SPARKLINES.bookings}
          strokeColor="#2D7A47"
        />
        <SparklineMetricCard
          label="Client base"
          value={String(ADMIN_DASHBOARD_KPI.totalCustomers)}
          icon={Users}
          data={KPI_SPARKLINES.customers}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm">
          <p className="text-xs text-dark/45">Outstanding invoices</p>
          <p className="font-mono text-xl font-bold text-dark mt-1">
            {formatPrice(ADMIN_DASHBOARD_KPI.outstandingInvoices)}
          </p>
          <p className="text-xs text-danger font-medium mt-1">{ADMIN_DASHBOARD_KPI.overdueInvoices} overdue</p>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm">
          <p className="text-xs text-dark/45">Debtor balance</p>
          <p className="font-mono text-xl font-bold text-dark mt-1">
            {formatPrice(ADMIN_DASHBOARD_KPI.debtorBalance)}
          </p>
          <p className="text-xs text-dark/40 mt-1">Preview totals only</p>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm">
          <p className="text-xs text-dark/45">Expenses vs purchases</p>
          <p className="font-mono text-xl font-bold text-dark mt-1">
            {formatPrice(ADMIN_DASHBOARD_KPI.expensesMonth)}
          </p>
          <p className="text-xs text-dark/40 mt-1">Purchases {formatPrice(ADMIN_DASHBOARD_KPI.purchasesMonth)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm">
          <p className="text-xs text-dark/45">Follow-up completion</p>
          <p className="font-mono text-xl font-bold text-success mt-1">
            {ADMIN_DASHBOARD_KPI.followUpCompletionPct}%
          </p>
          <p className="text-xs text-dark/40 mt-1">{ADMIN_DASHBOARD_KPI.lowStockCount} low-stock SKUs</p>
        </div>
      </div>

      <ChartCard title="Revenue over time" subtitle="Shop vs services — last 8 weeks" className="col-span-full">
        <RevenueChart data={DASHBOARD_REVENUE_SERIES} />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Service vs product revenue" subtitle="This month (preview)">
          <ServiceProductBarChart data={SERVICE_VS_PRODUCT_MONTH} />
        </ChartCard>
        <ChartCard title="Bookings by week" subtitle="Requests vs confirmed" href="/admin/bookings">
          <BookingsBarChart data={BOOKINGS_BY_WEEK} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Expenses vs purchases" subtitle="Monthly trend (preview)">
          <ExpensesPurchasesChart data={EXPENSES_VS_PURCHASES} />
        </ChartCard>
        <ChartCard title="Follow-up completion" subtitle="Weekly completion rate %" href="/admin/follow-ups">
          <FollowUpCompletionChart data={FOLLOW_UP_COMPLETION} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ChartCard title="Payment status" subtitle="Order payments (preview)">
          <AdminDonutChart
            data={PAYMENT_STATUS_SLICES}
            centerValue={paymentTotal}
            centerLabel="payments"
          />
        </ChartCard>
        <ChartCard title="Debtors aging" subtitle="Outstanding balances (preview)">
          <AdminDonutChart
            data={DEBTOR_SLICES}
            centerValue={debtorTotal}
            centerLabel="accounts"
          />
        </ChartCard>
        <ChartCard title="Regional performance" subtitle="Revenue by area (preview)" className="md:col-span-2 xl:col-span-1">
          <RegionalBarChart data={REGIONAL_PERFORMANCE} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ActivityFeedCard items={DASHBOARD_ACTIVITY} />
        </div>
        <div className="flex flex-col gap-6">
          <AlertListCard
            title="Monday bookings"
            subtitle="This week’s site visits"
            href="/admin/bookings"
            items={MONDAY_BOOKINGS.map((b) => ({
              id: b.id,
              title: b.customer,
              subtitle: `${b.service} · ${b.time}`,
              meta: b.area,
              href: '/admin/bookings',
              severity: 'info' as const,
            }))}
          />
          <AlertListCard
            title="Overdue invoices"
            subtitle="Requires follow-up"
            href="/admin/invoices"
            badgeCount={OVERDUE_INVOICES.length}
            items={OVERDUE_INVOICES.map((inv) => ({
              id: inv.id,
              title: inv.client,
              subtitle: `${inv.dueDate} · ${inv.daysOverdue} days overdue`,
              meta: formatPrice(inv.amount),
              href: '/admin/invoices',
              severity: 'danger' as const,
            }))}
          />
          <AlertListCard
            title="Low stock alerts"
            href="/admin/products"
            badgeCount={ADMIN_LOW_STOCK.length}
            items={ADMIN_LOW_STOCK.map((item) => ({
              id: item.slug,
              title: item.name,
              subtitle: `Only ${item.stockCount} left in stock`,
              href: '/admin/products',
              severity: 'warning' as const,
            }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <ChartCard title="Recent orders" href="/admin/orders" className="xl:col-span-1">
          <DataTable
            compact
            rows={ADMIN_RECENT_ORDERS.slice(0, 5)}
            rowKey={(r) => r.id}
            columns={[
              {
                key: 'customer',
                header: 'Customer',
                render: (r) => (
                  <div>
                    <p className="font-medium text-dark">{r.customer}</p>
                    <p className="text-xs text-dark/40">{r.area}</p>
                  </div>
                ),
              },
              {
                key: 'amount',
                header: 'Amount',
                render: (r) => <span className="font-mono font-semibold">{formatPrice(r.amount)}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge label={formatAdminStatus(r.status)} variant={adminOrderStatusVariant(r.status)} />
                ),
              },
            ]}
          />
        </ChartCard>

        <ChartCard title="Recent bookings" href="/admin/bookings">
          <DataTable
            compact
            rows={ADMIN_PENDING_BOOKINGS}
            rowKey={(r) => r.id}
            columns={[
              {
                key: 'service',
                header: 'Service',
                render: (r) => <span className="text-sm font-medium">{r.service}</span>,
              },
              {
                key: 'customer',
                header: 'Client',
                hideOnMobile: true,
                render: (r) => r.customer,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge label={formatAdminStatus(r.status)} variant={adminBookingStatusVariant(r.status)} />
                ),
              },
            ]}
          />
        </ChartCard>

        <ChartCard title="Recent payments" href="/admin/payments">
          <DataTable
            compact
            rows={RECENT_PAYMENTS}
            rowKey={(r) => r.id}
            emptyMessage="No payment records in preview."
            columns={[
              {
                key: 'client',
                header: 'Client',
                render: (r) => r.client,
              },
              {
                key: 'amount',
                header: 'Amount',
                render: (r) => <span className="font-mono">{formatPrice(r.amount)}</span>,
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge label={formatAdminStatus(r.status)} variant={adminPaymentStatusVariant(r.status)} />
                ),
              },
            ]}
          />
        </ChartCard>
      </div>

      <p className="text-center text-xs text-dark/35 pb-2">
        Financial figures are illustrative.{' '}
        <Link href="/admin/reports" className="text-primary hover:underline">
          Open reports
        </Link>{' '}
        for detailed analytics.
      </p>
    </div>
  )
}
