import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'brand' | 'success' | 'danger' | 'accent' | 'dark'

const tones: Record<Tone, string> = {
  neutral: 'bg-dark/5 text-dark/80',
  brand: 'bg-primary/10 text-primary-dark',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  accent: 'bg-accent/20 text-dark',
  dark: 'bg-ink text-white',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export default function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
