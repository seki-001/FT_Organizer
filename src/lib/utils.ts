import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format KSh price: 1250 → "KSh 1,250"
export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

// Calculate discount percentage
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}

// Slug to readable title
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
