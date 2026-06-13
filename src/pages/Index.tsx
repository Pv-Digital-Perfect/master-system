import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { ReactNode } from "react";
import { ArrowRight, BatteryCharging, BarChart3, CalendarCheck, CheckCircle2, FileText, HelpCircle, Home, LineChart, PlugZap, ShieldCheck, Sparkles, SunMedium, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEFAULT_BRAND_NAME, DEFAULT_SITE_DESCRIPTION } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

const benefits = [
  "Kostenlose Ersteinschätzung für Ihre geplante PV-Anlage",
  "PV-Kosten, Stromersparnis und Amortisation verständlich berechnet",
  "Speicher und Wallbox direkt in der Anfrage berücksichtigen",
  "Fördermöglichkeiten sauber und unverbindlich prüfen lassen",
  "Dachdaten, Verbrauch und Objektart strukturiert erfassen",
  "Rückruf oder Beratungstermin einfach anfragen",
];

const modules = [
  {
    icon: Zap,
    title: "PV-Kostenrechner",
    text: "Berechnen Sie eine erste Einschätzung zu Investition, Ersparnis und Amortisation Ihrer geplanten Photovoltaikanlage.",
    url: "/pv-rechner",
  },
  {
    icon: LineChart,
    title: "Stromkosten sparen",
    text: "Sehen Sie, wie stark Eigenverbrauch, Einspeisung und Ihr aktueller Strompreis die jährliche Ersparnis beeinflussen können.",
    url: "/stromkosten-sparen",
  },
  {
    icon: BatteryCharging,
    title: "Speicher-Rechner",
    text: "Prüfen Sie, welche Speichergröße zu Ihrem Stromverbrauch passen kann und wann ein Batteriespeicher sinnvoll wird.",
    url: "/speicher-rechner",
  },
  {
    icon: FileText,
    title: "Förder-Check",
    text: "Geben Sie Bundesland, PV-Planung, Speicher und Wallbox an und lassen Sie mögliche Förderpunkte unverbindlich prüfen.",
    url: "/foerder-check",
  },
  {
    icon: Home,
    title: "Dach & Objekt",
    text: "Dachart, Ausrichtung, Fläche und Objektart helfen dabei, Ihre Anfrage deutlich genauer einzuschätzen.",
    url: "/angebot-anfordern",
  },
  {
    icon: CalendarCheck,
    title: "Beratung anfragen",
    text: "Senden Sie Ihre Eckdaten ab und erhalten Sie eine persönliche Rückmeldung zur passenden PV-Lösung.",
    url: "/angebot-anfordern",
  },
];

const processSteps = [
  { title: "Daten eingeben", text: "Stromverbrauch, Dachfläche, Speicherwunsch und Standort eintragen." },
  { title: "Einschätzung erhalten", text: "Kosten, Ersparnis und mögliche Amortisation werden verständlich angezeigt." },
  { title: "Anfrage senden", text: "Bei Interesse senden Sie Ihre Daten für eine unverbindliche Rückmeldung ab." },
  { title: "Beratung starten", text: "Im nächsten Schritt werden Dach, Technik, Speicher und Angebot konkret geprüft." },
];

const faq = [
  {
    question: "Ist die Berechnung ein verbindliches Angebot?",
    answer: "Nein. Die Berechnung ist eine unverbindliche Ersteinschätzung. Ein konkretes Angebot hängt unter anderem von Dachzustand, Elektrik, Montageaufwand, Netzanschluss, Speicher und regionalen Faktoren ab.",
  },
  {
    question: "Warum werden Dach- und Verbrauchsdaten abgefragt?",
    answer: "Nur mit Stromverbrauch, Dachfläche, Standort und Speicherwunsch lässt sich eine PV-Anlage realistisch einschätzen. Je genauer die Angaben, desto besser kann die Beratung vorbereitet werden.",
  },
  {
    question: "Kann ich auch Speicher oder Wallbox mitplanen?",
    answer: "Ja. Speicher und Wallbox können direkt mit angegeben werden. So lässt sich früh prüfen, welche Kombination für Haushalt, Eigenverbrauch und Zukunftsplanung sinnvoll sein kann.",
  },
];

const heroHighlights = [
  { label: "PV-Anlage", text: "Kosten und Größe grob einschätzen" },
  { label: "Speicher", text: "Eigenverbrauch besser planen" },
  { label: "Beratung", text: "Unverbindliche Anfrage senden" },
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
        <title>{DEFAULT_BRAND_NAME} | Photovoltaik planen & PV-Angebot anfragen</title>
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
                  <Sparkles className="h-4 w-4" /> Photovoltaik Beratung & Planung
                </div>
                <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-[-0.045em] text-[#0F172A] md:text-6xl lg:text-7xl">
                  Photovoltaik-Anlage planen. Kosten einschätzen. Angebot anfragen.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                  Berechnen Sie in wenigen Schritten eine erste PV-Einschätzung für Ihr Zuhause oder Gewerbe: Kosten, Ersparnis, Speicher, Wallbox und mögliche Förderpunkte — klar, modern und unverbindlich.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600">
                    <Link to="/pv-rechner">PV-Kosten berechnen <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-[#808080]/30 bg-white px-8 text-base font-extrabold text-[#0F172A] hover:bg-slate-50">
                    <Link to="/angebot-anfordern">Kostenlose Anfrage stellen</Link>
                  </Button>
                </div>
                <div className="mt-8 grid gap-3 text-sm font-bold text-slate-600 sm:grid-cols-2">
                  <Trust icon={<ShieldCheck className="h-5 w-5" />} text="Unverbindliche Ersteinschätzung" />
                  <Trust icon={<CheckCircle2 className="h-5 w-5" />} text="Keine verbindlichen Preisversprechen" />
                </div>
              </div>

              <div className="space-y-4">
                <Card className="overflow-hidden border border-[#808080]/20 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur">
                  <CardContent className="p-4 md:p-6">
                    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0F172A]">
                      <picture>
                        <source media="(max-width: 767px)" srcSet="https://lcbmavlggundawcomznp.supabase.co/storage/v1/object/public/Startseitenbilder/pv-system-digital-perfect-solar-hightech-mobile.png" />
                        <img
                          src="https://lcbmavlggundawcomznp.supabase.co/storage/v1/object/public/Startseitenbilder/pv-system-digital-perfect-solar-hightech-desktop.png"
                          alt="Modernes Solar- und Strommotiv für Photovoltaikplanung"
                          className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[500px]"
                          loading="eager"
                        />
                      </picture>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-3 sm:grid-cols-3">
                  {heroHighlights.map((item) => (
                    <div key={item.label} className="rounded-[1.25rem] border border-[#808080]/20 bg-white p-4 shadow-sm">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#F97316]">{item.label}</div>
                      <p className="mt-2 text-sm font-bold leading-snug text-[#0F172A]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]"><SunMedium className="h-6 w-6" /></div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">Alles Wichtige für Ihre PV-Entscheidung.</h2>
              <p className="mt-4 text-lg text-slate-600">Kosten, Ersparnis, Speicher, Förderung und Beratung werden verständlich zusammengeführt.</p>
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
              <div className="mb-4 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#22C55E]">Planung mit Struktur</div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">Damit Ihre PV-Anfrage von Anfang an richtig eingeschätzt werden kann.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Eine Photovoltaikanlage ist immer individuell. Deshalb werden Verbrauch, Dach, Speicherwunsch und Zeitplan direkt strukturiert erfasst.</p>
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
                <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Von der ersten Einschätzung zur persönlichen Beratung.</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-600">Sie erhalten eine schnelle Orientierung und können danach direkt eine kostenlose Anfrage absenden.</p>
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
              <Feature icon={<PlugZap className="h-6 w-6" />} title="Verbrauch & Technik" text="Stromverbrauch, Speicher, Wallbox und Modernisierungsstand werden sinnvoll berücksichtigt." />
              <Feature icon={<HelpCircle className="h-6 w-6" />} title="Kosten transparent verstehen" text="Investition, Ersparnis, Förderung und Amortisation werden verständlich erklärt." />
            </div>
          </div>
        </section>


        <section className="bg-[#F8FAFC] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#22C55E]"><PlugZap className="h-6 w-6" /></div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-5xl">Solarstrom sauber mitdenken.</h2>
              <p className="mt-4 text-lg text-slate-600">Von der Dachfläche bis zum Speicher: Eine gute PV-Planung verbindet Ertrag, Eigenverbrauch und Alltag.</p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
                  title: "PV-Anlage auf dem Dach",
                  text: "Dachfläche, Ausrichtung und Verbrauch bestimmen, wie gut eine Anlage zum Gebäude passt.",
                },
                {
                  image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80",
                  title: "Strom clever nutzen",
                  text: "Eigenverbrauch, Einspeisung und Speicher entscheiden über die langfristige Wirtschaftlichkeit.",
                },
                {
                  image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80",
                  title: "Energie für die Zukunft",
                  text: "PV, Speicher und Wallbox lassen sich früh gemeinsam planen und später sinnvoll erweitern.",
                },
              ].map((item) => (
                <Card key={item.title} className="overflow-hidden border border-[#808080]/20 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-extrabold text-[#0F172A]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Häufige Fragen</h2>
              <p className="mt-4 text-lg text-slate-600">Die wichtigsten Fragen vor einer PV-Anfrage werden klar und realistisch beantwortet.</p>
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
                  <div className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-200"><ShieldCheck className="h-4 w-4" /> Saubere Ersteinschätzung</div>
                  <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-white md:text-5xl">Bereit für Ihre PV-Anfrage?</h2>
                  <p className="mt-4 max-w-2xl text-slate-300">Starten Sie mit dem PV-Rechner oder senden Sie Ihre Eckdaten direkt für eine unverbindliche Rückmeldung ab.</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                  <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600"><Link to="/pv-rechner">PV berechnen</Link></Button>
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
