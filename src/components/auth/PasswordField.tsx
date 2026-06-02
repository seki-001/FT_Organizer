'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PasswordFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  placeholder?: string
  autoComplete?: string
  registerProps: {
    name: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onBlur: React.FocusEventHandler<HTMLInputElement>
    ref: React.Ref<HTMLInputElement>
  }
  labelExtra?: React.ReactNode
}

export default function PasswordField({
  id,
  label,
  error,
  hint,
  placeholder,
  autoComplete,
  registerProps,
  labelExtra,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-dark">
          {label}
          <span className="text-primary ml-0.5" aria-hidden="true">
            *
          </span>
        </label>
        {labelExtra}
      </div>
      <div
        className="relative"
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
      >
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn('input-base pr-11', error && 'input-error')}
          {...registerProps}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/40 hover:text-dark tap-target flex items-center justify-center"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-dark/50">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
