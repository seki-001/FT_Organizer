import { Globe2, Shield, Sparkles } from 'lucide-react'

const TRUST_ITEMS = [
  {
    icon: Sparkles,
    heading: 'Professional standards',
    body: 'Calm, confidential service with systems designed to last beyond the visit.',
  },
  {
    icon: Shield,
    heading: 'Trusted process',
    body: 'Site visit first, clear quote, and handover guidance — no surprises.',
  },
  {
    icon: Globe2,
    heading: 'East Africa-wide',
    body: 'Based in Nairobi; projects and relocations coordinated across the region.',
  },
] as const

export default function ServicesTrust() {
  return (
    <section className="section-padding bg-white border-b border-dark/6">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {TRUST_ITEMS.map(({ icon: Icon, heading, body }) => (
            <div key={heading} className="flex flex-col items-center text-center md:items-start md:text-left gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-dark/70">
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-semibold text-dark">{heading}</h2>
              <p className="text-sm text-dark/60 leading-relaxed max-w-sm">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
