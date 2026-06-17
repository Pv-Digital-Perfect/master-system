import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig } from "@/config/siteConfig";

export type PvCalculatorSettings = {
  id: string;
  price_per_kwp_min: number;
  price_per_kwp_max: number;
  storage_price_per_kwh_min: number;
  storage_price_per_kwh_max: number;
  wallbox_price_min: number;
  wallbox_price_max: number;
  electricity_price_per_kwh: number;
  feed_in_tariff_per_kwh: number;
  annual_yield_per_kwp: number;
  module_area_per_kwp: number;
  self_consumption_without_storage: number;
  self_consumption_with_storage: number;
  default_storage_ratio: number;
  planning_buffer_percent: number;
  hero_badge: string;
  hero_headline: string;
  hero_subheadline: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  service_area_text: string;
  company_specialization: string;
  response_time_text: string;
  consultation_note: string;
  financing_note: string;
  funding_note: string;
  warranty_note: string;
  appointment_link: string;
  lead_receiver_label: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_title: string;
  seo_og_description: string;
  seo_og_image: string;
  hero_image_desktop_url: string;
  hero_image_mobile_url: string;
  home_card_1_image_url: string;
  home_card_2_image_url: string;
  home_card_3_image_url: string;
  updated_at?: string | null;
};

export type PvNumericSettingKey =
  | "price_per_kwp_min"
  | "price_per_kwp_max"
  | "storage_price_per_kwh_min"
  | "storage_price_per_kwh_max"
  | "wallbox_price_min"
  | "wallbox_price_max"
  | "electricity_price_per_kwh"
  | "feed_in_tariff_per_kwh"
  | "annual_yield_per_kwp"
  | "module_area_per_kwp"
  | "self_consumption_without_storage"
  | "self_consumption_with_storage"
  | "default_storage_ratio"
  | "planning_buffer_percent";

export type PvTextSettingKey =
  | "hero_badge"
  | "hero_headline"
  | "hero_subheadline"
  | "primary_cta_label"
  | "secondary_cta_label"
  | "service_area_text"
  | "company_specialization"
  | "response_time_text"
  | "consultation_note"
  | "financing_note"
  | "funding_note"
  | "warranty_note"
  | "appointment_link"
  | "lead_receiver_label"
  | "seo_title"
  | "seo_description"
  | "seo_keywords"
  | "seo_og_title"
  | "seo_og_description"
  | "seo_og_image"
  | "hero_image_desktop_url"
  | "hero_image_mobile_url"
  | "home_card_1_image_url"
  | "home_card_2_image_url"
  | "home_card_3_image_url";

export const DEFAULT_PV_SETTINGS: PvCalculatorSettings = {
  id: "default",
  price_per_kwp_min: 1100,
  price_per_kwp_max: 1550,
  storage_price_per_kwh_min: 850,
  storage_price_per_kwh_max: 1250,
  wallbox_price_min: 1100,
  wallbox_price_max: 2800,
  electricity_price_per_kwh: 0.27,
  feed_in_tariff_per_kwh: 0.067,
  annual_yield_per_kwp: 980,
  module_area_per_kwp: 6,
  self_consumption_without_storage: 0.34,
  self_consumption_with_storage: 0.64,
  default_storage_ratio: 1.1,
  planning_buffer_percent: 10,
  hero_badge: "Photovoltaik Beratung & Planung",
  hero_headline: "Photovoltaik-Anlage planen. Kosten einschätzen. Angebot anfragen.",
  hero_subheadline:
    "Berechnen Sie in wenigen Schritten eine erste PV-Einschätzung für Ihr Zuhause oder Gewerbe: Kosten, Ersparnis, Speicher, Wallbox und mögliche Förderpunkte — klar, modern und unverbindlich.",
  primary_cta_label: "PV-Kosten berechnen",
  secondary_cta_label: "Kostenlose Anfrage stellen",
  service_area_text: "Österreich",
  company_specialization: "Photovoltaik, Stromspeicher, Wallbox und Förderberatung",
  response_time_text: "Rückmeldung in der Regel innerhalb eines Werktages",
  consultation_note: "Kostenlose Ersteinschätzung auf Basis Ihrer Angaben. Die finale Planung erfolgt nach technischer Prüfung.",
  financing_note: "Finanzierungs- und Zahlungsmodelle können im persönlichen Gespräch geklärt werden.",
  funding_note: "Fördermöglichkeiten werden unverbindlich geprüft. Verfügbarkeit und Bedingungen können sich je nach Region ändern.",
  warranty_note: "Garantie- und Serviceleistungen hängen von Komponenten, Montagepartner und Projektumfang ab.",
  appointment_link: "",
  lead_receiver_label: "PV-Beratung",
  seo_title: "PV-System.Digital-Perfect | Photovoltaik planen & PV-Angebot anfragen",
  seo_description: "Photovoltaik-Kosten, Stromersparnis, Speicher und Fördermöglichkeiten unverbindlich berechnen und eine kostenlose PV-Anfrage stellen.",
  seo_keywords: "Photovoltaik, PV-Anlage, PV-Rechner, Stromspeicher, Wallbox, Solaranlage, PV-Angebot",
  seo_og_title: "Photovoltaik planen & PV-Angebot anfragen",
  seo_og_description: "Kosten, Ersparnis, Speicher und Fördermöglichkeiten unverbindlich einschätzen und eine PV-Anfrage senden.",
  seo_og_image: siteConfig.seo.ogImage,
  hero_image_desktop_url: siteConfig.assets.heroDesktop,
  hero_image_mobile_url: siteConfig.assets.heroMobile,
  home_card_1_image_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
  home_card_2_image_url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80",
  home_card_3_image_url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80",
  updated_at: null,
};

export type PvCalculatorResult = {
  roofPotentialKwp: number;
  recommendedKwp: number;
  annualProduction: number;
  selfUseRate: number;
  storageSize: number;
  pvCostMin: number;
  pvCostMax: number;
  storageCostMin: number;
  storageCostMax: number;
  wallboxCostMin: number;
  wallboxCostMax: number;
  totalCostMin: number;
  totalCostMax: number;
  directSavingsPerYear: number;
  feedInValuePerYear: number;
  estimatedBenefitPerYear: number;
  paybackMinYears: number | null;
  paybackMaxYears: number | null;
};

const SETTINGS_QUERY_KEY = ["pv-settings"];

const normalizeNumber = (value: unknown, fallback: number) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const normalizeText = (value: unknown, fallback: string) => {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const normalizeSettings = (row: Partial<PvCalculatorSettings> | null | undefined): PvCalculatorSettings => ({
  ...DEFAULT_PV_SETTINGS,
  ...(row || {}),
  price_per_kwp_min: normalizeNumber(row?.price_per_kwp_min, DEFAULT_PV_SETTINGS.price_per_kwp_min),
  price_per_kwp_max: normalizeNumber(row?.price_per_kwp_max, DEFAULT_PV_SETTINGS.price_per_kwp_max),
  storage_price_per_kwh_min: normalizeNumber(row?.storage_price_per_kwh_min, DEFAULT_PV_SETTINGS.storage_price_per_kwh_min),
  storage_price_per_kwh_max: normalizeNumber(row?.storage_price_per_kwh_max, DEFAULT_PV_SETTINGS.storage_price_per_kwh_max),
  wallbox_price_min: normalizeNumber(row?.wallbox_price_min, DEFAULT_PV_SETTINGS.wallbox_price_min),
  wallbox_price_max: normalizeNumber(row?.wallbox_price_max, DEFAULT_PV_SETTINGS.wallbox_price_max),
  electricity_price_per_kwh: normalizeNumber(row?.electricity_price_per_kwh, DEFAULT_PV_SETTINGS.electricity_price_per_kwh),
  feed_in_tariff_per_kwh: normalizeNumber(row?.feed_in_tariff_per_kwh, DEFAULT_PV_SETTINGS.feed_in_tariff_per_kwh),
  annual_yield_per_kwp: normalizeNumber(row?.annual_yield_per_kwp, DEFAULT_PV_SETTINGS.annual_yield_per_kwp),
  module_area_per_kwp: normalizeNumber(row?.module_area_per_kwp, DEFAULT_PV_SETTINGS.module_area_per_kwp),
  self_consumption_without_storage: normalizeNumber(row?.self_consumption_without_storage, DEFAULT_PV_SETTINGS.self_consumption_without_storage),
  self_consumption_with_storage: normalizeNumber(row?.self_consumption_with_storage, DEFAULT_PV_SETTINGS.self_consumption_with_storage),
  default_storage_ratio: normalizeNumber(row?.default_storage_ratio, DEFAULT_PV_SETTINGS.default_storage_ratio),
  planning_buffer_percent: normalizeNumber(row?.planning_buffer_percent, DEFAULT_PV_SETTINGS.planning_buffer_percent),
  hero_badge: normalizeText(row?.hero_badge, DEFAULT_PV_SETTINGS.hero_badge),
  hero_headline: normalizeText(row?.hero_headline, DEFAULT_PV_SETTINGS.hero_headline),
  hero_subheadline: normalizeText(row?.hero_subheadline, DEFAULT_PV_SETTINGS.hero_subheadline),
  primary_cta_label: normalizeText(row?.primary_cta_label, DEFAULT_PV_SETTINGS.primary_cta_label),
  secondary_cta_label: normalizeText(row?.secondary_cta_label, DEFAULT_PV_SETTINGS.secondary_cta_label),
  service_area_text: normalizeText(row?.service_area_text, DEFAULT_PV_SETTINGS.service_area_text),
  company_specialization: normalizeText(row?.company_specialization, DEFAULT_PV_SETTINGS.company_specialization),
  response_time_text: normalizeText(row?.response_time_text, DEFAULT_PV_SETTINGS.response_time_text),
  consultation_note: normalizeText(row?.consultation_note, DEFAULT_PV_SETTINGS.consultation_note),
  financing_note: normalizeText(row?.financing_note, DEFAULT_PV_SETTINGS.financing_note),
  funding_note: normalizeText(row?.funding_note, DEFAULT_PV_SETTINGS.funding_note),
  warranty_note: normalizeText(row?.warranty_note, DEFAULT_PV_SETTINGS.warranty_note),
  appointment_link: typeof row?.appointment_link === "string" ? row.appointment_link.trim() : DEFAULT_PV_SETTINGS.appointment_link,
  lead_receiver_label: normalizeText(row?.lead_receiver_label, DEFAULT_PV_SETTINGS.lead_receiver_label),
  seo_title: normalizeText(row?.seo_title, DEFAULT_PV_SETTINGS.seo_title),
  seo_description: normalizeText(row?.seo_description, DEFAULT_PV_SETTINGS.seo_description),
  seo_keywords: normalizeText(row?.seo_keywords, DEFAULT_PV_SETTINGS.seo_keywords),
  seo_og_title: normalizeText(row?.seo_og_title, DEFAULT_PV_SETTINGS.seo_og_title),
  seo_og_description: normalizeText(row?.seo_og_description, DEFAULT_PV_SETTINGS.seo_og_description),
  seo_og_image: normalizeText(row?.seo_og_image, DEFAULT_PV_SETTINGS.seo_og_image),
  hero_image_desktop_url: normalizeText(row?.hero_image_desktop_url, DEFAULT_PV_SETTINGS.hero_image_desktop_url),
  hero_image_mobile_url: normalizeText(row?.hero_image_mobile_url, DEFAULT_PV_SETTINGS.hero_image_mobile_url),
  home_card_1_image_url: normalizeText(row?.home_card_1_image_url, DEFAULT_PV_SETTINGS.home_card_1_image_url),
  home_card_2_image_url: normalizeText(row?.home_card_2_image_url, DEFAULT_PV_SETTINGS.home_card_2_image_url),
  home_card_3_image_url: normalizeText(row?.home_card_3_image_url, DEFAULT_PV_SETTINGS.home_card_3_image_url),
});

export function usePvSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await (supabase.from("pv_settings" as any) as any)
        .select("*")
        .eq("id", "default")
        .maybeSingle();

      if (error) {
        console.warn("PV-Einstellungen konnten nicht geladen werden. Fallback aktiv.", error.message);
        return DEFAULT_PV_SETTINGS;
      }

      return normalizeSettings(data);
    },
    staleTime: 60_000,
  });
}

export function useUpdatePvSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: PvCalculatorSettings) => {
      const payload = {
        ...settings,
        id: "default",
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await (supabase.from("pv_settings" as any) as any)
        .upsert(payload, { onConflict: "id" })
        .select("*")
        .single();

      if (error) throw error;
      return normalizeSettings(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}

export function calculatePvResult(params: {
  annualConsumptionKwh: number;
  roofAreaSqm: number;
  includeStorage: boolean;
  includeWallbox: boolean;
  settings: PvCalculatorSettings;
}): PvCalculatorResult {
  const { annualConsumptionKwh, roofAreaSqm, includeStorage, includeWallbox, settings } = params;
  const safeConsumption = Math.max(0, annualConsumptionKwh || 0);
  const safeRoofArea = Math.max(0, roofAreaSqm || 0);

  const roofPotentialKwp = Math.max(3, roundOne(safeRoofArea / settings.module_area_per_kwp));
  const demandBasedKwp = Math.max(4, roundOne(safeConsumption / settings.annual_yield_per_kwp));
  const recommendedKwp = Math.min(demandBasedKwp, roofPotentialKwp);
  const annualProduction = Math.round(recommendedKwp * settings.annual_yield_per_kwp);
  const selfUseRate = includeStorage ? settings.self_consumption_with_storage : settings.self_consumption_without_storage;
  const storageSize = includeStorage ? Math.max(4, Math.round(recommendedKwp * settings.default_storage_ratio)) : 0;

  const pvCostMinBase = recommendedKwp * settings.price_per_kwp_min;
  const pvCostMaxBase = recommendedKwp * settings.price_per_kwp_max;
  const storageCostMinBase = storageSize * settings.storage_price_per_kwh_min;
  const storageCostMaxBase = storageSize * settings.storage_price_per_kwh_max;
  const wallboxCostMinBase = includeWallbox ? settings.wallbox_price_min : 0;
  const wallboxCostMaxBase = includeWallbox ? settings.wallbox_price_max : 0;
  const bufferFactor = 1 + settings.planning_buffer_percent / 100;

  const pvCostMin = Math.round(pvCostMinBase);
  const pvCostMax = Math.round(pvCostMaxBase * bufferFactor);
  const storageCostMin = Math.round(storageCostMinBase);
  const storageCostMax = Math.round(storageCostMaxBase * bufferFactor);
  const wallboxCostMin = Math.round(wallboxCostMinBase);
  const wallboxCostMax = Math.round(wallboxCostMaxBase * bufferFactor);
  const totalCostMin = pvCostMin + storageCostMin + wallboxCostMin;
  const totalCostMax = pvCostMax + storageCostMax + wallboxCostMax;

  const selfUsedKwh = Math.min(safeConsumption, annualProduction * selfUseRate);
  const feedInKwh = Math.max(0, annualProduction - selfUsedKwh);
  const directSavingsPerYear = Math.round(selfUsedKwh * settings.electricity_price_per_kwh);
  const feedInValuePerYear = Math.round(feedInKwh * settings.feed_in_tariff_per_kwh);
  const estimatedBenefitPerYear = directSavingsPerYear + feedInValuePerYear;

  const paybackMinYears = estimatedBenefitPerYear > 0 ? roundOne(totalCostMin / estimatedBenefitPerYear) : null;
  const paybackMaxYears = estimatedBenefitPerYear > 0 ? roundOne(totalCostMax / estimatedBenefitPerYear) : null;

  return {
    roofPotentialKwp,
    recommendedKwp,
    annualProduction,
    selfUseRate,
    storageSize,
    pvCostMin,
    pvCostMax,
    storageCostMin,
    storageCostMax,
    wallboxCostMin,
    wallboxCostMax,
    totalCostMin,
    totalCostMax,
    directSavingsPerYear,
    feedInValuePerYear,
    estimatedBenefitPerYear,
    paybackMinYears,
    paybackMaxYears,
  };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("de-AT", { maximumFractionDigits: 1 }).format(value);
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}
