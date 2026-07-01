'use client'

import { useEffect, useState } from 'react'
import AdminCard from '@/components/admin/AdminCard'
import type { ActivityLogRow } from '@/lib/activity-log'

type SourceFilter = 'all' | 'storefront' | 'admin' | 'system'

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<SourceFilter>('all')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (source !== 'all') params.set('source', source)

    fetch(`/api/admin/activity-logs?${params}`)
      .then((r) => r.json())
      .then((data: { logs?: ActivityLogRow[] }) => setLogs(data.logs ?? []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false))
  }, [source])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-dark">Activity Log</h1>
          <p className="text-dark/50 text-sm mt-1">
            Track who did what and when across the storefront and admin dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'storefront', 'admin', 'system'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                source === s
                  ? 'bg-primary text-white'
                  : 'bg-[#F4F5F7] text-dark/60 hover:bg-[#ECEEF2]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <AdminCard title="All Activity" subtitle={loading ? 'Loading…' : `${logs.length} entries`}>
        {loading ? (
          <div className="px-5 py-12 text-center text-dark/40 text-sm">Loading activity logs…</div>
        ) : logs.length === 0 ? (
          <div className="px-5 py-12 text-center text-dark/40 text-sm">
            No activity logs yet. User sign-ins, bookings, orders, and admin changes will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#ECEEF2] text-left text-dark/40 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">When</th>
                  <th className="px-5 py-3 font-medium">Who</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEEF2]">
                {logs.map((log) => (
                  <tr key={log.id} className="admin-row-hover">
                    <td className="px-5 py-3 text-dark/50 whitespace-nowrap text-xs font-mono">
                      {formatTimestamp(log.created_at)}
                    </td>
                    <td className="px-5 py-3 text-dark whitespace-nowrap">
                      {log.actor_name ?? log.actor_email ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-dark/70 font-mono text-xs whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-5 py-3 text-dark max-w-md">{log.description}</td>
                    <td className="px-5 py-3 capitalize text-dark/50 text-xs">{log.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  )
}
