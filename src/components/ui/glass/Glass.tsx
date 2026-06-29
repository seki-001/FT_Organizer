import { cn } from '@/lib/utils'

type GlassTone = 'light' | 'dark' | 'brand'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  tone?: GlassTone
  rounded?: '2xl' | '3xl' | 'full'
  as?: 'div' | 'section' | 'article'
}

const toneClass: Record<GlassTone, string> = {
  light: 'glass-panel-light',
  dark: 'glass-panel-dark',
  brand: 'glass-panel-brand',
}

const roundedClass = {
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
}

export function GlassPanel({
  children,
  className,
  tone = 'light',
  rounded = '3xl',
  as: Tag = 'div',
}: GlassPanelProps) {
  return (
    <Tag className={cn(toneClass[tone], roundedClass[rounded], className)}>
      {children}
    </Tag>
  )
}

interface GlassBadgeProps {
  children: React.ReactNode
  className?: string
  tone?: 'light' | 'dark'
  dot?: boolean
}

export function GlassBadge({ children, className, tone = 'dark', dot = true }: GlassBadgeProps) {
  return (
    <span className={cn(tone === 'dark' ? 'glass-badge-dark' : 'glass-badge-light', className)}>
      {dot && <span className="glass-badge-dot" aria-hidden />}
      {children}
    </span>
  )
}

interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  href?: string
}

export function GlassIconButton({ children, className, href, ...props }: GlassIconButtonProps) {
  const cls = cn('glass-icon-btn', className)
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
