import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { DEFAULT_BRAND_NAME, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_URL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";
import { buildAbsoluteSiteUrl } from "@/lib/routes";
import { routeFeatureMap, hasPackageFeature } from "@/config/packageConfig";

const DEFAULT_OG_IMAGE = siteConfig.seo.ogImage;

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
  "/impressum": {
    title: `Impressum | ${DEFAULT_BRAND_NAME}`,
    description: "Impressum, Anbieterkennzeichnung und Kontaktinformationen der Photovoltaik-Website.",
  },
  "/datenschutz": {
    title: `Datenschutzerklärung | ${DEFAULT_BRAND_NAME}`,
    description: "Datenschutzerklärung zur Verarbeitung personenbezogener Daten bei Kontaktanfragen, PV-Anfragen, Cookies und technischer Bereitstellung.",
  },
  "/agb": {
    title: `Nutzungsbedingungen | ${DEFAULT_BRAND_NAME}`,
    description: "Nutzungsbedingungen für die Verwendung der Photovoltaik-Website, Rechner, Informationsseiten und Anfrageformulare.",
  },
  "/danke": {
    title: `Anfrage erhalten | ${DEFAULT_BRAND_NAME}`,
    description: "Ihre PV-Anfrage wurde erfolgreich übermittelt. Wir melden uns zeitnah mit einer persönlichen Rückmeldung.",
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
  const page = routeSeo[path] ?? routeSeo["/"];
  const canonicalUrl = buildAbsoluteSiteUrl(path);
  const isRestricted = feature ? !hasPackageFeature(feature) : false;
  const isAdmin = path.startsWith("/admin");
  const shouldNoIndex = isRestricted || isAdmin || path === "/danke";

  useEffect(() => {
    const canonicalLinks = Array.from(document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]'));
    const primaryCanonical = canonicalLinks[0] ?? document.createElement("link");

    primaryCanonical.setAttribute("rel", "canonical");
    primaryCanonical.setAttribute("href", canonicalUrl);
    primaryCanonical.setAttribute("data-pv-managed", "true");

    if (!primaryCanonical.parentElement) {
      document.head.appendChild(primaryCanonical);
    }

    canonicalLinks.slice(1).forEach((link) => link.remove());
  }, [canonicalUrl]);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="de-AT" />
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      <meta property="og:site_name" content={DEFAULT_BRAND_NAME} />
      <meta property="og:locale" content={siteConfig.seo.locale} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="application-name" content={DEFAULT_BRAND_NAME} />
      <meta name="theme-color" content={siteConfig.seo.themeColor} />
      <link rel="canonical" href={canonicalUrl} data-pv-managed="true" />
      {shouldNoIndex && <meta name="robots" content="noindex,follow" />}
      <link rel="sitemap" type="application/xml" href={`${DEFAULT_SITE_URL}/sitemap.xml`} />
    </Helmet>
  );
}
