'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipContentProps,
} from 'recharts'
import type { WeekRevenue } from '@/lib/mock-admin-data'

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip(
  { active, payload, label }: Partial<TooltipContentProps<number, string>>,
) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-dark/50 text-xs mb-0.5">Week of {label}</p>
      <p className="font-mono font-semibold text-dark">
        KSh {(payload[0].value ?? 0).toLocaleString('en-KE')}
      </p>
    </div>
  )
}

// ─── Chart ────────────────────────────────────────────────────────────────────

export default function RevenueChart({ data }: { data: WeekRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F4F4F4"
          vertical={false}
        />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F4F4F4', strokeWidth: 2 }} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#E8191A"
          strokeWidth={2.5}
          dot={{ fill: '#E8191A', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#E8191A', r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
