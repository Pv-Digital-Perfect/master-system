import { Link, useLocation } from "react-router-dom";
import { Calculator, Send } from "lucide-react";
import { hasPackageFeature } from "@/config/packageConfig";
import { readCookieConsent, COOKIE_CONSENT_EVENT } from "@/lib/cookie-consent";
import { useEffect, useMemo, useState } from "react";

const HIDDEN_PATH_PREFIXES = ["/admin"];

const HIDDEN_PATHS = new Set([
  "/angebot-anfordern",
  "/danke",
  "/impressum",
  "/datenschutz",
  "/agb",
]);

export function StickyMobileCta() {
  const location = useLocation();
  const [hasCookieDecision, setHasCookieDecision] = useState(() => Boolean(readCookieConsent()));

  useEffect(() => {
    const syncConsent = () => setHasCookieDecision(Boolean(readCookieConsent()));

    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  const shouldHide = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, "") || "/";

    return (
      !hasCookieDecision ||
      HIDDEN_PATHS.has(pathname) ||
      HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
      !hasPackageFeature("pvCalculator") ||
      !hasPackageFeature("offerRequest")
    );
  }, [hasCookieDecision, location.pathname]);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/20 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-18px_55px_-32px_rgba(15,23,42,0.65)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
        <Link
          to="/pv-rechner"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#808080]/25 bg-white px-3 text-center text-sm font-black text-[#0F172A] shadow-sm transition active:scale-[0.98]"
        >
          <Calculator className="h-4 w-4 text-[#22C55E]" />
          PV berechnen
        </Link>
        <Link
          to="/angebot-anfordern"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#F97316] px-3 text-center text-sm font-black text-white shadow-lg shadow-orange-500/25 transition active:scale-[0.98]"
        >
          <Send className="h-4 w-4" />
          Anfrage
        </Link>
      </div>
    </div>
  );
}
