-- Security hardening
-- 1) Block privilege escalation to admin  2) Durable rate limiting shared across serverless instances

-- 1a) New users are ALWAYS customers. Previously the role came from user-controlled signup metadata,
--     which let anyone register as an admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1b) Only an existing admin (or the service role / SQL editor, where auth.uid() IS NULL) may set a non-customer role.
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin() THEN
    IF TG_OP = 'INSERT' AND NEW.role IS DISTINCT FROM 'customer' THEN
      RAISE EXCEPTION 'Not allowed to set role';
    ELSIF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Not allowed to change role';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS profiles_prevent_role_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_role_escalation
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Demote any admin that is not explicitly intended: review with
--   select p.id, u.email, p.role from public.profiles p join auth.users u on u.id = p.id where p.role = 'admin';

-- 2) Fixed-window rate limiter (service role only)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  key        TEXT PRIMARY KEY,
  count      INTEGER NOT NULL,
  reset_at   TIMESTAMPTZ NOT NULL
);
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;  -- no policies: inaccessible to anon/authenticated

CREATE OR REPLACE FUNCTION public.rate_limit_hit(p_key TEXT, p_limit INTEGER, p_window_seconds INTEGER)
RETURNS TABLE (allowed BOOLEAN, remaining INTEGER, reset_at TIMESTAMPTZ) AS $$
DECLARE
  v_row public.rate_limits%ROWTYPE;
BEGIN
  INSERT INTO public.rate_limits AS r (key, count, reset_at)
  VALUES (p_key, 1, NOW() + make_interval(secs => p_window_seconds))
  ON CONFLICT (key) DO UPDATE
    SET count    = CASE WHEN r.reset_at <= NOW() THEN 1 ELSE r.count + 1 END,
        reset_at = CASE WHEN r.reset_at <= NOW() THEN NOW() + make_interval(secs => p_window_seconds) ELSE r.reset_at END
  RETURNING * INTO v_row;

  -- Opportunistic cleanup keeps the table tiny
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limits WHERE rate_limits.reset_at < NOW() - INTERVAL '1 hour';
  END IF;

  RETURN QUERY SELECT v_row.count <= p_limit, GREATEST(p_limit - v_row.count, 0), v_row.reset_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

REVOKE ALL ON FUNCTION public.rate_limit_hit(TEXT, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rate_limit_hit(TEXT, INTEGER, INTEGER) TO service_role;

-- Rollback: DROP FUNCTION public.rate_limit_hit; DROP TABLE public.rate_limits; DROP TRIGGER profiles_prevent_role_escalation ON public.profiles;
