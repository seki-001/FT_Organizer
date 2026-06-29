-- Coupons
CREATE TABLE public.coupons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value       INTEGER NOT NULL,
  min_order   INTEGER NOT NULL DEFAULT 0,
  usage_limit INTEGER,
  uses        INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER coupons_set_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY coupons_admin_all ON public.coupons
  FOR ALL USING (public.is_admin());

-- Blog posts
CREATE TABLE public.blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  excerpt      TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  cover_image  TEXT NOT NULL DEFAULT '',
  category     TEXT NOT NULL,
  author       TEXT NOT NULL DEFAULT 'Faith The Organizer',
  published_at DATE,
  read_time    INTEGER NOT NULL DEFAULT 5,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX blog_posts_published_idx ON public.blog_posts(published, published_at DESC);
CREATE INDEX blog_posts_slug_idx ON public.blog_posts(slug);

CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_posts_public_select ON public.blog_posts
  FOR SELECT USING (published = TRUE);

CREATE POLICY blog_posts_admin_all ON public.blog_posts
  FOR ALL USING (public.is_admin());

-- Payment events (M-Pesa / Flutterwave audit log)
CREATE TABLE public.payment_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT,
  provider        TEXT NOT NULL CHECK (provider IN ('mpesa', 'flutterwave')),
  event_type      TEXT NOT NULL,
  external_id     TEXT,
  amount          INTEGER,
  status          TEXT NOT NULL,
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX payment_events_order_reference_idx ON public.payment_events(order_reference);
CREATE INDEX payment_events_external_id_idx ON public.payment_events(external_id);

CREATE TRIGGER payment_events_set_updated_at
  BEFORE UPDATE ON public.payment_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY payment_events_admin_all ON public.payment_events
  FOR ALL USING (public.is_admin());

-- Rollback: DROP TABLE public.payment_events, public.blog_posts, public.coupons CASCADE;
