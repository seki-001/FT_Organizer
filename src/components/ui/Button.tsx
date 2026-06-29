'use client'

import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'white' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type Radius = 'default' | 'pill'

const variants: Record<Variant, string> = {
  primary:   'bg-primary hover:bg-primary/90 text-white',
  secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  dark:      'bg-dark hover:bg-dark/85 text-white',
  ghost:     'border border-white/15 text-white hover:border-white/30 hover:bg-white/5',
  white:     'bg-white text-dark hover:bg-white/90',
  outline:   'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  danger:    'bg-danger hover:bg-danger/90 text-white',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-4 text-base',
}

const radius: Record<Radius, string> = {
  default: 'rounded-lg',
  pill:    'rounded-full',
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  radius?: Radius
  loading?: boolean
  children: React.ReactNode
  className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    radius: radiusProp = 'default',
    loading = false,
    disabled,
    children,
    className,
    ...props
  },
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
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        radius[radiusProp],
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="w-4 h-4 animate-spin"
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
