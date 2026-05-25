'use client'

import { useParams } from 'next/navigation'
import { notFound }  from 'next/navigation'
import Link          from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ProductForm     from '@/components/admin/ProductForm'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import type { ProductFormInitialData } from '@/components/admin/ProductForm'

export default function EditProductPage() {
  const params  = useParams<{ slug: string }>()
  const product = MOCK_PRODUCTS.find(p => p.slug === params.slug)

  if (!product) {
    notFound()
    return null
  }

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
