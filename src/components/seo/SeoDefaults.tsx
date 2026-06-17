import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { DEFAULT_BRAND_NAME, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_URL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";
import { buildAbsoluteSiteUrl } from "@/lib/routes";
import { routeFeatureMap, hasPackageFeature } from "@/config/packageConfig";
import { DEFAULT_PV_SETTINGS, usePvSettings } from "@/hooks/usePvSettings";

type SeoEntry = {
  title: string;
  description: string;
};

const routeSeo: Record<string, SeoEntry> = {
  "/": {
    title: `${DEFAULT_BRAND_NAME} | Photovoltaik planen & Angebot anfragen`,
    description: DEFAULT_SITE_DESCRIPTION,
  },
  "/pv-rechner": {
    title: "PV-Rechner | Photovoltaik Kosten berechnen",
    description: "Berechnen Sie Photovoltaik-Kosten, Stromersparnis, Speicher und Amortisation als unverbindliche Ersteinschätzung.",
  },
  "/photovoltaik-kosten": {
    title: "Photovoltaik Kosten | PV-Anlage kalkulieren",
    description: "Photovoltaik Kosten verständlich erklärt: Anlage, Speicher, Dach, Montage, Elektroarbeiten und Netzanschluss richtig einordnen.",
  },
  "/stromkosten-sparen": {
    title: "Stromkosten sparen mit Photovoltaik",
    description: "Berechnen Sie, wie stark Eigenverbrauch, Strompreis und Einspeisung Ihre PV-Ersparnis beeinflussen können.",
  },
  "/speicher-rechner": {
    title: "Stromspeicher Rechner | Speichergröße schätzen",
    description: "Schätzen Sie unverbindlich, welche Speichergröße zu Verbrauch, PV-Anlage und Abendverbrauch passen kann.",
  },
  "/foerderung": {
    title: "Photovoltaik Förderung | PV-Förderung prüfen",
    description: "Photovoltaik Förderung für PV-Anlage, Speicher und Wallbox besser einordnen und strukturierte Anfrage starten.",
  },
  "/foerder-check": {
    title: "PV Förder-Check Österreich",
    description: "Unverbindlicher PV Förder-Check für Photovoltaik, Speicher und Wallbox mit strukturierter Beratungsanfrage.",
  },
  "/angebot-anfordern": {
    title: "PV-Angebot anfordern | Photovoltaik Beratung",
    description: "Senden Sie Ihre Eckdaten zu Dach, Verbrauch, Speicher und Wallbox für eine unverbindliche Photovoltaik-Rückmeldung.",
  },
  "/kontakt": {
    title: "Kontakt | Photovoltaik Beratung",
    description: "Kontakt für Photovoltaik, Stromspeicher und Wallbox: Anfrage, Rückruf oder Projektbesprechung starten.",
  },
  "/referenzen": {
    title: "PV Referenzen | Photovoltaik Projekte",
    description: "Beispiele für Photovoltaik-Projekte mit PV-Leistung, Speicheroption, Region und Nutzen übersichtlich dargestellt.",
  },
};

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/";
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/";
}

export function SeoDefaults() {
  const location = useLocation();
  const path = normalizePath(location.pathname);
  const feature = routeFeatureMap[path];
  const { data: runtimeSettings = DEFAULT_PV_SETTINGS } = usePvSettings();
  const fallbackPage = routeSeo[path] ?? routeSeo["/"];
  const page = path === "/"
    ? { title: runtimeSettings.seo_title || fallbackPage.title, description: runtimeSettings.seo_description || fallbackPage.description }
    : fallbackPage;
  const canonicalUrl = buildAbsoluteSiteUrl(path);
  const socialTitle = path === "/" ? (runtimeSettings.seo_og_title || page.title) : page.title;
  const socialDescription = path === "/" ? (runtimeSettings.seo_og_description || page.description) : page.description;
  const socialImage = runtimeSettings.seo_og_image || siteConfig.seo.ogImage;
  const isRestricted = feature ? !hasPackageFeature(feature) : false;
  const isAdmin = path.startsWith("/admin");
  const shouldNoIndex = isRestricted || isAdmin || path === "/danke";

  return (
    <Helmet prioritizeSeoTags>
      <meta property="og:site_name" content={DEFAULT_BRAND_NAME} />
      <meta property="og:locale" content={siteConfig.seo.locale} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      <meta name="twitter:image" content={socialImage} />
      {path === "/" && runtimeSettings.seo_keywords ? <meta name="keywords" content={runtimeSettings.seo_keywords} /> : null}
      <meta name="application-name" content={DEFAULT_BRAND_NAME} />
      <meta name="theme-color" content={siteConfig.seo.themeColor} />
      <link rel="canonical" href={canonicalUrl} />
      {shouldNoIndex && <meta name="robots" content="noindex,follow" />}
      <link rel="sitemap" type="application/xml" href={`${DEFAULT_SITE_URL}/sitemap.xml`} />
    </Helmet>
  );
}
