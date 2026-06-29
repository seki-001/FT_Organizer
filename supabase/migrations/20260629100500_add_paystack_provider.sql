-- Add Paystack as a payment provider in the audit log
ALTER TABLE public.payment_events DROP CONSTRAINT IF EXISTS payment_events_provider_check;
ALTER TABLE public.payment_events ADD CONSTRAINT payment_events_provider_check
  CHECK (provider IN ('mpesa', 'flutterwave', 'paystack'));

-- Rollback:
-- ALTER TABLE public.payment_events DROP CONSTRAINT payment_events_provider_check;
-- ALTER TABLE public.payment_events ADD CONSTRAINT payment_events_provider_check
--   CHECK (provider IN ('mpesa', 'flutterwave'));
