import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'solid' | 'glass' | 'dark'
type Radius = 'control' | 'card' | 'panel'

const variants: Record<Variant, string> = {
  // Default for content: solid, calm, cheap to paint on any device.
  solid: 'bg-white border border-dark/10 shadow-card-sm',
  // Use sparingly (floating panels, hero overlays) — blurs are expensive.
  glass: 'glass-card',
  dark: 'bg-ink text-white border border-white/10',
}

const radii: Record<Radius, string> = {
  control: 'rounded-xl',
  card: 'rounded-card',
  panel: 'rounded-panel',
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  radius?: Radius
  /** Adds a lift + red-tinted border on hover. */
  interactive?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'solid', radius = 'card', interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        radii[radius],
        interactive && 'transition-shadow duration-200 hover:shadow-card-md hover:border-primary/20',
        className,
      )}
      {...props}
    />
  )
})

export default Card
