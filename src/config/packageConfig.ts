export type PackageTier = "starter" | "business" | "premium";

export type PackageFeatureKey =
  | "pvCalculator"
  | "offerRequest"
  | "contact"
  | "photovoltaicCosts"
  | "savingsCalculator"
  | "storageCalculator"
  | "fundingOverview"
  | "fundingCheck"
  | "references";

export type PackageLink = {
  label: string;
  url: string;
  feature: PackageFeatureKey;
};

const PACKAGE_TIERS: PackageTier[] = ["starter", "business", "premium"];

const normalizeTier = (value: unknown): PackageTier => {
  const tier = String(value || "").trim().toLowerCase();
  return PACKAGE_TIERS.includes(tier as PackageTier) ? (tier as PackageTier) : "premium";
};

export const ACTIVE_PACKAGE_TIER: PackageTier = normalizeTier(import.meta.env.VITE_PACKAGE_TIER);

export const packageLabels: Record<PackageTier, string> = {
  starter: "Starter",
  business: "Business",
  premium: "Premium",
};

const baseFeatures: PackageFeatureKey[] = [
  "pvCalculator",
  "offerRequest",
  "contact",
  "photovoltaicCosts",
];

export const packageFeatures: Record<PackageTier, PackageFeatureKey[]> = {
  starter: baseFeatures,
  business: [
    ...baseFeatures,
    "savingsCalculator",
    "storageCalculator",
    "fundingOverview",
    "fundingCheck",
  ],
  premium: [
    ...baseFeatures,
    "savingsCalculator",
    "storageCalculator",
    "fundingOverview",
    "fundingCheck",
    "references",
  ],
};

export const featureLabels: Record<PackageFeatureKey, string> = {
  pvCalculator: "PV-Rechner",
  offerRequest: "Anfrageformular",
  contact: "Kontakt",
  photovoltaicCosts: "Photovoltaik-Kosten",
  savingsCalculator: "Stromkosten-Rechner",
  storageCalculator: "Speicher-Rechner",
  fundingOverview: "Förderinformationen",
  fundingCheck: "Förder-Check",
  references: "Referenzen",
};

export const mainNavigationLinks: PackageLink[] = [
  { label: "PV-Rechner", url: "/pv-rechner", feature: "pvCalculator" },
  { label: "Ersparnis", url: "/stromkosten-sparen", feature: "savingsCalculator" },
  { label: "Speicher", url: "/speicher-rechner", feature: "storageCalculator" },
  { label: "Förder-Check", url: "/foerder-check", feature: "fundingCheck" },
  { label: "Kosten", url: "/photovoltaik-kosten", feature: "photovoltaicCosts" },
  { label: "Referenzen", url: "/referenzen", feature: "references" },
];

export const footerQuickLinks: PackageLink[] = [
  { label: "PV-Rechner", url: "/pv-rechner", feature: "pvCalculator" },
  { label: "Stromkosten sparen", url: "/stromkosten-sparen", feature: "savingsCalculator" },
  { label: "Speicher-Rechner", url: "/speicher-rechner", feature: "storageCalculator" },
  { label: "Förder-Check", url: "/foerder-check", feature: "fundingCheck" },
  { label: "Photovoltaik Kosten", url: "/photovoltaik-kosten", feature: "photovoltaicCosts" },
  { label: "Kostenlose Anfrage", url: "/angebot-anfordern", feature: "offerRequest" },
];

export const routeFeatureMap: Record<string, PackageFeatureKey> = {
  "/pv-rechner": "pvCalculator",
  "/angebot-anfordern": "offerRequest",
  "/kontakt": "contact",
  "/photovoltaik-kosten": "photovoltaicCosts",
  "/stromkosten-sparen": "savingsCalculator",
  "/speicher-rechner": "storageCalculator",
  "/foerderung": "fundingOverview",
  "/foerder-check": "fundingCheck",
  "/referenzen": "references",
};

export const hasPackageFeature = (feature: PackageFeatureKey, tier: PackageTier = ACTIVE_PACKAGE_TIER): boolean => {
  return packageFeatures[tier].includes(feature);
};

export const getAvailableLinks = (links: PackageLink[], tier: PackageTier = ACTIVE_PACKAGE_TIER): PackageLink[] => {
  return links.filter((link) => hasPackageFeature(link.feature, tier));
};

export const getAvailableNavigationLinks = (tier: PackageTier = ACTIVE_PACKAGE_TIER): PackageLink[] => {
  return getAvailableLinks(mainNavigationLinks, tier);
};

export const getAvailableFooterLinks = (tier: PackageTier = ACTIVE_PACKAGE_TIER): PackageLink[] => {
  return getAvailableLinks(footerQuickLinks, tier);
};
