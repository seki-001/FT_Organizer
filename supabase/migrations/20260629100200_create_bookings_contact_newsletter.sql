-- Bookings
CREATE TABLE public.bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference        TEXT NOT NULL UNIQUE,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_slug     TEXT NOT NULL,
  preferred_date   DATE NOT NULL,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  property_type    TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'office')),
  property_size    TEXT NOT NULL CHECK (property_size IN ('small', 'medium', 'large')),
  notes            TEXT,
  status           TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'quoted', 'confirmed', 'completed', 'cancelled')),
  area             TEXT,
  time_preference  TEXT CHECK (time_preference IN ('morning', 'afternoon', 'flexible')),
  internal_notes   TEXT,
  quote_amount     INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX bookings_status_idx ON public.bookings(status);
CREATE INDEX bookings_service_slug_idx ON public.bookings(service_slug);
CREATE INDEX bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX bookings_created_at_idx ON public.bookings(created_at DESC);

CREATE TRIGGER bookings_set_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookings_owner_select ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY bookings_admin_all ON public.bookings
  FOR ALL USING (public.is_admin());

-- Contact submissions
CREATE TABLE public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions(created_at DESC);

CREATE TRIGGER contact_submissions_set_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_submissions_admin_all ON public.contact_submissions
  FOR ALL USING (public.is_admin());

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER newsletter_subscribers_set_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY newsletter_subscribers_admin_select ON public.newsletter_subscribers
  FOR SELECT USING (public.is_admin());

-- Rollback: DROP TABLE public.newsletter_subscribers, public.contact_submissions, public.bookings CASCADE;
