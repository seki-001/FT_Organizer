'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn('input-base min-h-[44px]', hasError && 'input-error', className)}
      {...props}
    />
  )
})

export default Input
