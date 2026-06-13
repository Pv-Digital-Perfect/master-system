import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  updated_at?: string | null;
};

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
