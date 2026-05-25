// Services grid skeleton — hero + 11 service cards matching ServiceDetailCard proportions
export default function ServicesLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="bg-dark/80 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
          <div className="bg-white/10 rounded-full h-4 w-20 animate-pulse" />
          <div className="bg-white/15 rounded h-10 w-80 animate-pulse" />
          <div className="bg-white/10 rounded h-5 w-96 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-dark/5 shadow-sm flex flex-col">
              {/* Colored top band */}
              <div className="bg-muted h-20 flex items-center justify-center animate-pulse">
                <div className="w-10 h-10 rounded-full bg-dark/10 animate-pulse" />
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Title + badge row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="bg-muted rounded h-5 w-40 animate-pulse" />
                  <div className="bg-muted rounded-full h-6 w-20 animate-pulse flex-shrink-0" />
                </div>
                {/* Description lines */}
                <div className="bg-muted rounded h-3.5 w-full animate-pulse" />
                <div className="bg-muted rounded h-3.5 w-5/6 animate-pulse" />
                {/* Bullet points */}
                <div className="flex flex-col gap-2 mt-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="bg-muted rounded-full w-4 h-4 animate-pulse flex-shrink-0" />
                      <div className="bg-muted rounded h-3 animate-pulse" style={{ width: `${60 + j * 8}%` }} />
                    </div>
                  ))}
                </div>
                {/* CTA button */}
                <div className="bg-muted rounded-lg h-10 w-full animate-pulse mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
