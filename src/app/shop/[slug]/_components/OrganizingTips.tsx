import { Lightbulb } from 'lucide-react'
import { ORGANIZING_TIPS } from '@/lib/shop-utils'
import type { ProductCategory } from '@/lib/types'

interface OrganizingTipsProps {
  category: ProductCategory
}

export default function OrganizingTips({ category }: OrganizingTipsProps) {
  const tips = ORGANIZING_TIPS[category]
  if (!tips?.length) return null

  return (
    <section className="mt-12 card-surface border border-dark/8 p-6 md:p-8" aria-labelledby="organizing-tips">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <Lightbulb size={20} className="text-dark/70" aria-hidden="true" />
        </div>
        <div>
          <h2 id="organizing-tips" className="font-display text-xl text-dark">
            Faith&apos;s organizing tips
          </h2>
          <p className="text-sm text-dark/55 mt-1">How to get the most from this category</p>
        </div>
      </div>
      <ul className="grid sm:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <li
            key={tip.title}
            className="rounded-xl bg-surface border border-dark/8 p-4 text-sm leading-relaxed"
          >
            <p className="font-medium text-dark mb-1">{tip.title}</p>
            <p className="text-dark/60">{tip.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
