// Blog post grid skeleton — featured card + 5 post cards
export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero skeleton */}
      <div className="bg-dark/80 h-40 w-full mb-0" />

      <div className="py-12">
        {/* Featured post skeleton */}
        <div className="bg-white rounded-2xl overflow-hidden mb-14 flex flex-col md:flex-row shadow-sm">
          <div className="md:w-3/5 aspect-[4/3] md:aspect-auto bg-muted animate-pulse min-h-[220px]" />
          <div className="md:w-2/5 p-8 flex flex-col gap-4 justify-center">
            <div className="bg-muted rounded-full h-5 w-24 animate-pulse" />
            <div className="bg-muted rounded h-6 w-full animate-pulse" />
            <div className="bg-muted rounded h-6 w-4/5 animate-pulse" />
            <div className="bg-muted rounded h-4 w-full animate-pulse" />
            <div className="bg-muted rounded h-4 w-3/4 animate-pulse" />
            <div className="bg-muted rounded h-4 w-32 animate-pulse" />
            <div className="bg-muted rounded-lg h-10 w-36 animate-pulse mt-2" />
          </div>
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-full h-9 w-28 animate-pulse" />
          ))}
        </div>

        {/* Post grid — 5 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
              {/* Cover — aspect-video */}
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-5 flex flex-col gap-3">
                <div className="bg-muted rounded-full h-5 w-24 animate-pulse" />
                <div className="bg-muted rounded h-4 w-full animate-pulse" />
                <div className="bg-muted rounded h-4 w-4/5 animate-pulse" />
                <div className="bg-muted rounded h-3.5 w-3/4 animate-pulse" />
                <div className="bg-muted rounded h-3.5 w-2/3 animate-pulse" />
                <div className="flex items-center gap-3 pt-2 border-t border-dark/5 mt-1">
                  <div className="bg-muted rounded-full w-8 h-8 animate-pulse flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="bg-muted rounded h-3 w-24 animate-pulse" />
                    <div className="bg-muted rounded h-3 w-32 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
