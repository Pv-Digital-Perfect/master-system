type SiteConfig = {
  brandName: string;
  shortName: string;
  siteUrl: string;
  siteDescription: string;
  contact: {
    email: string;
    phone: string;
    addressLines: string[];
  };
  legal: {
    operatorName: string;
    operatorLabel: string;
    country: string;
    representedBy: string;
    vatId: string;
    companyRegister: string;
    authority: string;
    professionalBody: string;
    professionalRules: string;
  };
  seo: {
    ogImage: string;
    locale: string;
    themeColor: string;
  };
  assets: {
    heroDesktop: string;
    heroMobile: string;
    assistantImage: string;
    defaultHeroImage: string;
  };
};

const trimEnv = (key: string, fallback = "") => {
  const value = import.meta.env[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
};

const SYSTEM_SITE_URL = "https://pv-system.digital-perfect.com";
const normalizeUrl = (value: string) => {
  const normalized = value.replace(/\/+$/, "");
  try {
    const hostname = new URL(normalized).hostname;
    const oldWrongHost = ["pv", "anlage"].join("-") + ".digital-perfect.com";
    return hostname === oldWrongHost ? SYSTEM_SITE_URL : normalized;
  } catch {
    return normalized;
  }
};

const splitLines = (value: string) =>
  value
    .split("|")
    .map((line) => line.trim())
    .filter(Boolean);

const defaultSiteUrl = normalizeUrl(trimEnv("VITE_SITE_URL", SYSTEM_SITE_URL));
const defaultBrandName = trimEnv("VITE_BRAND_NAME", "PV-System.Digital-Perfect");
const defaultDescription = trimEnv(
  "VITE_SITE_DESCRIPTION",
  "Photovoltaik-Kosten, Stromersparnis, Speicher und Fördermöglichkeiten unverbindlich berechnen und eine kostenlose PV-Anfrage stellen.",
);
const defaultHeroDesktop = trimEnv(
  "VITE_HERO_IMAGE_DESKTOP",
  "https://lcbmavlggundawcomznp.supabase.co/storage/v1/object/public/Startseitenbilder/pv-system-digital-perfect-solar-hightech-desktop.png",
);
const defaultHeroMobile = trimEnv(
  "VITE_HERO_IMAGE_MOBILE",
  "https://lcbmavlggundawcomznp.supabase.co/storage/v1/object/public/Startseitenbilder/pv-system-digital-perfect-solar-hightech-mobile.png",
);

export const siteConfig: SiteConfig = {
  brandName: defaultBrandName,
  shortName: trimEnv("VITE_SITE_SHORT_NAME", "PV-System"),
  siteUrl: defaultSiteUrl,
  siteDescription: defaultDescription,
  contact: {
    email: trimEnv("VITE_CONTACT_EMAIL", "pv@digital-perfect.com"),
    phone: trimEnv("VITE_CONTACT_PHONE", ""),
    addressLines: splitLines(trimEnv("VITE_CONTACT_ADDRESS", "Österreich")),
  },
  legal: {
    operatorName: trimEnv("VITE_LEGAL_OPERATOR_NAME", "Digital-Perfect"),
    operatorLabel: trimEnv("VITE_LEGAL_OPERATOR_LABEL", "Betreiber der Website"),
    country: trimEnv("VITE_LEGAL_COUNTRY", "Österreich"),
    representedBy: trimEnv("VITE_LEGAL_REPRESENTED_BY", ""),
    vatId: trimEnv("VITE_LEGAL_VAT_ID", ""),
    companyRegister: trimEnv("VITE_LEGAL_COMPANY_REGISTER", ""),
    authority: trimEnv("VITE_LEGAL_AUTHORITY", ""),
    professionalBody: trimEnv("VITE_LEGAL_PROFESSIONAL_BODY", ""),
    professionalRules: trimEnv("VITE_LEGAL_PROFESSIONAL_RULES", ""),
  },
  seo: {
    ogImage: trimEnv("VITE_OG_IMAGE", defaultHeroDesktop),
    locale: trimEnv("VITE_SEO_LOCALE", "de_AT"),
    themeColor: trimEnv("VITE_THEME_COLOR", "#0F172A"),
  },
  assets: {
    heroDesktop: defaultHeroDesktop,
    heroMobile: defaultHeroMobile,
    assistantImage: trimEnv("VITE_ASSISTANT_IMAGE", "/brand/default-assistant.png"),
    defaultHeroImage: trimEnv("VITE_DEFAULT_HERO_IMAGE", "/brand/default-hero.webp"),
  },
};

export function buildSiteUrl(path = "/") {
  const rawPath = String(path || "/").trim();
  const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}
