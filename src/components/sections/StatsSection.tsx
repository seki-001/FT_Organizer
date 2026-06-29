export default function StatsSection() {
  return (
    <section className="bg-white border-t border-dark/8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark/10">
          {[
            { value: '500+', label: 'Homes Organized', desc: 'Across all Nairobi neighbourhoods' },
            { value: '7 yrs', label: 'In Business', desc: 'Trusted since 2018' },
            { value: '4.9★', label: 'Average Rating', desc: 'From verified client reviews' },
          ].map((stat, i) => (
            <div key={i} className="px-8 py-10 text-center md:text-left first:pl-0 last:pr-0">
              <p className="head-sans text-5xl text-primary mb-2">{stat.value}</p>
              <p className="text-dark text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-dark/40 text-xs">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
