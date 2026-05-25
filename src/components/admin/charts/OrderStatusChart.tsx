'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { OrderStatusSlice } from '@/lib/mock-analytics'

interface TTProps { active?: boolean; payload?: Array<{ name: string; value: number }> }

function CustomTooltip({ active, payload }: TTProps) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-3 py-2.5 text-sm">
      <p className="font-medium text-dark">{entry.name}</p>
      <p className="font-mono text-dark/60 text-xs mt-0.5">{entry.value} orders</p>
    </div>
  )
}

interface Props {
  data:  OrderStatusSlice[]
  total: number
}

export default function OrderStatusChart({ data, total }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="status"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-dark">{total}</p>
            <p className="text-xs text-dark/40 mt-0.5">orders</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map(entry => {
          const pct = Math.round(entry.count / total * 100)
          return (
            <div key={entry.status} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-xs text-dark/70 flex-1">{entry.status}</span>
              <span className="text-xs font-medium text-dark tabular-nums">{entry.count}</span>
              <span className="text-xs text-dark/35 tabular-nums w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
