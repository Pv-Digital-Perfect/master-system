import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, BatteryCharging, CheckCircle2, Home, Moon, SunMedium } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { buildAbsoluteSiteUrl } from "@/lib/routes";
import { formatEuro, usePvSettings } from "@/hooks/usePvSettings";

export default function StorageCalculator() {
  const { data: settings } = usePvSettings();
  const [consumption, setConsumption] = useState(5000);
  const [pvSize, setPvSize] = useState(7);
  const [eveningUsage, setEveningUsage] = useState("medium");

  const result = useMemo(() => {
    const factor = eveningUsage === "high" ? 1.25 : eveningUsage === "low" ? 0.85 : 1;
    const recommended = Math.max(4, Math.round(pvSize * (settings?.default_storage_ratio || 1.1) * factor));
    const minCost = Math.round(recommended * (settings?.storage_price_per_kwh_min || 850));
    const maxCost = Math.round(recommended * (settings?.storage_price_per_kwh_max || 1250) * 1.08);
    const addedSelfUse = eveningUsage === "high" ? 34 : eveningUsage === "low" ? 18 : 26;
    const yearlyExtra = Math.round(Math.min(consumption, pvSize * (settings?.annual_yield_per_kwp || 980)) * (addedSelfUse / 100) * (settings?.electricity_price_per_kwh || 0.27));

    return { recommended, minCost, maxCost, addedSelfUse, yearlyExtra };
  }, [consumption, eveningUsage, pvSize, settings]);

  const offerUrl = `/angebot-anfordern?consumption=${consumption}&storage=yes&source=storage_calculator`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>Stromspeicher Rechner | Speichergröße für PV-Anlage schätzen</title>
        <meta name="description" content="Schätzen Sie unverbindlich, welche Speichergröße zu Stromverbrauch, PV-Anlage und Abendverbrauch passt." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/speicher-rechner")} />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-[#0F172A] via-slate-900 to-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-green-200">Speicher-Rechner</div>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">Welche Speichergröße passt zur PV-Anlage?</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">Der Speicher-Rechner qualifiziert Interessenten, bevor der Anbieter Zeit investiert. Er zeigt eine verständliche Speicherempfehlung ohne verbindliches Angebot zu versprechen.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="border border-[#808080]/20 bg-white shadow-xl shadow-slate-900/5">
              <CardContent className="space-y-7 p-6 md:p-8">
                <SliderBlock label="Jährlicher Stromverbrauch" value={consumption} min={2500} max={18000} step={250} suffix="kWh" onChange={setConsumption} />
                <SliderBlock label="PV-Anlagengröße" value={pvSize} min={3} max={22} step={0.5} suffix="kWp" onChange={setPvSize} />
                <div className="space-y-2">
                  <Label className="font-bold text-[#0F172A]">Verbrauch am Abend / in der Nacht</Label>
                  <Select value={eveningUsage} onValueChange={setEveningUsage}>
                    <SelectTrigger className="h-12 rounded-2xl border-[#808080]/25"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Gering – tagsüber viel Verbrauch</SelectItem>
                      <SelectItem value="medium">Mittel – normaler Haushalt</SelectItem>
                      <SelectItem value="high">Hoch – Homeoffice, Wärmepumpe, E-Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-[#0F172A] text-white shadow-2xl shadow-slate-900/20">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-6">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-[0.18em] text-green-200">empfohlener Speicher</div>
                    <div className="mt-2 font-display text-5xl font-extrabold tracking-[-0.05em] text-white">{result.recommended} kWh</div>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#22C55E] text-white"><BatteryCharging className="h-7 w-7" /></div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Metric icon={<BatteryCharging className="h-5 w-5" />} label="Speicherkosten" value={`${formatEuro(result.minCost)} – ${formatEuro(result.maxCost)}`} />
                  <Metric icon={<SunMedium className="h-5 w-5" />} label="mehr Eigenverbrauch" value={`+ ca. ${result.addedSelfUse} %`} success />
                  <Metric icon={<Moon className="h-5 w-5" />} label="zusätzlicher Jahresvorteil" value={formatEuro(result.yearlyExtra)} success />
                  <Metric icon={<Home className="h-5 w-5" />} label="Nutzung" value="Abend/Nacht optimiert" />
                </div>

                <div className="mt-7 rounded-[1.75rem] border border-[#22C55E]/30 bg-[#22C55E]/10 p-5 text-sm leading-relaxed text-green-50">
                  <div className="mb-2 flex items-center gap-2 font-extrabold"><CheckCircle2 className="h-5 w-5" /> Beratungsrelevant</div>
                  Ein Speicher ist nicht automatisch immer wirtschaftlich. Entscheidend sind Verbrauchsprofil, PV-Größe, Strompreis und gewünschte Unabhängigkeit.
                </div>

                <Button asChild className="mt-7 h-14 rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white hover:bg-orange-600">
                  <Link to={offerUrl}>Speicher prüfen lassen <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SliderBlock({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return <div className="space-y-4 rounded-[1.5rem] border border-[#808080]/20 bg-[#F8FAFC] p-5"><div className="flex items-center justify-between gap-4"><Label className="font-bold text-[#0F172A]">{label}</Label><div className="rounded-2xl bg-white px-4 py-2 text-sm font-extrabold text-[#0F172A] shadow-sm">{value} {suffix}</div></div><Slider value={[value]} min={min} max={max} step={step} onValueChange={(values) => onChange(values[0] ?? value)} /></div>;
}

function Metric({ icon, label, value, success = false }: { icon: ReactNode; label: string; value: string; success?: boolean }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{icon}{label}</div><div className={success ? "mt-2 text-xl font-extrabold text-[#22C55E]" : "mt-2 text-xl font-extrabold text-white"}>{value}</div></div>;
}
