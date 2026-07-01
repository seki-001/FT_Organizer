-- Activity logs for admin audit trail (storefront + admin actions)
CREATE TABLE public.activity_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email   TEXT,
  actor_name    TEXT,
  action        TEXT NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  description   TEXT NOT NULL,
  metadata      JSONB NOT NULL DEFAULT '{}',
  ip_address    TEXT,
  user_agent    TEXT,
  source        TEXT NOT NULL DEFAULT 'storefront'
    CHECK (source IN ('storefront', 'admin', 'system')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX activity_logs_created_at_idx ON public.activity_logs(created_at DESC);
CREATE INDEX activity_logs_user_id_idx ON public.activity_logs(user_id);
CREATE INDEX activity_logs_action_idx ON public.activity_logs(action);
CREATE INDEX activity_logs_source_idx ON public.activity_logs(source);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_logs_admin_select ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY activity_logs_admin_insert ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY activity_logs_admin_update ON public.activity_logs
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY activity_logs_admin_delete ON public.activity_logs
  FOR DELETE USING (public.is_admin());

-- Rollback: DROP TABLE public.activity_logs CASCADE;
