import { siteConfig } from "@/config/siteConfig";
import { ACTIVE_PACKAGE_TIER, getAvailableNavigationLinks, mainNavigationLinks, packageFeatures, packageLabels, type PackageFeatureKey } from "@/config/packageConfig";

const readEnv = (key: string) => {
  const value = import.meta.env[key];
  return typeof value === "string" ? value.trim() : "";
};

export type AdminLink = {
  label: string;
  href: string;
  description?: string;
  type: "internal" | "external";
  feature?: PackageFeatureKey;
};

export const activePackageLabel = packageLabels[ACTIVE_PACKAGE_TIER];
export const activePackageFeatures = packageFeatures[ACTIVE_PACKAGE_TIER];

export const publicPageLinks: AdminLink[] = [
  { label: "Startseite", href: "/", description: "Hero, Leistungen und Haupt-CTA", type: "internal" },
  ...mainNavigationLinks.map((link) => ({ label: link.label, href: link.url, description: "Öffentliche PV-Seite", type: "internal" as const, feature: link.feature })),
  { label: "Anfrageformular", href: "/angebot-anfordern", description: "Hauptformular für neue PV-Anfragen", type: "internal", feature: "offerRequest" },
  { label: "Kontakt", href: "/kontakt", description: "Kontaktformular und Betreiberkontakt", type: "internal", feature: "contact" },
  { label: "Danke-Seite", href: "/danke", description: "Nach erfolgreicher Formularübermittlung", type: "internal" },
  { label: "Impressum", href: "/impressum", description: "Anbieterkennzeichnung", type: "internal" },
  { label: "Datenschutz", href: "/datenschutz", description: "Datenschutzerklärung", type: "internal" },
  { label: "Nutzungsbedingungen", href: "/agb", description: "Allgemeine Nutzungsbedingungen", type: "internal" },
];

export const activePublicPageLinks = publicPageLinks.filter((link) => !link.feature || activePackageFeatures.includes(link.feature));
export const lockedPublicPageLinks = publicPageLinks.filter((link) => link.feature && !activePackageFeatures.includes(link.feature));

export const technicalPublicLinks: AdminLink[] = [
  { label: "Sitemap", href: "/sitemap.xml", description: "Indexierbare Seiten je Paket", type: "internal" },
  { label: "Robots", href: "/robots.txt", description: "Crawler-Regeln", type: "internal" },
];

export const internalAdminLinks: AdminLink[] = [
  { label: "Dashboard", href: "/admin", description: "KPI-Überblick", type: "internal" },
  { label: "PV-Anfragen", href: "/admin/leads", description: "Leads, Status und Notizen", type: "internal" },
  { label: "Analytics", href: "/admin/analytics", description: "Lead-Auswertung und Funnel", type: "internal" },
  { label: "Live-Seiten", href: "/admin/live", description: "Schnellzugriffe und Routencheck", type: "internal" },
  { label: "Checkliste", href: "/admin/checklist", description: "Website-Status und Inhalte", type: "internal" },
  { label: "Einstellungen", href: "/admin/settings", description: "Website-Texte und Rechnerwerte", type: "internal" },
];

export const externalToolLinks: AdminLink[] = [
  { label: "Live-Website", href: siteConfig.siteUrl, description: "Öffentliche Website öffnen", type: "external" },
  { label: "Supabase", href: readEnv("VITE_ADMIN_SUPABASE_URL"), description: "Datenbank und Verwaltung", type: "external" },
  { label: "Resend", href: readEnv("VITE_ADMIN_RESEND_URL"), description: "E-Mail-Versand", type: "external" },
  { label: "Coolify", href: readEnv("VITE_ADMIN_COOLIFY_URL"), description: "Deployment-Verwaltung", type: "external" },
  { label: "Search Console", href: readEnv("VITE_ADMIN_SEARCH_CONSOLE_URL"), description: "SEO-Indexierung", type: "external" },
].filter((link) => Boolean(link.href));

export const availableMainNavigationLinks = getAvailableNavigationLinks();
