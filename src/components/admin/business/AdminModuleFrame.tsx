import AdminDemoNotice from '@/components/admin/AdminDemoNotice'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import type { LucideIcon } from 'lucide-react'

interface AdminModuleFrameProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: 'primary' | 'outline'
    icon?: LucideIcon
  }
  children: React.ReactNode
  showDemoNotice?: boolean
}

export default function AdminModuleFrame({
  title,
  subtitle,
  action,
  children,
  showDemoNotice = true,
}: AdminModuleFrameProps) {
  return (
    <div className="flex flex-col gap-6 max-w-[1600px]">
      {showDemoNotice && <AdminDemoNotice />}
      <AdminPageHeader title={title} subtitle={subtitle} action={action} />
      {children}
    </div>
  )
}
