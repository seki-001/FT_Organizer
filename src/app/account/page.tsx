'use client'

import AccountDemoNotice from '@/components/account/AccountDemoNotice'
import AccountWelcomeCard from './_components/AccountWelcomeCard'
import AccountQuickActions from './_components/AccountQuickActions'
import AccountStatsRow from './_components/AccountStatsRow'
import AccountUpcomingVisit from './_components/AccountUpcomingVisit'
import AccountRecentOrders from './_components/AccountRecentOrders'
import AccountQuotations from './_components/AccountQuotations'
import AccountPaymentsInvoices from './_components/AccountPaymentsInvoices'
import AccountLoyaltyCard from './_components/AccountLoyaltyCard'
import AccountFollowUpTimeline from './_components/AccountFollowUpTimeline'
import AccountProfileSnapshot from './_components/AccountProfileSnapshot'

export default function AccountDashboardPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <AccountDemoNotice />
      <AccountWelcomeCard />
      <AccountQuickActions />
      <AccountStatsRow />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <AccountUpcomingVisit />
        <AccountRecentOrders />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <AccountQuotations />
        <AccountPaymentsInvoices />
      </div>

      <AccountLoyaltyCard />
      <AccountFollowUpTimeline />
      <AccountProfileSnapshot />
    </div>
  )
}
