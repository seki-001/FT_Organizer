'use client'

import { cn } from '@/lib/utils'

export interface AdminTab {
  id: string
  label: string
}

interface AdminDetailTabsProps {
  tabs: AdminTab[]
  active: string
  onChange: (id: string) => void
}

export default function AdminDetailTabs({ tabs, active, onChange }: AdminDetailTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted/60 rounded-xl overflow-x-auto" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all',
            active === tab.id ? 'bg-white shadow-sm text-dark' : 'text-dark/50 hover:text-dark',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
