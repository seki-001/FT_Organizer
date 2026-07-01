export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          address: string | null
          city: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          reference: string
          user_id: string | null
          service_slug: string
          preferred_date: string
          name: string
          email: string
          phone: string
          property_type: 'apartment' | 'house' | 'office'
          property_size: 'small' | 'medium' | 'large'
          notes: string | null
          status: 'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
          area: string | null
          time_preference: 'morning' | 'afternoon' | 'flexible' | null
          internal_notes: string | null
          quote_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference: string
          user_id?: string | null
          service_slug: string
          preferred_date: string
          name: string
          email: string
          phone: string
          property_type: 'apartment' | 'house' | 'office'
          property_size: 'small' | 'medium' | 'large'
          notes?: string | null
          status?: 'new' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'
          area?: string | null
          time_preference?: 'morning' | 'afternoon' | 'flexible' | null
          internal_notes?: string | null
          quote_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          subject: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          subject: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['contact_submissions']['Insert']>
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          price: number
          sale_price: number | null
          category: string
          images: Json
          in_stock: boolean
          stock_count: number
          rating: number
          review_count: number
          featured: boolean
          variants: Json | null
          specs: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          price: number
          sale_price?: number | null
          category: string
          images?: Json
          in_stock?: boolean
          stock_count?: number
          rating?: number
          review_count?: number
          featured?: boolean
          variants?: Json | null
          specs?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          reference: string
          user_id: string | null
          subtotal: number
          delivery_fee: number
          total: number
          delivery_method: 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
          payment_method: 'mpesa' | 'card' | 'cod'
          payment_status: 'pending' | 'paid' | 'failed'
          order_status: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          customer_city: string
          customer_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference: string
          user_id?: string | null
          subtotal: number
          delivery_fee?: number
          total: number
          delivery_method: 'nairobi-same-day' | 'standard-nationwide' | 'pickup'
          payment_method: 'mpesa' | 'card' | 'cod'
          payment_status?: 'pending' | 'paid' | 'failed'
          order_status?: 'processing' | 'packed' | 'dispatched' | 'delivered' | 'cancelled'
          customer_name: string
          customer_email: string
          customer_phone: string
          customer_address: string
          customer_city: string
          customer_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_slug: string
          product_name: string
          quantity: number
          unit_price: number
          variant: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_slug: string
          product_name: string
          quantity: number
          unit_price: number
          variant?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
        Relationships: []
      }
      coupons: {
        Row: {
          id: string
          code: string
          type: 'percentage' | 'fixed'
          value: number
          min_order: number
          usage_limit: number | null
          uses: number
          active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          type: 'percentage' | 'fixed'
          value: number
          min_order?: number
          usage_limit?: number | null
          uses?: number
          active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['coupons']['Insert']>
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string
          cover_image: string
          category: string
          author: string
          published_at: string | null
          read_time: number
          tags: string[]
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string
          content?: string
          cover_image?: string
          category: string
          author?: string
          published_at?: string | null
          read_time?: number
          tags?: string[]
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
        Relationships: []
      }
      payment_events: {
        Row: {
          id: string
          order_reference: string | null
          provider: 'mpesa' | 'flutterwave' | 'paystack'
          event_type: string
          external_id: string | null
          amount: number | null
          status: string
          payload: Json
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_reference?: string | null
          provider: 'mpesa' | 'flutterwave' | 'paystack'
          event_type: string
          external_id?: string | null
          amount?: number | null
          status: string
          payload?: Json
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['payment_events']['Insert']>
        Relationships: []
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          actor_email: string | null
          actor_name: string | null
          action: string
          resource_type: string | null
          resource_id: string | null
          description: string
          metadata: Json
          ip_address: string | null
          user_agent: string | null
          source: 'storefront' | 'admin' | 'system'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          actor_email?: string | null
          actor_name?: string | null
          action: string
          resource_type?: string | null
          resource_id?: string | null
          description: string
          metadata?: Json
          ip_address?: string | null
          user_agent?: string | null
          source?: 'storefront' | 'admin' | 'system'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['activity_logs']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
