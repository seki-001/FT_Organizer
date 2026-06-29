-- Products
CREATE TABLE public.products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  price         INTEGER NOT NULL,
  sale_price    INTEGER,
  category      TEXT NOT NULL,
  images        JSONB NOT NULL DEFAULT '[]'::jsonb,
  in_stock      BOOLEAN NOT NULL DEFAULT TRUE,
  stock_count   INTEGER NOT NULL DEFAULT 0,
  rating        NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count  INTEGER NOT NULL DEFAULT 0,
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  variants      JSONB,
  specs         JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX products_category_idx ON public.products(category);
CREATE INDEX products_featured_idx ON public.products(featured) WHERE featured = TRUE;
CREATE INDEX products_slug_idx ON public.products(slug);

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_public_select ON public.products
  FOR SELECT USING (TRUE);

CREATE POLICY products_admin_insert ON public.products
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY products_admin_update ON public.products
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY products_admin_delete ON public.products
  FOR DELETE USING (public.is_admin());

-- Orders
CREATE TABLE public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference        TEXT NOT NULL UNIQUE,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subtotal         INTEGER NOT NULL,
  delivery_fee     INTEGER NOT NULL DEFAULT 0,
  total            INTEGER NOT NULL,
  delivery_method  TEXT NOT NULL
    CHECK (delivery_method IN ('nairobi-same-day', 'standard-nationwide', 'pickup')),
  payment_method   TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card', 'cod')),
  payment_status   TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status     TEXT NOT NULL DEFAULT 'processing'
    CHECK (order_status IN ('processing', 'packed', 'dispatched', 'delivered', 'cancelled')),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city    TEXT NOT NULL,
  customer_notes   TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX orders_user_id_idx ON public.orders(user_id);
CREATE INDEX orders_reference_idx ON public.orders(reference);
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_owner_select ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY orders_admin_all ON public.orders
  FOR ALL USING (public.is_admin());

-- Order items
CREATE TABLE public.order_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_slug  TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    INTEGER NOT NULL,
  variant       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);

CREATE TRIGGER order_items_set_updated_at
  BEFORE UPDATE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_owner_select ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY order_items_admin_all ON public.order_items
  FOR ALL USING (public.is_admin());

-- Rollback: DROP TABLE public.order_items, public.orders, public.products CASCADE;
