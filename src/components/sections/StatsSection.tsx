import { homesOrganizedLabel, yearsInBusinessLabel, clientRatingLabel, FOUNDED_YEAR } from '@/lib/site-facts'

export default function StatsSection() {
  return (
    <section className="glass-grid-bg py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark/10">
          {[
            { value: homesOrganizedLabel(), label: 'Homes Organized', desc: 'Across all Nairobi neighbourhoods' },
            { value: yearsInBusinessLabel(), label: 'In Business', desc: `Trusted since ${FOUNDED_YEAR}` },
            { value: clientRatingLabel(), label: 'Average Rating', desc: 'From verified client reviews' },
          ].map((stat, i) => (
            <div key={i} className="px-8 py-10 text-center md:text-left first:pl-0 last:pr-0">
              <p className="head-sans text-5xl text-primary mb-2">{stat.value}</p>
              <p className="text-dark text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-dark/65 text-xs">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
