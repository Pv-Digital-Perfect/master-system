import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, FileText, MapPin, ShieldAlert, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

const states = [
  "Burgenland",
  "Kärnten",
  "Niederösterreich",
  "Oberösterreich",
  "Salzburg",
  "Steiermark",
  "Tirol",
  "Vorarlberg",
  "Wien",
];

export default function FundingCheck() {
  const [state, setState] = useState("Oberösterreich");
  const [projectType, setProjectType] = useState("pv_storage");
  const [timeline, setTimeline] = useState("3_months");

  const checklist = useMemo(() => {
    const base = ["Bundesweite PV-Fördermöglichkeiten prüfen", "Netzbetreiber-Vorgaben und Anschlussbedingungen beachten", "Gemeinde- oder Landesförderung separat gegenprüfen"];
    if (projectType.includes("storage")) base.push("Speicherförderung oder Speicherbonus prüfen");
    if (projectType.includes("wallbox")) base.push("Wallbox- und E-Mobilitätsförderung mitprüfen");
    if (timeline === "now") base.unshift("Förderfenster und Einreichfrist vor Angebotsfreigabe prüfen");
    return base;
  }, [projectType, timeline]);

  const offerUrl = `/angebot-anfordern?source=funding_check`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>PV Förder-Check Österreich | Photovoltaik Förderung prüfen</title>
        <meta name="description" content="Unverbindlicher PV Förder-Check für Photovoltaik, Speicher und Wallbox. Fördermöglichkeiten je Bundesland als Beratungsanfrage prüfen lassen." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/foerder-check")} />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_8%_28%,rgba(34,197,94,0.12),transparent_28%)]" />
          <div className="container relative mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Förder-Check</div>
                <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">PV-Förderung prüfen, ohne falsche Versprechen zu machen.</h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">Der Förder-Check sammelt die wichtigsten Eckdaten und zeigt eine erste Orientierung. Fixe Förderzusagen sind erst nach individueller Prüfung möglich.</p>
              </div>
              <Card className="border border-[#808080]/20 bg-[#0F172A] text-white shadow-2xl shadow-slate-900/20">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F97316] text-white"><Sparkles className="h-7 w-7" /></div>
                  <h2 className="font-display text-2xl font-extrabold">Förderhinweis statt Förderversprechen</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">Förderungen ändern sich laufend. Der Anbieter prüft final Bundesland, Gemeinde, Netzbetreiber, Speicher und Einreichzeitpunkt.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border border-[#808080]/20 bg-white shadow-xl shadow-slate-900/5">
              <CardContent className="space-y-6 p-6 md:p-8">
                <div className="space-y-2">
                  <Label className="font-bold text-[#0F172A]">Bundesland</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger className="h-12 rounded-2xl border-[#808080]/25"><SelectValue /></SelectTrigger>
                    <SelectContent>{states.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[#0F172A]">Vorhaben</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="h-12 rounded-2xl border-[#808080]/25"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pv_only">PV-Anlage</SelectItem>
                      <SelectItem value="pv_storage">PV-Anlage mit Speicher</SelectItem>
                      <SelectItem value="pv_wallbox">PV-Anlage mit Wallbox</SelectItem>
                      <SelectItem value="pv_storage_wallbox">PV, Speicher und Wallbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-[#0F172A]">Umsetzungszeitraum</Label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger className="h-12 rounded-2xl border-[#808080]/25"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">so schnell wie möglich</SelectItem>
                      <SelectItem value="3_months">in den nächsten 3 Monaten</SelectItem>
                      <SelectItem value="6_months">in den nächsten 6 Monaten</SelectItem>
                      <SelectItem value="research">erst informieren</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-[#0F172A] text-white shadow-2xl shadow-slate-900/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.18em] text-orange-200">Prüfprofil</div>
                    <div className="mt-2 font-display text-4xl font-extrabold tracking-[-0.05em] text-white">{state}</div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#22C55E] text-white"><MapPin className="h-7 w-7" /></div>
                </div>

                <div className="mt-7 space-y-3">
                  {checklist.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-semibold text-slate-100"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />{item}</div>)}
                </div>

                <div className="mt-7 rounded-[1.75rem] border border-[#F97316]/30 bg-[#F97316]/10 p-5 text-sm leading-relaxed text-orange-50">
                  <div className="mb-2 flex items-center gap-2 font-extrabold"><ShieldAlert className="h-5 w-5" /> Keine fixe Förderzusage</div>
                  Diese Ausgabe ist bewusst ein Beratungs-Check. Förderhöhe, Verfügbarkeit und Fristen müssen tagesaktuell geprüft werden.
                </div>

                <Button asChild className="mt-7 h-14 rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white hover:bg-orange-600">
                  <Link to={offerUrl}>Förderung prüfen lassen <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Info icon={<FileText className="h-6 w-6" />} title="Bundesland" text="Landes- und Gemeindeförderungen können regional stark abweichen." />
              <Info icon={<CheckCircle2 className="h-6 w-6" />} title="Projektumfang" text="PV, Speicher und Wallbox können unterschiedliche Förderlogiken haben." />
              <Info icon={<ShieldAlert className="h-6 w-6" />} title="Einreichfrist" text="Der Zeitpunkt entscheidet oft, ob eine Förderung realistisch nutzbar ist." />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <Card className="border border-[#808080]/20 bg-[#F8FAFC]"><CardContent className="p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#22C55E]/10 text-[#22C55E]">{icon}</div><h2 className="font-display text-xl font-extrabold text-[#0F172A]">{title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></CardContent></Card>;
}
