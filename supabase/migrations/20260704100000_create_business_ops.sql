-- Back-office tables: POS sales, expenses, purchases, business customers.
-- Replaces the browser localStorage persistence used before production.
-- Access is service-role only (API routes check admin session); RLS blocks direct client access.

CREATE TABLE public.business_customers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  phone          TEXT NOT NULL DEFAULT '',
  email          TEXT,
  address        TEXT,
  credit_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_purchases NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_purchase_at TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.sales (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no     TEXT NOT NULL UNIQUE,
  items          JSONB NOT NULL DEFAULT '[]',
  subtotal       NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  discount       NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total          NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'card', 'credit')),
  customer_id    UUID REFERENCES public.business_customers(id) ON DELETE SET NULL,
  customer_name  TEXT,
  cashier_name   TEXT NOT NULL DEFAULT 'Admin',
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.expenses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description    TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN (
    'rent','utilities','salaries','stock-purchase','transport',
    'marketing','packaging','equipment','other')),
  amount         NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'card', 'credit')),
  expense_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  attachment_url TEXT,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.purchases (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name  TEXT NOT NULL,
  items          JSONB NOT NULL DEFAULT '[]',
  subtotal       NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
  total          NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'card', 'credit')),
  purchase_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  invoice_no     TEXT,
  note           TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX sales_created_at_idx ON public.sales(created_at DESC);
CREATE INDEX expenses_date_idx ON public.expenses(expense_date DESC);
CREATE INDEX purchases_date_idx ON public.purchases(purchase_date DESC);
CREATE INDEX business_customers_name_idx ON public.business_customers(name);

CREATE TRIGGER business_customers_updated_at
  BEFORE UPDATE ON public.business_customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY business_customers_admin_all ON public.business_customers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY sales_admin_all ON public.sales
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY expenses_admin_all ON public.expenses
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY purchases_admin_all ON public.purchases
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Rollback: DROP TABLE public.sales, public.expenses, public.purchases, public.business_customers CASCADE;
