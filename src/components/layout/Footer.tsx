import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import { ShieldCheck, Zap, CalendarCheck, Database } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL } from "@/lib/constants";

const quickLinks = [
  { label: "PV-Rechner", url: "/pv-rechner" },
  { label: "Stromkosten sparen", url: "/stromkosten-sparen" },
  { label: "Speicher-Rechner", url: "/speicher-rechner" },
  { label: "Förder-Check", url: "/foerder-check" },
  { label: "Photovoltaik Kosten", url: "/photovoltaik-kosten" },
  { label: "Angebot anfordern", url: "/angebot-anfordern" },
];

const legalLinks = [
  { label: "Impressum", url: "/impressum" },
  { label: "Datenschutz", url: "/datenschutz" },
  { label: "AGB", url: "/agb" },
  { label: "Kontakt", url: "/kontakt" },
];

export const Footer = () => {
  const openCookieSettings = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.dispatchEvent(new Event("showCookieSettings"));
  };

  return (
    <footer className="border-t border-[#808080]/20 bg-[#0F172A] text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E] text-white">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight">{DEFAULT_BRAND_NAME}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              White-Label-System für Photovoltaik-Anbieter: verkaufsstarke Website, PV-Rechner, Leadformular, Termin-CTA und Admin-Leadverwaltung.
            </p>
            <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="mt-4 block text-sm font-bold text-orange-200 hover:text-white">
              {DEFAULT_CONTACT_EMAIL}
            </a>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-orange-200">System</h4>
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
                <button onClick={openCookieSettings} className="text-left hover:text-white">Cookie-Einstellungen</button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-orange-200">Vertriebsnutzen</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-green-300" /> Qualifizierte PV-Anfragen statt unstrukturierter Kontakte.</div>
              <div className="flex gap-3"><CalendarCheck className="mt-0.5 h-4 w-4 text-green-300" /> Termin-CTA für schnelle Beratungsgespräche.</div>
              <div className="flex gap-3"><Database className="mt-0.5 h-4 w-4 text-green-300" /> Admin-Übersicht für Status, Quelle und Leadqualität.</div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400 md:text-left">
          © {new Date().getFullYear()} {DEFAULT_BRAND_NAME}. Alle Rechte vorbehalten. Dieses System stellt eine technische Vertriebsinfrastruktur bereit und ersetzt keine individuelle Energieberatung.
        </div>
      </div>
    </footer>
  );
};
