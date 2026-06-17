import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Home, SunMedium } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_BRAND_NAME } from "@/lib/constants";

export default function FeatureUnavailable() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>Seite aktuell nicht verfügbar | {DEFAULT_BRAND_NAME}</title>
        <meta
          name="description"
          content="Diese Funktion ist für diese Website aktuell nicht aktiviert. Nutzen Sie den PV-Rechner oder senden Sie direkt eine unverbindliche Anfrage."
        />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-28">
        <Card className="mx-auto max-w-3xl overflow-hidden border border-[#808080]/20 bg-white shadow-xl shadow-slate-900/10">
          <CardContent className="p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#22C55E]/10 text-[#22C55E]">
              <SunMedium className="h-8 w-8" />
            </div>

            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Photovoltaik-Anfrage</p>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">
              Diese Seite ist aktuell nicht verfügbar.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
              Für eine erste Einschätzung können Sie weiterhin den PV-Rechner nutzen oder direkt eine unverbindliche Anfrage für Beratung, Planung und Angebot stellen.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600">
                <Link to="/pv-rechner">PV berechnen <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-[#808080]/30 bg-white px-8 font-extrabold text-[#0F172A] hover:bg-slate-50">
                <Link to="/angebot-anfordern">Anfrage stellen</Link>
              </Button>
            </div>

            <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#F97316]">
              <Home className="h-4 w-4" /> Zur Startseite
            </Link>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
