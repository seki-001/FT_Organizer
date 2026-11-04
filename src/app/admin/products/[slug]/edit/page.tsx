'use client'

import { useParams } from 'next/navigation'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ProductForm     from '@/components/admin/ProductForm'
import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import type { ProductFormInitialData } from '@/components/admin/ProductForm'

export default function EditProductPage() {
  const params  = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing'>('loading')

  useEffect(() => {
    fetch(`/api/products/${encodeURIComponent(params.slug)}`)
      .then(r => (r.ok ? r.json() : null))
      .then((d: { product?: Product } | null) => {
        if (d?.product) { setProduct(d.product); setState('ready') } else setState('missing')
      })
      .catch(() => setState('missing'))
  }, [params.slug])

  if (state === 'missing') { notFound(); return null }
  if (!product) return <p className="p-6 text-sm text-dark/40">Loading product…</p>

  const initialData: ProductFormInitialData = {
    name:        product.name,
    slug:        product.slug,
    category:    product.category,
    description: product.description,
    price:       product.price,
    salePrice:   product.salePrice,
    stockCount:  product.stockCount,
    featured:    product.featured,
    images:      product.images,
    variants:    product.variants ?? [],
    specs:       product.specs ?? {},
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm text-dark/50 hover:text-dark transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Products
        </Link>
        <span className="text-dark/20">/</span>
        <span className="text-sm text-dark font-medium">{product.name}</span>
      </div>

      <AdminPageHeader
        title={`Edit: ${product.name}`}
        subtitle={`/${product.slug}`}
      />

      <ProductForm
        mode="edit"
        initialData={initialData}
        editSlug={product.slug}
      />
    </div>
  )
}
