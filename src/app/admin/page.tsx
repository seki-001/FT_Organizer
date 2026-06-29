import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart2 } from 'lucide-react'
import WelcomeBanner from './_components/WelcomeBanner'
import LiveKPICards from './_components/LiveKPICards'
import DashboardOverview from './_components/DashboardOverview'

export const metadata: Metadata = { title: 'Dashboard | FTO Admin' }

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
          Full Analytics
        </Link>
      </div>

      <LiveKPICards />

      <DashboardOverview />
    </div>
  )
}
