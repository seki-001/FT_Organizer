// Product grid skeleton — 12 cards matching ProductCard proportions
export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero skeleton */}
      <div className="bg-muted rounded-2xl h-28 w-full animate-pulse mb-8" />

      {/* Category tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-full h-9 w-24 animate-pulse" />
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-muted rounded h-4 w-28 animate-pulse" />
        <div className="bg-muted rounded-lg h-9 w-36 animate-pulse" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-dark/5 shadow-sm">
            {/* Image area — aspect-square */}
            <div className="aspect-square bg-muted animate-pulse" />
            {/* Content */}
            <div className="p-4 flex flex-col gap-3">
              <div className="bg-muted rounded h-3.5 w-3/4 animate-pulse" />
              <div className="bg-muted rounded h-3 w-1/2 animate-pulse" />
              <div className="bg-muted rounded h-4 w-1/3 animate-pulse" />
              <div className="bg-muted rounded-lg h-9 w-full animate-pulse mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
