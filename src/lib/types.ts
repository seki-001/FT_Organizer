export interface Service {
  slug: string
  title: string
  description: string
  longDescription: string
  icon: string // Lucide icon name
  priceFrom: number // in KSh
  duration: string // e.g. "Half day" | "Full day" | "1–2 days"
  includes: string[]
  steps: { title: string; description: string }[]
  gallery: string[] // image URLs
  testimonials: Testimonial[]
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number // in KSh
  salePrice?: number // in KSh
  category: ProductCategory
  images: string[]
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  featured: boolean
  variants?: ProductVariant[]
  specs?: Record<string, string>
}

export type ProductCategory =
  | 'kitchen-organization'
  | 'closet-and-bedroom'
  | 'office-and-desk'
  | 'storage-solutions'
  | 'bundles'

export interface ProductVariant {
  id: string
  name: string
  value: string
  priceModifier?: number
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  variant?: ProductVariant
}

export interface Testimonial {
  id: string
  name: string
  location: string // e.g. "Westlands, Nairobi"
  rating: number
  text: string
  service?: string
  avatar?: string
}

export interface Booking {
  id: string
  service: string
  date: string
  name: string
  email: string
  phone: string
  propertyType: 'apartment' | 'house' | 'office'
  propertySize: 'small' | 'medium' | 'large'
  notes?: string
  status: 'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  deliveryMethod: 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
  deliveryFee: number
  paymentMethod: 'mpesa' | 'card' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderStatus: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
  customer: Customer
  createdAt: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  notes?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: BlogCategory
  author: string
  publishedAt: string
  readTime: number // in minutes
  tags: string[]
}

export type BlogCategory =
  | 'home-tips'
  | 'office'
  | 'before-and-after'
  | 'product-reviews'
  | 'nairobi-living'
