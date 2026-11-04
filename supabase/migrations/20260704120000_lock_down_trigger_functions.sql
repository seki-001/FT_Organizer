-- Trigger/event-trigger functions must not be callable through the REST API.
-- Triggers fire regardless of EXECUTE privilege. is_admin() stays executable (used by RLS policies).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_role_escalation() from public, anon, authenticated;
do $$ begin
  if exists (select 1 from pg_proc where proname = 'rls_auto_enable' and pronamespace = 'public'::regnamespace) then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end $$;
alter function public.set_updated_at() set search_path = public;
