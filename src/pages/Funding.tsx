import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, MapPin, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

const fundingFactors = [
  "Bundesland und Gemeinde",
  "PV-Anlage, Speicher oder Wallbox",
  "Einreichzeitpunkt und verfügbare Fördertöpfe",
  "Netzanschluss und technische Vorgaben",
  "Privat, Gewerbe oder Landwirtschaft",
];

export default function Funding() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>Photovoltaik Förderung | PV-Förderung prüfen</title>
        <meta name="description" content="Photovoltaik Förderung sicher einordnen: Bundesland, Speicher, Wallbox und Einreichzeitpunkt prüfen und eine strukturierte PV-Anfrage starten." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/foerderung")} />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Förderungsseite</div>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">PV-Förderung richtig prüfen</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Förderungen ändern sich regelmäßig. Darum ist diese Seite als sichere Informations- und Leadseite gebaut: verständlich, vorsichtig formuliert und mit direktem Förder-Check.</p>
              <Button asChild className="mt-8 h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600"><Link to="/foerder-check">Förder-Check starten <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-[#808080]/20 bg-white"><CardContent className="p-7"><CheckCircle2 className="mb-5 h-7 w-7 text-[#22C55E]" /><h2 className="font-display text-2xl font-extrabold">Was abgefragt werden sollte</h2><p className="mt-3 text-slate-600">Bundesland, Gebäudetyp, Speicherwunsch, Anlagenstatus und geplanter Umsetzungszeitpunkt sind wichtige Faktoren für die Beratung.</p></CardContent></Card>
            <Card className="border-[#F97316]/30 bg-orange-50"><CardContent className="p-7"><AlertTriangle className="mb-5 h-7 w-7 text-[#F97316]" /><h2 className="font-display text-2xl font-extrabold">Wichtig</h2><p className="mt-3 text-orange-900">Keine statischen Förderversprechen hart einbauen. Fördertexte müssen aktuell gehalten und rechtlich sauber formuliert werden.</p></CardContent></Card>
          </div>
        </section>
        <section className="bg-white py-16 md:py-24">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div><div className="mb-4 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#22C55E]">Prüfkriterien</div><h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Förderung ist ein Beratungshebel, kein Fixbetrag.</h2><p className="mt-5 text-lg leading-relaxed text-slate-600">Der starke Lead-Magnet ist nicht „garantierte Förderung“, sondern eine professionelle Prüfung, ob und welche Möglichkeiten aktuell infrage kommen.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {fundingFactors.map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#808080]/20 bg-[#F8FAFC] p-4 text-sm font-bold"><MapPin className="h-5 w-5 shrink-0 text-[#F97316]" />{item}</div>)}
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="rounded-[2rem] border border-[#808080]/20 bg-[#0F172A] p-8 text-white md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div><div className="mb-4 flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-green-200"><ShieldCheck className="h-4 w-4" /> sauberer Leadflow</div><h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] md:text-5xl">Förderung direkt als Anfrage nutzen.</h2><p className="mt-4 text-slate-300">Der Förder-Check sammelt die relevanten Daten und führt den Nutzer in eine Beratung, ohne rechtlich riskante Aussagen zu machen.</p></div>
              <div className="flex flex-col gap-3 lg:justify-self-end"><Button asChild size="lg" className="h-14 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600"><Link to="/foerder-check">Förder-Check öffnen</Link></Button><Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/20 bg-white/10 px-8 font-extrabold text-white hover:bg-white/20"><Link to="/angebot-anfordern">Anfrage senden</Link></Button></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
