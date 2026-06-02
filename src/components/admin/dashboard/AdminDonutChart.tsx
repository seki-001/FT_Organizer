'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export interface DonutSlice {
  status: string
  count: number
  color: string
}

interface AdminDonutChartProps {
  data: DonutSlice[]
  centerLabel: string
  centerValue: string | number
  height?: number
}

function TooltipContent({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-dark/10 rounded-xl shadow-lg px-3 py-2 text-sm">
      <p className="font-medium text-dark">{entry.name}</p>
      <p className="text-dark/50 text-xs mt-0.5">{entry.value}</p>
    </div>
  )
}

export default function AdminDonutChart({
  data,
  centerLabel,
  centerValue,
  height = 220,
}: AdminDonutChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={height * 0.28}
              outerRadius={height * 0.4}
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
            <Tooltip content={<TooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-dark">{centerValue}</p>
            <p className="text-xs text-dark/40 mt-0.5">{centerLabel}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((entry) => {
          const pct = total ? Math.round((entry.count / total) * 100) : 0
          return (
            <div key={entry.status} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
              <span className="text-dark/70 flex-1">{entry.status}</span>
              <span className="font-medium text-dark tabular-nums">{entry.count}</span>
              <span className="text-dark/35 tabular-nums w-8 text-right">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
