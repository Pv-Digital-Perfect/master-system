import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DEFAULT_BRAND_NAME } from "@/lib/constants";

export const PUBLIC_SETTINGS_KEYS = [
  "active_theme",
  "site_title",
  "site_settings",
  "footer_config",
  "site_logo_url",
  "site_description",
  "google_analytics_id",
  "google_search_console_verification",
] as const;

function readObjectSetting(value: Json | undefined): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getPublicBrandNameFromSettings(settings?: Record<string, Json>): string {
  const siteSettings = readObjectSetting(settings?.site_settings);
  const footerConfig = readObjectSetting(settings?.footer_config);
  const siteTitle = readString(settings?.site_title);

  const fromSiteSettings = readString(siteSettings.name);
  const fromFooterConfig = readString(footerConfig.title);
  const fromSiteTitle = siteTitle ? siteTitle.split("|")[0].trim() : "";

  return fromSiteSettings || fromFooterConfig || fromSiteTitle || DEFAULT_BRAND_NAME;
}

async function fetchPublicSettings(): Promise<Record<string, Json>> {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", [...PUBLIC_SETTINGS_KEYS]);

  if (error) {
    console.warn("settings table not available yet, using environment defaults", error.message);
    return {};
  }

  const settings: Record<string, Json> = {};
  data?.forEach((row) => {
    settings[row.key] = row.value;
  });

  return settings;
}

async function fetchAdminSettings(): Promise<Record<string, Json>> {
  const { data, error } = await supabase.from("settings").select("key, value");

  if (error) {
    console.warn("settings table not available yet, using environment defaults", error.message);
    return {};
  }

  const settings: Record<string, Json> = {};
  data?.forEach((row) => {
    settings[row.key] = row.value;
  });

  return settings;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "public"],
    queryFn: fetchPublicSettings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ["settings", "admin"],
    queryFn: fetchAdminSettings,
    staleTime: 60 * 1000,
  });
}

export function useSetting<T>(key: string, defaultValue: T): T {
  const { data: settings } = useSettings();
  if (!settings || settings[key] === undefined) return defaultValue;
  return settings[key] as T;
}

const BLOCKED_SERVER_ONLY_KEYS = new Set(["bridge_key", "admin_pin"]);

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Json }) => {
      if (BLOCKED_SERVER_ONLY_KEYS.has(key)) {
        throw new Error("Diese Einstellung darf nicht clientseitig gespeichert werden.");
      }

      const { data, error } = await supabase
        .from("settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
        .select("key")
        .maybeSingle();

      if (error) {
        const status = (error as { status?: number; code?: string }).status;
        const code = (error as { code?: string }).code;

        if (status === 401 || status === 403 || code === "42501") {
          throw new Error("Keine Rechte zum Speichern. Bitte Datenbankrechte prüfen.");
        }

        throw new Error(error.message || "Einstellung konnte nicht gespeichert werden.");
      }

      if (!data?.key) {
        throw new Error("Einstellung wurde nicht bestätigt.");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"], refetchType: "all" });
    },
  });
}

export function useActiveTheme() {
  return useSetting<string>("active_theme", "pv");
}

export function useSiteBrandName() {
  const { data } = useSettings();
  return getPublicBrandNameFromSettings(data);
}
