import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { ShieldCheck, Zap, CalendarCheck, Home } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";
import { openCookieSettings } from "@/lib/cookie-consent";
import { getAvailableFooterLinks, hasPackageFeature } from "@/config/packageConfig";

const legalLinks = [
  { label: "Impressum", url: "/impressum" },
  { label: "Datenschutz", url: "/datenschutz" },
  { label: "AGB", url: "/agb" },
  { label: "Kontakt", url: "/kontakt" },
];

export const Footer = () => {
  const quickLinks = getAvailableFooterLinks();
  const hasStorageCalculator = hasPackageFeature("storageCalculator");
  const hasFundingCheck = hasPackageFeature("fundingCheck");
  const footerDescription = hasStorageCalculator || hasFundingCheck
    ? "Photovoltaik, Stromspeicher und Wallbox verständlich planen: mit Rechnern, Förder-Check und persönlicher Rückmeldung für Ihr Projekt."
    : "Photovoltaik verständlich planen: mit PV-Rechner, Kostenorientierung und persönlicher Rückmeldung für Ihr Projekt.";
  const planningBenefit = hasStorageCalculator
    ? "Dach, Verbrauch, Speicher und Wallbox strukturiert prüfen."
    : "Dach, Verbrauch und Objekt strukturiert prüfen.";

  const handleOpenCookieSettings = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    openCookieSettings();
  };

  return (
    <footer className="border-t border-[#808080]/20 bg-[#0F172A] text-white">
      <div className="container mx-auto px-4 py-12 pb-32 md:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E] text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight">{DEFAULT_BRAND_NAME}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              {footerDescription}
            </p>
            <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="mt-4 block text-sm font-bold text-orange-200 hover:text-white">
              {DEFAULT_CONTACT_EMAIL}
            </a>
            {siteConfig.contact.phone ? (
              <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="mt-2 block text-sm font-bold text-orange-200 hover:text-white">
                {siteConfig.contact.phone}
              </a>
            ) : null}
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-orange-200">Photovoltaik</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              {quickLinks.map((link) => (
                <li key={link.url}><Link to={link.url} className="hover:text-white">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-orange-200">Rechtliches</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              {legalLinks.map((link) => (
                <li key={link.url}><Link to={link.url} className="hover:text-white">{link.label}</Link></li>
              ))}
              <li>
                <button onClick={handleOpenCookieSettings} className="text-left hover:text-white">Cookie-Einstellungen</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-orange-200">Ihre Vorteile</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-green-300" /> Unverbindliche Ersteinschätzung für Ihr PV-Projekt.</div>
              <div className="flex gap-3"><Home className="mt-0.5 h-4 w-4 text-green-300" /> {planningBenefit}</div>
              <div className="flex gap-3"><CalendarCheck className="mt-0.5 h-4 w-4 text-green-300" /> Persönliche Rückmeldung für Beratung und Angebot.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400 md:text-left">
          © {new Date().getFullYear()} {DEFAULT_BRAND_NAME}. Alle Rechte vorbehalten. Berechnungen dienen der Orientierung und ersetzen keine individuelle technische Prüfung vor Ort.
        </div>
      </div>
    </footer>
  );
};
