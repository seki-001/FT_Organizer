import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  eyebrow?: string
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'left',
  eyebrow,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'mb-10 md:mb-12',
        centered && 'text-center mx-auto',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'mb-3 text-sm font-medium uppercase tracking-widest text-primary',
            centered && 'mx-auto',
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'font-display text-display-sm md:text-display-md font-semibold text-dark',
          centered && 'max-w-3xl mx-auto',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'mt-4 text-lg text-dark/60 leading-relaxed max-w-2xl',
            centered && 'mx-auto',
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
