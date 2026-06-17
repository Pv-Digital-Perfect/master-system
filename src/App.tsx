import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ThemeProvider } from "@/hooks/useTheme";
import { useSettings } from "@/hooks/useSettings";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { isBotLikeRuntime } from "@/lib/runtimeFlags";
import { CookieBanner } from "./components/layout/CookieBanner";
import { StickyMobileCta } from "./components/layout/StickyMobileCta";
import { SeoDefaults } from "./components/seo/SeoDefaults";
import { PackageRoute } from "@/components/routing/PackageRoute";
import { ScrollToTopHandler } from "@/components/ScrollToTopHandler";
import { ScrollToAnchor } from "@/components/ScrollToAnchor";
import { COOKIE_CONSENT_EVENT, LEGACY_COOKIE_CONSENT_EVENT, readCookieConsent } from "@/lib/cookie-consent";

import Index from "./pages/Index";
import Contact from "./pages/Contact";
import PvCalculator from "./pages/PvCalculator";
import OfferRequest from "./pages/OfferRequest";
import PhotovoltaicCosts from "./pages/PhotovoltaicCosts";
import Funding from "./pages/Funding";
import References from "./pages/References";
import SavingsCalculator from "./pages/SavingsCalculator";
import StorageCalculator from "./pages/StorageCalculator";
import FundingCheck from "./pages/FundingCheck";
import ThankYou from "./pages/ThankYou";

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./pages/admin/Layout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const Impressum = lazy(() => import("./pages/Impressum"));
const AGB = lazy(() => import("./pages/AGB"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const ThemeManager = () => {
  const { data: settings, isLoading } = useSettings();
  const activeTheme = (settings?.active_theme as string) || "pv";

  useLayoutEffect(() => {
    const cachedTheme = localStorage.getItem("app-theme") || "pv";
    document.documentElement.setAttribute("data-theme", cachedTheme);
  }, []);

  useEffect(() => {
    if (!isLoading && activeTheme) {
      document.documentElement.setAttribute("data-theme", activeTheme);
      localStorage.setItem("app-theme", activeTheme);
    }
  }, [activeTheme, isLoading]);

  return null;
};

const AnalyticsWrapper = () => {
  const { data: settings } = useSettings();
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = readCookieConsent();
      setHasConsent(consent?.analytics === true);
    };

    checkConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, checkConsent as EventListener);
    window.addEventListener(LEGACY_COOKIE_CONSENT_EVENT, checkConsent as EventListener);
    window.addEventListener("storage", checkConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, checkConsent as EventListener);
      window.removeEventListener(LEGACY_COOKIE_CONSENT_EVENT, checkConsent as EventListener);
      window.removeEventListener("storage", checkConsent);
    };
  }, []);

  useEffect(() => {
    if (!settings?.google_analytics_id) return;

    const trackingId = settings.google_analytics_id as string;
    const disableKey = `ga-disable-${trackingId}`;

    if (hasConsent) {
      (window as any)[disableKey] = false;

      const scriptId = "ga4-script";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement("script");
        inlineScript.id = "ga4-inline-script";
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${trackingId}');
        `;
        document.head.appendChild(inlineScript);
      } else if ((window as any).gtag) {
        (window as any).gtag("config", trackingId);
      }
    } else {
      (window as any)[disableKey] = true;
    }
  }, [hasConsent, settings?.google_analytics_id]);

  return (
    <>
      {settings?.google_search_console_verification && (
        <Helmet>
          <meta name="google-site-verification" content={settings.google_search_console_verification as string} />
        </Helmet>
      )}
    </>
  );
};

const App = () => {
  const suspenseFallback = isBotLikeRuntime() ? null : <LoadingScreen />;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light">
          <ThemeManager />
          <HelmetProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AnalyticsWrapper />

              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CookieBanner />
                <ScrollToTopHandler />
                <ScrollToAnchor />
                <SeoDefaults />
                <StickyMobileCta />

                <Suspense fallback={suspenseFallback}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/pv-rechner" element={<PackageRoute feature="pvCalculator"><PvCalculator /></PackageRoute>} />
                    <Route path="/angebot-anfordern" element={<PackageRoute feature="offerRequest"><OfferRequest /></PackageRoute>} />
                    <Route path="/photovoltaik-kosten" element={<PackageRoute feature="photovoltaicCosts"><PhotovoltaicCosts /></PackageRoute>} />
                    <Route path="/foerderung" element={<PackageRoute feature="fundingOverview"><Funding /></PackageRoute>} />
                    <Route path="/foerder-check" element={<PackageRoute feature="fundingCheck"><FundingCheck /></PackageRoute>} />
                    <Route path="/stromkosten-sparen" element={<PackageRoute feature="savingsCalculator"><SavingsCalculator /></PackageRoute>} />
                    <Route path="/speicher-rechner" element={<PackageRoute feature="storageCalculator"><StorageCalculator /></PackageRoute>} />
                    <Route path="/referenzen" element={<PackageRoute feature="references"><References /></PackageRoute>} />
                    <Route path="/kontakt" element={<PackageRoute feature="contact"><Contact /></PackageRoute>} />
                    <Route path="/danke" element={<ThankYou />} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/agb" element={<AGB />} />
                    <Route path="/datenschutz" element={<Datenschutz />} />

                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="leads" element={<AdminLeads />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </HelmetProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
