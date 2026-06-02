'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SparklineMetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  data: number[]
  iconClassName?: string
  iconBgClassName?: string
  strokeColor?: string
  className?: string
}

function Sparkline({ data, strokeColor = '#CC1212' }: { data: number[]; strokeColor?: string }) {
  if (data.length < 2) return null
  const w = 88
  const h = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0" aria-hidden="true">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export default function SparklineMetricCard({
  label,
  value,
  icon: Icon,
  data,
  iconClassName = 'text-primary',
  iconBgClassName = 'bg-primary/10',
  strokeColor,
  className,
}: SparklineMetricCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl border border-dark/8 shadow-sm p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', iconBgClassName)}>
          <Icon size={16} className={iconClassName} aria-hidden="true" />
        </div>
        <Sparkline data={data} strokeColor={strokeColor} />
      </div>
      <div>
        <p className="font-mono text-2xl font-bold text-dark">{value}</p>
        <p className="text-dark/50 text-xs mt-1">{label}</p>
      </div>
    </div>
  )
}
