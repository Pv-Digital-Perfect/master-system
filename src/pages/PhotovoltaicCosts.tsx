import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Euro, Home, PlugZap, ShieldCheck, SunMedium } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

const costBlocks = [
  { icon: SunMedium, title: "PV-Module & Wechselrichter", text: "Grundlage der Anlage. Preis und Leistung hängen von Qualität, Dachfläche, Wechselrichterkonzept und technischer Auslegung ab." },
  { icon: Home, title: "Dach, Gerüst & Montage", text: "Dachform, Zugänglichkeit, Unterkonstruktion, Leitungswege und Gerüst beeinflussen die Montagekosten deutlich." },
  { icon: PlugZap, title: "Elektroarbeiten & Netzanschluss", text: "Zählerschrank, Absicherung, Verkabelung und Netzbetreiber-Vorgaben können den finalen Aufwand verändern." },
  { icon: Euro, title: "Speicher & Wallbox", text: "Speicher und Wallbox erhöhen den Nutzen, sind aber starke Preisfaktoren und sollten separat geprüft werden." },
];

const priceExamples = [
  { size: "kleine Anlage", kwp: "4–6 kWp", use: "Einfamilienhaus mit niedrigem Verbrauch" },
  { size: "Standard-Anlage", kwp: "7–10 kWp", use: "typischer Haushalt mit guter Dachfläche" },
  { size: "große Anlage", kwp: "11–20 kWp", use: "hoher Verbrauch, Wärmepumpe, E-Auto oder Gewerbe" },
];

export default function PhotovoltaicCosts() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>Photovoltaik Kosten | PV-Anlage kalkulieren</title>
        <meta name="description" content="Photovoltaik Kosten verständlich erklärt: Anlagengröße, Speicher, Dach, Montage, Elektroarbeiten und Netzanschluss beeinflussen die Investition." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/photovoltaik-kosten")} />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_8%_28%,rgba(34,197,94,0.12),transparent_28%)]" />
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Kosten-Landingpage</div>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">Photovoltaik Kosten realistisch einschätzen</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Eine PV-Anlage hat keinen Einheitsbetrag. Entscheidend sind Anlagengröße, Speicher, Dach, Montage, Elektroarbeiten und gewünschter Umsetzungszeitraum. Diese Seite führt Besucher sauber in Rechner und Anfrage.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600"><Link to="/pv-rechner">Kosten berechnen <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
                <Button asChild variant="outline" className="h-14 rounded-full border-[#808080]/30 bg-white px-8 font-extrabold text-[#0F172A]"><Link to="/angebot-anfordern">Angebot anfordern</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {costBlocks.map((block) => <Card key={block.title} className="border border-[#808080]/20 bg-white"><CardContent className="p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]"><block.icon className="h-6 w-6" /></div><h2 className="font-display text-xl font-extrabold">{block.title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{block.text}</p></CardContent></Card>)}
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#22C55E]">Beispiel-Struktur</div>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">So entsteht aus ersten Kostenfragen eine fundierte Projektgrundlage.</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Die Seite erklärt nicht nur Preise, sondern leitet in die passende Aktion: Rechner nutzen, Speicher prüfen oder Angebot anfordern.</p>
            </div>
            <div className="grid gap-4">
              {priceExamples.map((item) => <div key={item.size} className="rounded-[1.5rem] border border-[#808080]/20 bg-[#F8FAFC] p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h3 className="font-display text-xl font-extrabold">{item.size}</h3><span className="rounded-full bg-[#22C55E]/10 px-4 py-2 text-sm font-extrabold text-[#22C55E]">{item.kwp}</span></div><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.use}</p></div>)}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="rounded-[2rem] border border-[#808080]/20 bg-[#0F172A] p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div><div className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-orange-200"><ShieldCheck className="h-4 w-4" /> unverbindlich</div><h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Kein fixer Preis ohne Dachprüfung.</h2><p className="mt-4 text-slate-300">Die Einschätzung bleibt bewusst seriös: Sie zeigt realistische Richtwerte und ersetzt keine technische Prüfung vor Ort.</p></div>
              <Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600 lg:justify-self-end"><Link to="/angebot-anfordern">Kosten prüfen lassen</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
