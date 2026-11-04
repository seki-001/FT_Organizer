/** Client-safe response shapes for admin overview endpoints. */
export interface AdminOverview {
  pendingBookings: { id: string; service: string; customer: string; date: string; status: string }[]
  processingOrders: { id: string; customer: string; createdAt: string }[]
  lowStock: { slug: string; name: string; stockCount: number }[]
}

