import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  sm: 20,
  md: 28,
  lg: 36,
}

export default function LoadingState({
  label = 'Loading…',
  className,
  size = 'md',
}: LoadingStateProps) {
  const iconSize = SIZE_MAP[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 px-6 text-dark/50',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 size={iconSize} className="animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  )
}
