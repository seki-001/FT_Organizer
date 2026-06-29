import type { Product } from '@/lib/types'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseAdminConfigured } from '@/lib/supabase/env'
import type { TablesInsert } from '@/types/database'
import type { Json } from '@/types/database'
import { productToRow, rowToProduct } from '@/lib/db/mappers'
import { logger } from '@/lib/logger'

export async function listProducts(filters: {
  search?: string
  category?: string
  stock?: string
  sort?: string
}): Promise<Product[]> {
  if (!isSupabaseAdminConfigured()) {
    return filterMockProducts(filters)
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('products').select('*').order('created_at', { ascending: false })

  if (error) {
    logger.error({ event: 'products_list_failed', error_code: error.code })
    return filterMockProducts(filters)
  }

  let products = (data ?? []).map(rowToProduct)
  return applyProductFilters(products, filters)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseAdminConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
  }

  const admin = createAdminClient()
  const { data, error } = await admin.from('products').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null
  return rowToProduct(data)
}

export async function insertProduct(product: Partial<Product> & { slug: string; name: string; price: number; category: string }) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const { data, error } = await admin.from('products').insert(productToRow(product)).select().single()
  if (error) {
    logger.error({ event: 'product_insert_failed', error_code: error.code })
    throw error
  }
  return rowToProduct(data)
}

export async function updateProductBySlug(slug: string, updates: Partial<Product>) {
  if (!isSupabaseAdminConfigured()) return null

  const admin = createAdminClient()
  const patch: Partial<TablesInsert<'products'>> = {}
  if (updates.name !== undefined) patch.name = updates.name
  if (updates.description !== undefined) patch.description = updates.description
  if (updates.price !== undefined) patch.price = updates.price
  if (updates.salePrice !== undefined) patch.sale_price = updates.salePrice
  if (updates.category !== undefined) patch.category = updates.category
  if (updates.images !== undefined) patch.images = updates.images
  if (updates.inStock !== undefined) patch.in_stock = updates.inStock
  if (updates.stockCount !== undefined) patch.stock_count = updates.stockCount
  if (updates.featured !== undefined) patch.featured = updates.featured
  if (updates.variants !== undefined) patch.variants = updates.variants as unknown as Json | null
  if (updates.specs !== undefined) patch.specs = updates.specs as unknown as Json | null

  const { data, error } = await admin.from('products').update(patch).eq('slug', slug).select().single()
  if (error) return null
  return rowToProduct(data)
}

export async function deleteProductBySlug(slug: string) {
  if (!isSupabaseAdminConfigured()) return false
  const admin = createAdminClient()
  const { error } = await admin.from('products').delete().eq('slug', slug)
  return !error
}

function filterMockProducts(filters: {
  search?: string
  category?: string
  stock?: string
  sort?: string
}): Product[] {
  return applyProductFilters([...MOCK_PRODUCTS], filters)
}

function applyProductFilters(products: Product[], filters: {
  search?: string
  category?: string
  stock?: string
  sort?: string
}): Product[] {
  let result = products

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q))
  }
  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category)
  }
  if (filters.stock === 'in-stock') result = result.filter((p) => p.inStock && p.stockCount >= 5)
  if (filters.stock === 'low-stock') result = result.filter((p) => p.inStock && p.stockCount > 0 && p.stockCount < 5)
  if (filters.stock === 'out-of-stock') result = result.filter((p) => !p.inStock || p.stockCount === 0)
  if (filters.sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name))
  if (filters.sort === 'price-low') result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  if (filters.sort === 'stock-low') result.sort((a, b) => a.stockCount - b.stockCount)

  return result
}
