import { PackageX } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ShopEmptyStateProps {
  onClearFilters: () => void
}

export default function ShopEmptyState({ onClearFilters }: ShopEmptyStateProps) {
  return (
    <div className="card-surface border border-dark/8 flex flex-col items-center gap-4 py-16 px-6 text-center">
      <PackageX size={48} className="text-dark/20" aria-hidden="true" />
      <div>
        <p className="font-display text-xl text-dark">No products match</p>
        <p className="text-dark/50 text-sm mt-2 max-w-sm">
          Try another category or adjust your price range and availability filters.
        </p>
      </div>
      <Button type="button" variant="secondary" size="md" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  )
}
