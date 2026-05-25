'use client'

import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error:  Error & { digest?: string }
  reset:  () => void
}) {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <AlertTriangle size={36} className="text-primary" aria-hidden="true" />
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold text-dark">
            Something went wrong
          </h1>
          <p className="text-dark/55 text-base leading-relaxed">
            An unexpected error occurred. Don&apos;t worry — your data is safe.
            Try refreshing the page, or go back home.
          </p>
          {error.digest && (
            <p className="text-dark/30 text-xs font-mono mt-1">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <button
            type="button"
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <RotateCcw size={17} aria-hidden="true" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border-2 border-dark/20 hover:border-primary text-dark hover:text-primary font-semibold px-7 py-3 rounded-lg transition-colors duration-200 min-h-[48px]"
          >
            <Home size={17} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
