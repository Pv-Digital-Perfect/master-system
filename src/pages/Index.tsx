import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";
import { ArrowRight, BatteryCharging, BarChart3, CalendarCheck, CheckCircle2, Database, FileText, HelpCircle, Home, LineChart, PlugZap, ShieldCheck, Sparkles, SunMedium, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_BRAND_NAME, DEFAULT_SITE_DESCRIPTION } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

const benefits = [
  "PV-Rechner als hochwertiger Lead-Magnet",
  "Stromkosten- und Speicher-Rechner als zusätzliche Einstiegspunkte",
  "Förder-Check ohne riskante Förderversprechen",
  "Qualifizierte Angebotsanfragen mit Dach- und Verbrauchsdaten",
  "Admin-Leadübersicht mit Status und Notizen",
  "White-Label-fähige Anbieter-Website",
];

const modules = [
  {
    icon: Zap,
    title: "PV-Kostenrechner",
    text: "Interessenten erhalten eine klare Investitions-, Ersparnis- und Amortisationsschätzung. Danach führt das System direkt in die Angebotsanfrage.",
    url: "/pv-rechner",
  },
  {
    icon: LineChart,
    title: "Stromkosten sparen",
    text: "Der Ersparnisrechner zeigt den Nutzen von Eigenverbrauch, Einspeisung und steigenden Stromkosten verständlich auf.",
    url: "/stromkosten-sparen",
  },
  {
    icon: BatteryCharging,
    title: "Speicher-Rechner",
    text: "Der Speicher-Rechner qualifiziert, ob ein Batteriespeicher grundsätzlich zum Verbrauchsprofil passt.",
    url: "/speicher-rechner",
  },
  {
    icon: FileText,
    title: "Förder-Check",
    text: "Der Förder-Check sammelt relevante Daten, ohne rechtlich riskante Förderzusagen zu machen.",
    url: "/foerder-check",
  },
  {
    icon: Database,
    title: "Leadverwaltung",
    text: "Alle Anfragen landen strukturiert im Adminbereich: Kontakt, PLZ, Dachdaten, Stromverbrauch, Speicherwunsch und Status.",
    url: "/admin/leads",
  },
  {
    icon: CalendarCheck,
    title: "Termin-Flow",
    text: "Der Anbieter kann Interessenten gezielt in Richtung Rückruf, Beratung oder Vor-Ort-Termin führen.",
    url: "/angebot-anfordern",
  },
];

const processSteps = [
  { title: "Rechner nutzen", text: "Der Besucher berechnet Kosten, Ersparnis, Speicher oder Förderung." },
  { title: "Daten qualifizieren", text: "PLZ, Objekt, Dachart, Verbrauch, Eigentümerstatus und Zeitraum werden abgefragt." },
  { title: "Lead im Admin", text: "Der Anbieter sieht Anfrage, Status, Quelle, Kontaktdaten und Notizen im Dashboard." },
  { title: "Beratung starten", text: "Aus einem kalten Website-Besucher wird ein konkreter Beratungskontakt." },
];

const faq = [
  {
    question: "Ist das ein echter Angebotsrechner?",
    answer: "Nein. Das System liefert bewusst eine unverbindliche Schätzung. Ein verbindliches Angebot muss immer Dach, Elektrik, Montageaufwand, Netzanschluss, Speicher und regionale Faktoren berücksichtigen.",
  },
  {
    question: "Warum sind mehrere Rechner sinnvoll?",
    answer: "Nicht jeder Besucher sucht nach dem gleichen Einstieg. Manche suchen Kosten, andere Ersparnis, Speicher oder Förderung. Jeder Rechner ist ein eigener Lead-Magnet mit eigener Suchintention.",
  },
  {
    question: "Kann das System mehrfach verkauft werden?",
    answer: "Ja. Die technische Basis bleibt gleich, während Branding, Kontaktdaten, Preise, Texte und Anbieterinformationen pro Kunde angepasst werden können.",
  },
];

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: DEFAULT_BRAND_NAME,
  url: buildAbsoluteSiteUrl("/"),
  description: DEFAULT_SITE_DESCRIPTION,
};

export default function Index() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>{DEFAULT_BRAND_NAME} | PV Leads & Photovoltaik Vertriebssystem</title>
        <meta name="description" content={DEFAULT_SITE_DESCRIPTION} />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/")} />
        <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
      </Helmet>
      <Header transparent />

      <main>
        <section className="relative isolate overflow-hidden bg-[#F8FAFC] pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,0.16),transparent_30%),radial-gradient(circle_at_8%_22%,rgba(34,197,94,0.12),transparent_28%)]" />
          <div className="container relative mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[1.03fr_0.97fr]">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#808080]/20 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316] shadow-sm">
                  <Sparkles className="h-4 w-4" /> White-Label System für PV-Anbieter
                </div>
                <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-[-0.045em] text-[#0F172A] md:text-6xl lg:text-7xl">
                  Mehr Photovoltaik-Anfragen. Bessere Leads. Klarer Vertrieb.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Ein edles, duplizierbares Vertriebssystem für Solarteure: Website, PV-Rechner, Stromkosten-Rechner, Speicher-Rechner, Förder-Check, Lead-Dashboard und klare Terminführung in einem Paket.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600">
                    <Link to="/pv-rechner">PV-Rechner starten <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-[#808080]/30 bg-white px-8 text-base font-extrabold text-[#0F172A] hover:bg-slate-50">
                    <Link to="/angebot-anfordern">Anfrage ansehen</Link>
                  </Button>
                </div>
                <div className="mt-8 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">
                  <Trust icon={<ShieldCheck className="h-5 w-5" />} text="DSGVO-bewusster Leadflow" />
                  <Trust icon={<CheckCircle2 className="h-5 w-5" />} text="Keine verbindlichen Preisversprechen" />
                </div>
              </div>

              <Card className="overflow-hidden border border-[#808080]/20 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur">
                <CardContent className="p-5 md:p-7">
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-[#0F172A] p-6 text-white">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#F97316]/20 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#22C55E]/10 blur-3xl" />
                    <div className="relative flex items-center justify-between border-b border-[#808080]/25 pb-5">
                      <div>
                        <div className="text-sm text-slate-300">Neue PV-Anfragen</div>
                        <div className="mt-1 font-display text-4xl font-extrabold tracking-[-0.04em] text-white">+27</div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-lg shadow-orange-500/25">
                        <BarChart3 className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="relative mt-6 space-y-4">
                      {["Hausbesitzer · 4020 Linz · Speicher: ja", "Einfamilienhaus · 4600 Wels · Rückruf", "Gewerbeobjekt · 3100 St. Pölten · 30.000 kWh"].map((item) => (
                        <div key={item} className="rounded-2xl border border-[#808080]/20 bg-white/[0.055] p-4 text-sm font-semibold text-slate-100">{item}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]"><SunMedium className="h-6 w-6" /></div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">Mehr Einstiegspunkte. Mehr Leads.</h2>
              <p className="mt-4 text-lg text-slate-600">Das System bekommt bewusst mehrere SEO- und Conversion-Einstiege statt nur einer schönen Startseite.</p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => (
                <Card key={module.title} className="group border border-[#808080]/20 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <CardContent className="flex h-full flex-col p-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#22C55E] transition group-hover:bg-[#F97316]/10 group-hover:text-[#F97316]"><module.icon className="h-6 w-6" /></div>
                    <h3 className="font-display text-xl font-extrabold text-[#0F172A]">{module.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{module.text}</p>
                    <Link to={module.url} className="mt-5 inline-flex items-center text-sm font-extrabold text-[#F97316] hover:text-orange-600">Mehr ansehen <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#22C55E]">Verkaufslogik</div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">Gebaut wie ein Vertriebssystem, nicht wie eine normale Website.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Jeder Bereich hat einen Zweck: Suchintention abholen, Vertrauen aufbauen, Einwand beantworten und die Anfrage qualifizieren.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-[#808080]/20 bg-[#F8FAFC] p-4 text-sm font-bold text-[#0F172A] shadow-sm"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#22C55E]" />{benefit}</div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-[#808080]/20 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Ablauf</div>
                <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Vom Suchenden zum Beratungskontakt.</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">Der Nutzer wird nicht überfordert, sondern Schritt für Schritt in eine konkrete Anfrage geführt.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {processSteps.map((step, index) => <Step key={step.title} number={index + 1} title={step.title} text={step.text} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Feature icon={<Home className="h-6 w-6" />} title="Dach & Objekt" text="Immobilientyp, Dachart, Dachfläche und Ausrichtung helfen bei der ersten Einschätzung." />
              <Feature icon={<PlugZap className="h-6 w-6" />} title="Verbrauch & Technik" text="Stromverbrauch, Speicher, Wallbox und Modernisierungsstand erhöhen die Leadqualität." />
              <Feature icon={<HelpCircle className="h-6 w-6" />} title="Einwände beantworten" text="Kosten, Förderung, Speicher und Amortisation werden vor dem Gespräch verständlich erklärt." />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Häufige Fragen</h2>
              <p className="mt-4 text-lg text-slate-600">Wichtige Einwände werden direkt sichtbar beantwortet — sauber, realistisch und verkaufsorientiert.</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5">
              {faq.map((item) => <Card key={item.question} className="border border-[#808080]/20 bg-white"><CardContent className="p-6"><h3 className="font-display text-xl font-extrabold text-[#0F172A]">{item.question}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p></CardContent></Card>)}
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#808080]/20 bg-[#0F172A] p-8 text-white shadow-2xl shadow-slate-900/20 md:p-12 lg:p-16">
              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#F97316]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#22C55E]/10 blur-3xl" />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-200"><ShieldCheck className="h-4 w-4" /> Leadqualität zuerst</div>
                  <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-white md:text-5xl">Bereit für die nächste PV-Anfrage?</h2>
                  <p className="mt-4 max-w-2xl text-slate-300">Die wichtigsten Einstiege sind jetzt vorbereitet: PV-Kosten, Ersparnis, Speicher, Förderung und Angebotsanfrage.</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                  <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600"><Link to="/pv-rechner">Rechner starten</Link></Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/20 bg-white/10 px-8 font-extrabold text-white hover:bg-white/20"><Link to="/angebot-anfordern">Anfrage senden</Link></Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Trust({ icon, text }: { icon: ReactNode; text: string }) {
  return <div className="flex items-center gap-2 rounded-2xl border border-[#808080]/20 bg-white px-4 py-3 shadow-sm">{icon}<span>{text}</span></div>;
}

function Step({ number, title, text }: { number: number; title: string; text: string }) {
  return <div className="rounded-[1.5rem] border border-[#808080]/20 bg-white p-6 shadow-sm"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316] text-sm font-extrabold text-white">{number}</div><h3 className="font-display text-lg font-extrabold text-[#0F172A]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div>;
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <Card className="border border-[#808080]/20 bg-[#F8FAFC]"><CardContent className="p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#22C55E]">{icon}</div><h3 className="font-display text-xl font-extrabold text-[#0F172A]">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></CardContent></Card>;
}
