import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Euro, LineChart, ShieldCheck, Zap } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { buildAbsoluteSiteUrl } from "@/lib/routes";
import { formatEuro, formatNumber, usePvSettings } from "@/hooks/usePvSettings";

export default function SavingsCalculator() {
  const { data: settings } = usePvSettings();
  const [consumption, setConsumption] = useState(5000);
  const [pvSize, setPvSize] = useState(6);
  const [selfUseRate, setSelfUseRate] = useState(55);
  const [electricityPrice, setElectricityPrice] = useState(27);

  const result = useMemo(() => {
    const annualYield = Math.round(pvSize * (settings?.annual_yield_per_kwp || 980));
    const selfUsed = Math.min(consumption, Math.round(annualYield * (selfUseRate / 100)));
    const feedIn = Math.max(0, annualYield - selfUsed);
    const savings = Math.round(selfUsed * (electricityPrice / 100));
    const feedInValue = Math.round(feedIn * (settings?.feed_in_tariff_per_kwh || 0.067));
    const yearlyBenefit = savings + feedInValue;

    return {
      annualYield,
      selfUsed,
      feedIn,
      savings,
      feedInValue,
      yearlyBenefit,
      tenYears: yearlyBenefit * 10,
      twentyYears: yearlyBenefit * 20,
    };
  }, [consumption, electricityPrice, pvSize, selfUseRate, settings]);

  const offerUrl = `/angebot-anfordern?consumption=${consumption}&source=savings_calculator`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>Stromkosten sparen mit Photovoltaik | PV-Ersparnisrechner</title>
        <meta name="description" content="Berechnen Sie unverbindlich, wie viel Stromkosten eine Photovoltaikanlage durch Eigenverbrauch und Einspeisung sparen kann." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/stromkosten-sparen")} />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-[#0F172A] py-16 text-white md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.20),transparent_32%),radial-gradient(circle_at_8%_30%,rgba(34,197,94,0.14),transparent_28%)]" />
          <div className="container relative mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">PV-Ersparnisrechner</div>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">Wie viel Stromkosten können Sie mit PV sparen?</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Dieser Rechner zeigt eine realistische Schätzung auf Basis von Verbrauch, PV-Größe, Strompreis und Eigenverbrauch. Die Werte sind bewusst als Spanne für die Erstberatung gedacht.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="border border-[#808080]/20 bg-white shadow-xl shadow-slate-900/5">
              <CardContent className="space-y-7 p-6 md:p-8">
                <InputNumber label="Jährlicher Stromverbrauch" value={consumption} suffix="kWh" onChange={setConsumption} />
                <SliderBlock label="PV-Anlagengröße" value={pvSize} min={3} max={20} step={0.5} suffix="kWp" helper="Typische Einfamilienhäuser liegen oft zwischen 5 und 12 kWp." onChange={setPvSize} />
                <SliderBlock label="Eigenverbrauchsanteil" value={selfUseRate} min={25} max={80} step={1} suffix="%" helper="Mit Speicher steigt der Eigenverbrauch deutlich." onChange={setSelfUseRate} />
                <SliderBlock label="Strompreis" value={electricityPrice} min={18} max={45} step={1} suffix="ct/kWh" helper="Kann je nach Stromtarif und Standort angepasst werden." onChange={setElectricityPrice} />
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-[#0F172A] text-white shadow-2xl shadow-slate-900/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.18em] text-green-200">geschätzter Vorteil/Jahr</div>
                    <div className="mt-2 font-display text-5xl font-extrabold tracking-[-0.05em] text-white">{formatEuro(result.yearlyBenefit)}</div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#22C55E] text-white"><LineChart className="h-7 w-7" /></div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Metric label="PV-Ertrag/Jahr" value={`${formatNumber(result.annualYield)} kWh`} />
                  <Metric label="Eigenverbrauch" value={`${formatNumber(result.selfUsed)} kWh`} success />
                  <Metric label="Direkte Ersparnis" value={formatEuro(result.savings)} success />
                  <Metric label="Einspeisewert" value={formatEuro(result.feedInValue)} />
                </div>

                <div className="mt-7 grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 md:grid-cols-2">
                  <Metric label="10 Jahre Potenzial" value={formatEuro(result.tenYears)} success />
                  <Metric label="20 Jahre Potenzial" value={formatEuro(result.twentyYears)} success />
                </div>

                <div className="mt-7 rounded-[1.75rem] border border-[#F97316]/30 bg-[#F97316]/10 p-5 text-sm leading-relaxed text-orange-50">
                  <div className="mb-2 flex items-center gap-2 font-extrabold"><ShieldCheck className="h-5 w-5" /> Wichtig für die Beratung</div>
                  Die tatsächliche Ersparnis hängt von Dachausrichtung, Lastprofil, Speichergröße, Strompreis und Anlagenqualität ab. Darum führt der Rechner direkt in eine qualifizierte Anfrage.
                </div>

                <Button asChild className="mt-7 h-14 rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white hover:bg-orange-600">
                  <Link to={offerUrl}>Ersparnis prüfen lassen <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <InfoCard icon={<Zap className="h-6 w-6" />} title="Eigenverbrauch ist der Hebel" text="Je mehr PV-Strom direkt im Haus genutzt wird, desto stärker wirkt die Ersparnis." />
              <InfoCard icon={<Euro className="h-6 w-6" />} title="Strompreis entscheidet mit" text="Je höher der Netzstrompreis, desto stärker fällt die direkte Kostenersparnis aus." />
              <InfoCard icon={<CheckCircle2 className="h-6 w-6" />} title="Speicher separat prüfen" text="Ein Speicher erhöht die Autarkie, muss aber wirtschaftlich zur Anlage passen." />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InputNumber({ label, value, suffix, onChange }: { label: string; value: number; suffix: string; onChange: (value: number) => void }) {
  return <div className="space-y-2"><Label className="font-bold text-[#0F172A]">{label}</Label><div className="relative"><Input value={value} inputMode="numeric" onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, "")) || 0)} className="h-12 rounded-2xl border-[#808080]/25 pr-16 text-lg font-extrabold" /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">{suffix}</span></div></div>;
}

function SliderBlock({ label, value, min, max, step, suffix, helper, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; helper: string; onChange: (value: number) => void }) {
  return <div className="space-y-4 rounded-[1.5rem] border border-[#808080]/20 bg-[#F8FAFC] p-5"><div className="flex items-start justify-between gap-4"><div><Label className="font-bold text-[#0F172A]">{label}</Label><p className="mt-1 text-xs leading-relaxed text-slate-500">{helper}</p></div><div className="rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-[#0F172A] shadow-sm">{value} {suffix}</div></div><Slider value={[value]} min={min} max={max} step={step} onValueChange={(values) => onChange(values[0] ?? value)} /></div>;
}

function Metric({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"><div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div><div className={success ? "mt-2 text-2xl font-extrabold text-[#22C55E]" : "mt-2 text-2xl font-extrabold text-white"}>{value}</div></div>;
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <Card className="border border-[#808080]/20 bg-[#F8FAFC]"><CardContent className="p-7"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">{icon}</div><h2 className="font-display text-xl font-extrabold text-[#0F172A]">{title}</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></CardContent></Card>;
}
