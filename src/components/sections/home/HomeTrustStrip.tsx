import { Award, Globe2, ShieldCheck, Sparkles } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Sparkles, label: 'Professional', detail: 'Trained, calm, premium care' },
  { icon: ShieldCheck, label: 'Trusted', detail: 'Confidential, respectful service' },
  { icon: Award, label: 'Quality', detail: 'Systems that last beyond the visit' },
  { icon: Globe2, label: 'East Africa-wide', detail: 'Based in Nairobi, serving the region' },
] as const

export default function HomeTrustStrip() {
  return (
    <section className="border-y border-dark/8 bg-surface" aria-label="Why clients choose us">
      <div className="section-container py-10 md:py-12">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="flex flex-col items-center text-center lg:items-start lg:text-left gap-2">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-dark/70">
                <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="font-display text-lg font-semibold text-dark">{label}</p>
              <p className="text-sm text-dark/55 leading-relaxed max-w-[200px]">{detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
