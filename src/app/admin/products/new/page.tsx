'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ProductForm     from '@/components/admin/ProductForm'

export default function NewProductPage() {
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
      </div>

      <AdminPageHeader
        title="Add New Product"
        subtitle="Fill in the details below and publish when ready."
      />

      <ProductForm mode="new" />
    </div>
  )
}
