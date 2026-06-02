import Link from 'next/link'
import { cn } from '@/lib/utils'

interface CTASectionProps {
  title: string
  description?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  variant?: 'dark' | 'light' | 'cream'
  className?: string
}

export default function CTASection({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  variant = 'dark',
  className,
}: CTASectionProps) {
  const variants = {
    dark: 'bg-softBlack text-white',
    light: 'bg-card border border-border text-dark',
    cream: 'bg-cream text-dark',
  }

  const descClass =
    variant === 'dark' ? 'text-white/80' : 'text-dark/60'

  return (
    <section className={cn('section-padding', variants[variant], className)}>
      <div className="section-container text-center">
        <h2 className={cn('font-display text-display-sm md:text-display-md font-semibold', variant === 'dark' && 'text-white')}>
          {title}
        </h2>
        {description ? (
          <p className={cn('mt-4 text-lg max-w-2xl mx-auto', descClass)}>{description}</p>
        ) : null}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryHref}
            className={cn(
              'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button px-8 py-4',
              'text-base font-medium min-h-[48px] transition-colors duration-200',
              'bg-primary text-white shadow-soft hover:bg-danger',
            )}
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              className={cn(
                'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-button px-8 py-4',
                'text-base font-medium min-h-[48px] border-2 transition-colors duration-200',
                variant === 'dark'
                  ? 'border-white text-white hover:bg-white hover:text-dark'
                  : 'border-primary text-primary hover:bg-primary hover:text-white',
              )}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
