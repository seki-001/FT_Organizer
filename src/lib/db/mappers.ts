import { blogCoverForCategory } from '@/lib/site-image-picker'
import type { AdminBooking } from '@/lib/mock-admin-bookings'
import type { BlogPost, Booking, Order, Product, ProductVariant } from '@/lib/types'
import type { Tables } from '@/types/database'
import type { Json } from '@/types/database'
import { MOCK_PRODUCTS } from '@/lib/mock-products'
import { imagesForProduct } from '@/lib/product-images'

export function rowToBooking(row: Tables<'bookings'>): Booking {
  return {
    id: row.reference,
    service: row.service_slug,
    date: row.preferred_date,
    name: row.name,
    email: row.email,
    phone: row.phone,
    propertyType: row.property_type,
    propertySize: row.property_size,
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  }
}

export function rowToAdminBooking(row: Tables<'bookings'>): AdminBooking {
  return {
    id: row.reference,
    service: row.service_slug,
    date: row.preferred_date,
    name: row.name,
    email: row.email,
    phone: row.phone,
    propertyType: row.property_type,
    propertySize: row.property_size,
    notes: row.notes ?? undefined,
    status: row.status,
    area: row.area ?? '',
    timePreference: row.time_preference ?? 'flexible',
    internalNotes: row.internal_notes ?? undefined,
    quoteAmount: row.quote_amount ?? undefined,
    createdAt: row.created_at,
  }
}

export function rowToProduct(row: Tables<'products'>): Product {
  const images = imagesForProduct(row.slug, row.category)
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    salePrice: row.sale_price ?? undefined,
    category: row.category as Product['category'],
    images,
    inStock: row.in_stock,
    stockCount: row.stock_count,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    featured: row.featured,
    variants: row.variants as unknown as ProductVariant[] | undefined,
    specs: row.specs as unknown as Record<string, string> | undefined,
  }
}

export function productToRow(product: Partial<Product> & { slug: string; name: string; price: number; category: string }) {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description ?? '',
    price: product.price,
    sale_price: product.salePrice ?? null,
    category: product.category,
    images: product.images ?? [],
    in_stock: product.inStock ?? (product.stockCount ?? 0) > 0,
    stock_count: product.stockCount ?? 0,
    rating: product.rating ?? 0,
    review_count: product.reviewCount ?? 0,
    featured: product.featured ?? false,
    variants: (product.variants ?? null) as unknown as Json | null,
    specs: (product.specs ?? null) as unknown as Json | null,
  }
}

export function rowToBlogPost(row: Tables<'blog_posts'>): BlogPost {
  const cover = row.cover_image?.trim()
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: cover || blogCoverForCategory(row.category),
    category: row.category as BlogPost['category'],
    author: row.author,
    publishedAt: row.published_at ?? row.created_at.slice(0, 10),
    readTime: row.read_time,
    tags: row.tags,
  }
}

export async function orderRowToOrder(
  row: Tables<'orders'>,
  items: Tables<'order_items'>[],
  productResolver: (slug: string) => Product | undefined = (slug) =>
    MOCK_PRODUCTS.find((p) => p.slug === slug),
): Promise<Order> {
  return {
    id: row.reference,
    items: items.map((item) => {
      const product = productResolver(item.product_slug) ?? {
        id: item.product_id ?? item.product_slug,
        slug: item.product_slug,
        name: item.product_name,
        description: '',
        price: item.unit_price,
        category: 'baskets',
        images: imagesForProduct(item.product_slug, 'baskets'),
        inStock: true,
        stockCount: 0,
        rating: 0,
        reviewCount: 0,
        featured: false,
      }
      return {
        product,
        quantity: item.quantity,
        variant: item.variant as unknown as ProductVariant | undefined,
      }
    }),
    total: row.total,
    deliveryMethod: row.delivery_method,
    deliveryFee: row.delivery_fee,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    orderStatus: row.order_status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.customer_address,
      city: row.customer_city,
      notes: row.customer_notes ?? undefined,
    },
    createdAt: row.created_at,
  }
}
