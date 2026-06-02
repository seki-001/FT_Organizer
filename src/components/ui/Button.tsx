'use client'

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'premium' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-soft hover:bg-danger focus-visible:ring-primary/40',
  secondary:
    'border-2 border-dark text-dark bg-transparent hover:bg-dark hover:text-white',
  premium:
    'bg-softBlack text-white shadow-soft hover:bg-dark',
  outline:
    'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
  ghost:
    'text-dark/70 hover:text-dark hover:bg-muted',
  danger:
    'bg-danger text-white shadow-soft hover:bg-danger/90',
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs rounded-button min-h-[36px]',
  md: 'px-6 py-3 text-sm rounded-button min-h-[44px]',
  lg: 'px-8 py-4 text-base rounded-button min-h-[48px]',
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: React.ReactNode
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, children, className, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200',
        'cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 shrink-0 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : null}
      {children}
    </motion.button>
  )
})

export default Button
export type { ButtonProps, Variant as ButtonVariant, Size as ButtonSize }
