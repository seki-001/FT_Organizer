'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

type TabId = 'description' | 'specs'

interface ProductDetailsTabsProps {
  product: Product
}

export default function ProductDetailsTabs({ product }: ProductDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const tabs: { id: TabId; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
  ]

  return (
    <div className="mt-12 md:mt-16">
      <div className="flex border-b border-dark/10 mb-6" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab.id
                ? 'border-primary text-dark'
                : 'border-transparent text-dark/40 hover:text-dark',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'description' && (
        <p className="text-dark/70 leading-relaxed max-w-2xl">{product.description}</p>
      )}

      {activeTab === 'specs' &&
        (product.specs && Object.keys(product.specs).length > 0 ? (
          <table className="w-full max-w-lg text-sm border-collapse card-surface border border-dark/8 overflow-hidden">
            <tbody>
              {Object.entries(product.specs).map(([key, val]) => (
                <tr key={key} className="border-b border-dark/8 last:border-b-0">
                  <td className="py-3 px-4 text-dark/50 font-medium w-2/5 bg-muted/50">{key}</td>
                  <td className="py-3 px-4 text-dark">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-dark/40 text-sm">No specifications listed for this product.</p>
        ))}
    </div>
  )
}
