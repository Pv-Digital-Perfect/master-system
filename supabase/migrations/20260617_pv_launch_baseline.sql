-- PV-System Launch Baseline
-- Einmalige, idempotente Basis-Migration für neue Kundenprojekte.
-- Reihenfolge bei Neukunden: Diese SQL ausführen, danach Edge Function deployen und Supabase Secrets setzen.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.pv_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text,
  email text,
  phone text,
  postal_code text,
  city text,
  ownership_status text,
  property_type text,
  roof_type text,
  roof_area_sqm numeric,
  roof_orientation text,
  roof_age text,
  meter_cabinet_status text,
  annual_consumption_kwh numeric,
  monthly_electricity_cost numeric,
  storage_interest text,
  wallbox_interest text,
  timeline text,
  budget_range text,
  message text,
  source text,
  lead_status text NOT NULL DEFAULT 'new',
  internal_notes text,
  privacy_policy_accepted boolean NOT NULL DEFAULT false,
  privacy_consent_at timestamptz,
  privacy_consent_version text,
  email_notification_sent_at timestamptz,
  email_notification_error text,
  customer_confirmation_sent_at timestamptz,
  customer_confirmation_error text,
  last_email_attempt_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.pv_settings (
  id text PRIMARY KEY DEFAULT 'default',
  price_per_kwp_min numeric NOT NULL DEFAULT 1100,
  price_per_kwp_max numeric NOT NULL DEFAULT 1550,
  storage_price_per_kwh_min numeric NOT NULL DEFAULT 850,
  storage_price_per_kwh_max numeric NOT NULL DEFAULT 1250,
  wallbox_price_min numeric NOT NULL DEFAULT 1100,
  wallbox_price_max numeric NOT NULL DEFAULT 2800,
  electricity_price_per_kwh numeric NOT NULL DEFAULT 0.27,
  feed_in_tariff_per_kwh numeric NOT NULL DEFAULT 0.067,
  annual_yield_per_kwp numeric NOT NULL DEFAULT 980,
  module_area_per_kwp numeric NOT NULL DEFAULT 6,
  self_consumption_without_storage numeric NOT NULL DEFAULT 0.34,
  self_consumption_with_storage numeric NOT NULL DEFAULT 0.64,
  default_storage_ratio numeric NOT NULL DEFAULT 1.1,
  planning_buffer_percent numeric NOT NULL DEFAULT 10,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.pv_settings (id) VALUES ('default')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.settings (key, value) VALUES
  ('active_theme', '"pv"'::jsonb),
  ('site_title', '"PV-System"'::jsonb),
  ('site_settings', '{"name":"PV-System"}'::jsonb),
  ('footer_config', '{"title":"PV-System"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS touch_pv_leads_updated_at ON public.pv_leads;
CREATE TRIGGER touch_pv_leads_updated_at
BEFORE UPDATE ON public.pv_leads
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_pv_settings_updated_at ON public.pv_settings;
CREATE TRIGGER touch_pv_settings_updated_at
BEFORE UPDATE ON public.pv_settings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX IF NOT EXISTS idx_pv_leads_created_at ON public.pv_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_leads_status ON public.pv_leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_pv_leads_source ON public.pv_leads(source);
CREATE INDEX IF NOT EXISTS idx_pv_leads_city ON public.pv_leads(city);
CREATE INDEX IF NOT EXISTS idx_pv_leads_privacy_consent ON public.pv_leads(privacy_policy_accepted, privacy_consent_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_leads_email_notification_sent_at ON public.pv_leads(email_notification_sent_at);
CREATE INDEX IF NOT EXISTS idx_pv_leads_last_email_attempt_at ON public.pv_leads(last_email_attempt_at);

ALTER TABLE public.pv_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pv_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create pv leads" ON public.pv_leads;
CREATE POLICY "Public can create pv leads"
  ON public.pv_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    COALESCE(trim(full_name), '') <> ''
    AND COALESCE(trim(email), '') <> ''
    AND privacy_policy_accepted IS TRUE
    AND privacy_consent_at IS NOT NULL
  );

DROP POLICY IF EXISTS "Authenticated can read pv leads" ON public.pv_leads;
CREATE POLICY "Authenticated can read pv leads"
  ON public.pv_leads
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update pv leads" ON public.pv_leads;
CREATE POLICY "Authenticated can update pv leads"
  ON public.pv_leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete pv leads" ON public.pv_leads;
CREATE POLICY "Authenticated can delete pv leads"
  ON public.pv_leads
  FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read pv settings" ON public.pv_settings;
CREATE POLICY "Public can read pv settings"
  ON public.pv_settings
  FOR SELECT
  TO anon, authenticated
  USING (id = 'default');

DROP POLICY IF EXISTS "Authenticated can manage pv settings" ON public.pv_settings;
CREATE POLICY "Authenticated can manage pv settings"
  ON public.pv_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read safe settings" ON public.settings;
CREATE POLICY "Public can read safe settings"
  ON public.settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN ('active_theme', 'site_title', 'site_settings', 'footer_config', 'site_logo_url', 'site_description', 'google_analytics_id', 'google_search_console_verification'));

DROP POLICY IF EXISTS "Authenticated can manage settings" ON public.settings;
CREATE POLICY "Authenticated can manage settings"
  ON public.settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (key NOT IN ('bridge_key', 'admin_pin'));
