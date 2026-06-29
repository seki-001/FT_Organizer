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

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl md:text-[1.75rem] font-semibold text-dark leading-tight tracking-tight">
        {text}, {firstName} {emoji}
      </h1>
      <p className="text-dark/45 text-sm">
        {today} — here&apos;s what&apos;s happening with your business.
      </p>
    </div>
  )
}
