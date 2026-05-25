'use client'

import { useMemo } from 'react'

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good morning',   emoji: '☀️'  }
  if (h < 17) return { text: 'Good afternoon', emoji: '👋'  }
  return           { text: 'Good evening',    emoji: '🌙' }
}

export default function WelcomeBanner({ name }: { name: string }) {
  const { text, emoji } = useMemo(getGreeting, [])
  const firstName = name.split(' ')[0]

  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-dark leading-tight">
        {text}, {firstName} {emoji}
      </h1>
      <p className="text-dark/50 text-sm">
        Here&apos;s what&apos;s happening with your business today.
      </p>
    </div>
  )
}
