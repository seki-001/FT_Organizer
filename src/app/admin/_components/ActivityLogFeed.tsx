'use client'

import { useEffect, useState } from 'react'
import AdminCard from '@/components/admin/AdminCard'
import type { ActivityLogRow } from '@/lib/activity-log'

function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function sourceBadge(source: string) {
  const colors: Record<string, string> = {
    admin: 'bg-blue-50 text-blue-700',
    storefront: 'bg-emerald-50 text-emerald-700',
    system: 'bg-dark/5 text-dark/50',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${colors[source] ?? colors.system}`}>
      {source}
    </span>
  )
}

export default function ActivityLogFeed({ limit = 8 }: { limit?: number }) {
  const [logs, setLogs] = useState<ActivityLogRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/activity-logs?limit=${limit}`)
      .then((r) => r.json())
      .then((data: { logs?: ActivityLogRow[] }) => setLogs(data.logs ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) {
    return (
      <AdminCard title="Recent Activity" subtitle="Latest across shop & services">
        <div className="px-5 py-8 text-sm text-dark/40 text-center">Loading activity…</div>
      </AdminCard>
    )
  }

  if (logs.length === 0) {
    return (
      <AdminCard title="Recent Activity" subtitle="Latest across shop & services">
        <div className="px-5 py-8 text-sm text-dark/40 text-center">
          No activity recorded yet. Actions will appear here as users interact with the site.
        </div>
      </AdminCard>
    )
  }

  return (
    <AdminCard title="Recent Activity" subtitle="Latest across shop & services">
      <div className="divide-y divide-[#ECEEF2] max-h-[340px] overflow-y-auto">
        {logs.map((item) => (
          <div key={item.id} className="px-5 py-3.5 admin-row-hover transition-colors">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm text-dark leading-snug flex-1">{item.description}</p>
              {sourceBadge(item.source)}
            </div>
            <p className="text-[11px] text-dark/35">
              {item.actor_name ?? item.actor_email ?? 'Anonymous'}
              {' · '}
              {formatTimeAgo(item.created_at)}
            </p>
          </div>
        ))}
      </div>
    </AdminCard>
  )
}
