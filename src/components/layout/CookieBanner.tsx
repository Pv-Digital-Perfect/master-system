import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Settings2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CookieSettingsDialog } from "@/components/layout/CookieSettingsDialog";
import { isBotLikeRuntime } from "@/lib/runtimeFlags";
import { useSiteBrandName } from "@/hooks/useSettings";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_SETTINGS_OPEN_EVENT,
  createConsentState,
  readCookieConsent,
  type CookieConsentState,
  writeCookieConsent,
} from "@/lib/cookie-consent";

export const CookieBanner = () => {
  const brandName = useSiteBrandName();
  const isBotRuntime = isBotLikeRuntime();
  const [consent, setConsent] = useState<CookieConsentState | null>(() => readCookieConsent());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<Pick<CookieConsentState, "analytics" | "marketing">>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const syncConsent = () => {
      const next = readCookieConsent();
      setConsent(next);
      setDraft({
        analytics: Boolean(next?.analytics),
        marketing: Boolean(next?.marketing),
      });
    };

    const openSettings = () => setSettingsOpen(true);

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
    window.addEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings as EventListener);
    window.addEventListener("showCookieSettings", openSettings as EventListener);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent as EventListener);
      window.removeEventListener(COOKIE_SETTINGS_OPEN_EVENT, openSettings as EventListener);
      window.removeEventListener("showCookieSettings", openSettings as EventListener);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  const showBanner = useMemo(() => !isBotRuntime && !consent, [consent, isBotRuntime]);

  const saveConsent = (next: CookieConsentState) => {
    writeCookieConsent(next);
    setConsent(next);
    setDraft({ analytics: next.analytics, marketing: next.marketing });
    setSettingsOpen(false);
  };

  if (isBotRuntime) return null;

  return (
    <>
      {showBanner ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] px-4 pb-4 md:px-6 md:pb-6">
          <div className="pointer-events-auto mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[#0F172A]/95 p-5 text-white shadow-[0_38px_110px_-36px_rgba(0,0,0,0.72)] backdrop-blur-xl md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
                  <ShieldCheck size={14} className="text-[#22C55E]" />
                  Datenschutz & Consent
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  Wir respektieren deine Entscheidung.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">
                  Essenzielle Cookies halten {brandName} stabil. Analyse- und Marketing-Cookies werden erst nach aktiver Zustimmung geladen.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-white/55">
                  <Link to="/datenschutz" className="underline decoration-white/20 underline-offset-4 hover:text-white">
                    Datenschutz
                  </Link>
                  <Link to="/impressum" className="underline decoration-white/20 underline-offset-4 hover:text-white">
                    Impressum
                  </Link>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:max-w-[270px] lg:items-stretch">
                <Button
                  className="w-full rounded-xl bg-[#F97316] font-extrabold text-white hover:bg-orange-600"
                  onClick={() => saveConsent(createConsentState({ analytics: true, marketing: true }))}
                >
                  Alle akzeptieren
                </Button>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Settings2 size={16} className="mr-2" />
                    Einstellungen
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                    onClick={() => saveConsent(createConsentState({ analytics: false, marketing: false }))}
                  >
                    Nur essenzielle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-4 left-4 z-[30] hidden items-center gap-2 rounded-full border border-[#808080]/20 bg-white px-4 py-2 text-xs font-extrabold text-[#0F172A] shadow-[0_24px_60px_-34px_rgba(15,23,42,0.35)] md:inline-flex"
        >
          <Settings2 size={14} className="text-[#F97316]" />
          Cookie-Einstellungen
        </button>
      )}

      <CookieSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        draft={draft}
        onDraftChange={setDraft}
        onSave={() => saveConsent(createConsentState(draft))}
      />
    </>
  );
};
