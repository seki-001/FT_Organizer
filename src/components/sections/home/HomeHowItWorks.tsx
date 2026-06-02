import { CalendarCheck, ClipboardList, Hammer, Sparkles } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'

const STEPS = [
  {
    icon: CalendarCheck,
    title: 'Book a site visit',
    description:
      'Choose your service and request a visit. We confirm timing — mainly Mondays across East Africa.',
  },
  {
    icon: Sparkles,
    title: 'We assess your space',
    description:
      'Faith or the team walks your home or office, listens to your goals, and notes scope and priorities.',
  },
  {
    icon: ClipboardList,
    title: 'You receive a plan & quote',
    description:
      'A clear proposal with timeline and investment — with site visit credit applied when you proceed.',
  },
  {
    icon: Hammer,
    title: 'We organize, set up & follow up',
    description:
      'Hands-on delivery, storage systems, coordination where needed, and guidance to maintain order.',
  },
] as const

export default function HomeHowItWorks() {
  return (
    <section className="section-padding bg-surface">
      <div className="section-container">
        <SectionHeading
          eyebrow="How it works"
          title="A calm path from clutter to order"
          subtitle="Four clear steps — no overwhelm, no guesswork."
          align="center"
        />

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
          <div
            className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px border-t border-dashed border-dark/15"
            aria-hidden="true"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <li key={step.title} className="relative flex flex-col items-center text-center gap-4">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-cream border border-dark/10 text-dark">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                  Step {index + 1}
                </span>
                <h3 className="font-display text-lg font-semibold text-dark">{step.title}</h3>
                <p className="text-sm text-dark/60 leading-relaxed">{step.description}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
