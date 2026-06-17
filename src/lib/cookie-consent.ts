export const COOKIE_CONSENT_STORAGE_KEY = "pv.cookieConsent.v1";
export const LEGACY_COOKIE_CONSENT_STORAGE_KEY = "cookie-consent";
export const COOKIE_CONSENT_EVENT = "pv:cookie-consent-changed";
export const LEGACY_COOKIE_CONSENT_EVENT = "cookie-consent-update";
export const COOKIE_SETTINGS_OPEN_EVENT = "pv:cookie-settings-open";

export type CookieConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: 1;
};

export const createConsentState = (
  values?: Partial<Pick<CookieConsentState, "analytics" | "marketing">>,
): CookieConsentState => ({
  essential: true,
  analytics: Boolean(values?.analytics),
  marketing: Boolean(values?.marketing),
  updatedAt: new Date().toISOString(),
  version: 1,
});

const normalizeConsent = (raw: string | null): CookieConsentState | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;

    if (parsed?.essential !== true) return null;

    return {
      essential: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      version: 1,
    };
  } catch {
    return null;
  }
};

export const readCookieConsent = (): CookieConsentState | null => {
  if (typeof window === "undefined") return null;

  const current = normalizeConsent(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
  if (current) return current;

  const legacy = normalizeConsent(window.localStorage.getItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY));
  if (!legacy) return null;

  writeCookieConsent(legacy);
  return legacy;
};

export const writeCookieConsent = (state: CookieConsentState) => {
  if (typeof window === "undefined") return;

  try {
    const payload = JSON.stringify(state);
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, payload);
    window.localStorage.setItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY, payload);
    window.localStorage.setItem("cookie-consent-timestamp", String(Date.now()));
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: state }));
    window.dispatchEvent(new Event(LEGACY_COOKIE_CONSENT_EVENT));
  } catch {
    // Consent darf niemals das Frontend brechen.
  }
};

export const clearCookieConsent = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_COOKIE_CONSENT_STORAGE_KEY);
    window.localStorage.removeItem("cookie-consent-timestamp");
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: null }));
    window.dispatchEvent(new Event(LEGACY_COOKIE_CONSENT_EVENT));
  } catch {
    // noop
  }
};

export const hasTrackingConsent = (state: CookieConsentState | null) =>
  Boolean(state?.analytics || state?.marketing);

export const openCookieSettings = () => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_OPEN_EVENT));
  window.dispatchEvent(new Event("showCookieSettings"));
};
