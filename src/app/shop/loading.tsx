export default function ShopLoading() {
  return (
    <main className="bg-surface">
      <div className="bg-muted h-48 md:h-64 animate-pulse" />
      <div className="section-container py-10">
        <div className="flex gap-2 mb-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-muted animate-pulse shrink-0" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-surface border border-dark/8 overflow-hidden">
              <div className="aspect-[4/5] bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-11 w-full bg-muted rounded-button animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
