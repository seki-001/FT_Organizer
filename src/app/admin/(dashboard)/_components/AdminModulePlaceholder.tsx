import type { Metadata } from 'next'
import type { LucideIcon } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminDemoNotice from '@/components/admin/AdminDemoNotice'
import EmptyState from '@/components/admin/ui/EmptyState'

interface AdminModulePlaceholderProps {
  title: string
  description: string
  icon: LucideIcon
  primaryHref?: string
  primaryLabel?: string
}

export function AdminModulePlaceholderPage({
  title,
  description,
  icon,
  primaryHref = '/admin',
  primaryLabel = 'Back to dashboard',
}: AdminModulePlaceholderProps) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <AdminDemoNotice />
      <AdminPageHeader title={title} subtitle={description} />
      <div className="bg-white rounded-2xl border border-dark/8 shadow-sm">
        <EmptyState
          icon={icon}
          title={`${title} — coming soon`}
          message="This module is part of the Stage 12 admin shell. Connect your backend when ready; navigation and layout are in place."
          action={{ label: primaryLabel, href: primaryHref }}
        />
      </div>
    </div>
  )
}

export function buildPlaceholderMetadata(title: string): Metadata {
  return { title: `${title} | FTO Admin` }
}
