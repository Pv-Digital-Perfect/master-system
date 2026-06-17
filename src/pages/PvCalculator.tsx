import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BadgeEuro,
  BatteryCharging,
  Calculator,
  CarFront,
  CheckCircle2,
  Euro,
  Home,
  Info,
  Loader2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  SunMedium,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_PV_SETTINGS, calculatePvResult, formatEuro, formatNumber, usePvSettings } from "@/hooks/usePvSettings";

const clampSliderValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PvCalculator() {
  const { data: settings, isLoading } = usePvSettings();
  const [consumption, setConsumption] = useState(4500);
  const [roofArea, setRoofArea] = useState(55);
  const [storage, setStorage] = useState("yes");
  const [wallbox, setWallbox] = useState("no");

  const activeSettings = settings || DEFAULT_PV_SETTINGS;

  const result = useMemo(() => {
    return calculatePvResult({
      annualConsumptionKwh: consumption,
      roofAreaSqm: roofArea,
      includeStorage: storage === "yes",
      includeWallbox: wallbox === "yes",
      settings: activeSettings,
    });
  }, [activeSettings, consumption, roofArea, storage, wallbox]);

  const offerUrl = `/angebot-anfordern?consumption=${encodeURIComponent(String(consumption))}&roofArea=${encodeURIComponent(String(roofArea))}&storage=${storage}&wallbox=${wallbox}`;
  const roofUsagePercent = Math.round((result.recommendedKwp / Math.max(result.roofPotentialKwp, 1)) * 100);
  const selfUsePercent = Math.round(result.selfUseRate * 100);
  const averageInvestment = Math.round((result.totalCostMin + result.totalCostMax) / 2);
  const paybackLabel = result.paybackMinYears && result.paybackMaxYears
    ? `${formatNumber(result.paybackMinYears)} – ${formatNumber(result.paybackMaxYears)} Jahre`
    : "nicht berechenbar";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>PV-Rechner | Photovoltaik Kosten & Ersparnis berechnen</title>
        <meta name="description" content="Moderner PV-Rechner für Photovoltaik-Kosten, Speicher, Wallbox, Ersparnis und Amortisation als unverbindliche Ersteinschätzung." />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="relative isolate hidden overflow-hidden bg-[#0F172A] text-white md:block">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(249,115,22,0.22),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(34,197,94,0.14),transparent_24%),linear-gradient(135deg,#0F172A_0%,#111827_52%,#10231D_100%)]" />
          <div className="absolute left-8 top-10 -z-10 h-72 w-72 rounded-full bg-[#F97316]/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 -z-10 h-80 w-80 rounded-full bg-[#22C55E]/10 blur-3xl" />

          <div className="container mx-auto grid gap-10 px-4 py-14 md:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#808080]/25 bg-white/[0.06] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200 backdrop-blur">
                <Sparkles className="h-4 w-4" /> Premium PV-Kostencheck
              </div>
              <h1 className="max-w-4xl font-display text-4xl font-extrabold tracking-[-0.04em] text-white md:text-6xl">
                Photovoltaik-Kosten elegant berechnen – ohne unseriöse Fixpreis-Versprechen.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
                Der Rechner liefert eine klare Investitionsspanne, geschätzten Jahresvorteil und eine grobe Amortisation. Genau richtig als hochwertiger Einstieg in eine persönliche PV-Beratung.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <TrustPill icon={<ShieldCheck className="h-4 w-4" />} label="Unverbindlich" />
                <TrustPill icon={<BadgeEuro className="h-4 w-4" />} label="Marktnahe Werte" />
                <TrustPill icon={<Zap className="h-4 w-4" />} label="Leadstark" />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#808080]/25 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-5">
              <div className="rounded-[1.5rem] border border-[#808080]/20 bg-white p-5 text-[#0F172A] shadow-xl md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Live-Ergebnis</p>
                    <h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A]">{formatEuro(averageInvestment)}</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-lg shadow-orange-500/25">
                    <Calculator className="h-7 w-7" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Durchschnitt aus aktueller Investitionsspanne. Final abhängig von Dach, Elektrik, Zählerkasten, Gerüst und Produktauswahl.
                </p>
                <div className="mt-5 grid gap-3">
                  <MiniMetric label="Anlagengröße" value={`${formatNumber(result.recommendedKwp)} kWp`} />
                  <MiniMetric label="Jahresertrag" value={`${result.annualProduction.toLocaleString("de-AT")} kWh`} />
                  <MiniMetric label="Vorteil pro Jahr" value={formatEuro(result.estimatedBenefitPerYear)} success />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-5 md:py-14">
          <div className="mb-5 rounded-[1.5rem] border border-[#808080]/20 bg-white p-4 shadow-sm md:hidden">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#F97316]/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#EA580C]">
              <Calculator className="h-4 w-4" /> PV-Rechner
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-[-0.035em] text-[#0F172A]">Daten eingeben, Ergebnis sofort sehen.</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">Stromverbrauch, Dachfläche, Speicher und Wallbox auswählen — die Schätzung aktualisiert sich direkt.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="overflow-hidden border border-[#808080]/20 bg-white shadow-2xl shadow-slate-900/10">
              <CardContent className="p-0">
                <div className="border-b border-[#808080]/20 bg-gradient-to-r from-white via-orange-50/60 to-emerald-50/80 p-5 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F97316] text-white shadow-lg shadow-orange-500/20">
                      <SlidersHorizontal className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-2xl">Ihre Eckdaten</h2>
                      <p className="text-sm text-slate-500">Sofort berechnet, sauber lesbar, ohne Seitenreload.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-5 md:space-y-6 md:p-8">
                  <CalculatorSlider
                    icon={<Zap className="h-5 w-5" />}
                    label="Jährlicher Stromverbrauch"
                    value={consumption}
                    min={1500}
                    max={12000}
                    step={100}
                    suffix="kWh"
                    helper="Typisches Einfamilienhaus: ca. 3.500–6.000 kWh/Jahr."
                    onChange={setConsumption}
                  />

                  <CalculatorSlider
                    icon={<Home className="h-5 w-5" />}
                    label="Geeignete Dachfläche"
                    value={roofArea}
                    min={20}
                    max={160}
                    step={5}
                    suffix="m²"
                    helper="Nur sinnvolle, möglichst verschattungsarme Fläche eintragen."
                    onChange={setRoofArea}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <OptionSelect
                      icon={<BatteryCharging className="h-5 w-5" />}
                      label="Batteriespeicher"
                      value={storage}
                      onValueChange={setStorage}
                      options={[{ value: "yes", label: "Ja, mit Speicher" }, { value: "no", label: "Nein, ohne Speicher" }]}
                    />
                    <OptionSelect
                      icon={<CarFront className="h-5 w-5" />}
                      label="Wallbox"
                      value={wallbox}
                      onValueChange={setWallbox}
                      options={[{ value: "yes", label: "Ja, mit Wallbox" }, { value: "no", label: "Nein, ohne Wallbox" }]}
                    />
                  </div>

                  <div className="rounded-3xl border border-[#F97316]/25 bg-[#F97316]/10 p-5 text-sm leading-relaxed text-[#7C2D12]">
                    <div className="mb-2 flex items-center gap-2 font-extrabold text-[#0F172A]"><Info className="h-5 w-5 text-[#F97316]" /> Kein Fixangebot</div>
                    Die Berechnung ist eine hochwertige Orientierung für die Erstberatung. Ein seriöser Endpreis braucht Dachprüfung, Netzanschluss, Elektrocheck und Produktauswahl.
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-[#808080]/20 bg-[#0F172A] text-white shadow-2xl shadow-slate-900/25">
              <CardContent className="relative p-0">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#F97316]/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#22C55E]/10 blur-3xl" />

                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Ihre Ersteinschätzung</p>
                      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white md:text-4xl">{formatEuro(result.totalCostMin)} – {formatEuro(result.totalCostMax)}</h2>
                      <p className="mt-2 text-sm text-slate-300">Investitionsspanne inkl. gewählter Zusatzmodule.</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#808080]/25 bg-white/[0.06]">
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-orange-200" /> : <SunMedium className="h-7 w-7 text-orange-200" />}
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Result label="Empfohlene Größe" value={`${formatNumber(result.recommendedKwp)} kWp`} icon={<SunMedium className="h-5 w-5" />} />
                    <Result label="Jahresproduktion" value={`${result.annualProduction.toLocaleString("de-AT")} kWh`} icon={<Zap className="h-5 w-5" />} />
                    <Result label="Ersparnis/Vorteil p. a." value={formatEuro(result.estimatedBenefitPerYear)} icon={<TrendingUp className="h-5 w-5" />} highlight />
                    <Result label="Amortisation grob" value={paybackLabel} icon={<Euro className="h-5 w-5" />} />
                  </div>

                  <div className="mt-6 grid gap-4 rounded-[1.75rem] border border-[#808080]/20 bg-white/[0.04] p-5 md:grid-cols-2">
                    <ProgressMetric label="Dachpotenzial genutzt" value={clampSliderValue(roofUsagePercent, 0, 100)} />
                    <ProgressMetric label="Eigenverbrauch geschätzt" value={clampSliderValue(selfUsePercent, 0, 100)} />
                  </div>

                  <div className="mt-6 grid gap-3 rounded-[1.75rem] border border-[#808080]/20 bg-white/[0.04] p-5 text-sm leading-relaxed text-slate-200 md:grid-cols-3">
                    <Detail label="PV-Anlage" value={`${formatEuro(result.pvCostMin)} – ${formatEuro(result.pvCostMax)}`} />
                    <Detail label="Speicher" value={storage === "yes" ? `${result.storageSize} kWh · ${formatEuro(result.storageCostMin)} – ${formatEuro(result.storageCostMax)}` : "nicht gewählt"} />
                    <Detail label="Wallbox" value={wallbox === "yes" ? `${formatEuro(result.wallboxCostMin)} – ${formatEuro(result.wallboxCostMax)}` : "nicht gewählt"} />
                  </div>

                  <div className="mt-7 rounded-[1.75rem] border border-[#22C55E]/30 bg-[#22C55E]/10 p-5">
                    <div className="mb-3 flex items-center gap-2 font-extrabold text-green-200"><CheckCircle2 className="h-5 w-5" /> Nächster sinnvoller Schritt</div>
                    <p className="text-sm leading-relaxed text-slate-200">
                      Lassen Sie Dach, Stromverbrauch und Speicherbedarf kurz prüfen. Danach kann ein Anbieter die Schätzung in ein konkretes Angebot übersetzen.
                    </p>
                  </div>

                  <Button asChild className="mt-8 h-14 w-full rounded-full bg-[#F97316] px-8 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 hover:bg-orange-600 md:w-auto">
                    <Link to={offerUrl}>Kostenlose Beratung sichern <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function TrustPill({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#808080]/25 bg-white/[0.06] px-4 py-3 text-sm font-bold text-slate-100 backdrop-blur">{icon}{label}</div>;
}

function MiniMetric({ label, value, success = false }: { label: string; value: string; success?: boolean }) {
  return <div className="flex items-center justify-between rounded-2xl border border-[#808080]/10 bg-[#F8FAFC] px-4 py-3"><span className="text-sm text-slate-500">{label}</span><strong className={success ? "text-[#22C55E]" : "text-[#0F172A]"}>{value}</strong></div>;
}

function CalculatorSlider({ icon, label, value, min, max, step, suffix, helper, onChange }: { icon: ReactNode; label: string; value: number; min: number; max: number; step: number; suffix: string; helper: string; onChange: (value: number) => void }) {
  return (
    <div className="space-y-4 rounded-[1.5rem] border border-[#808080]/20 bg-[#F8FAFC] p-4 md:rounded-[1.75rem] md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#F97316] shadow-sm ring-1 ring-[#808080]/10">{icon}</div>
          <div>
            <Label className="font-display text-base font-extrabold text-[#0F172A]">{label}</Label>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{helper}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 rounded-2xl border border-[#808080]/20 bg-white px-3 py-2 shadow-sm sm:w-36">
          <Input type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(clampSliderValue(Number(event.target.value) || min, min, max))} className="h-8 border-0 p-0 text-right text-lg font-extrabold text-[#0F172A] shadow-none focus-visible:ring-0" />
          <span className="text-xs font-bold text-slate-500">{suffix}</span>
        </div>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(next) => onChange(next[0])} className="[&_[role=slider]]:border-[#F97316] [&_[role=slider]]:bg-white" />
    </div>
  );
}

function OptionSelect({ icon, label, value, onValueChange, options }: { icon: ReactNode; label: string; value: string; onValueChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <div className="rounded-[1.5rem] border border-[#808080]/20 bg-[#F8FAFC] p-4 md:rounded-[1.75rem] md:p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#F97316] shadow-sm ring-1 ring-[#808080]/10">{icon}</div>
        <Label className="font-display text-base font-extrabold text-[#0F172A]">{label}</Label>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 rounded-2xl border-[#808080]/20 bg-white text-[#0F172A]"><SelectValue /></SelectTrigger>
        <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

function Result({ label, value, icon, highlight = false }: { label: string; value: string; icon: ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] border p-5 ${highlight ? "border-[#22C55E]/30 bg-[#22C55E]/10" : "border-[#808080]/20 bg-white/[0.04]"}`}>
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-2xl ${highlight ? "bg-[#22C55E]/20 text-green-200" : "bg-white/[0.07] text-orange-200"}`}>{icon}</div>
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-2 font-display text-2xl font-extrabold tracking-[-0.03em] text-white md:text-3xl">{value}</div>
    </div>
  );
}

function ProgressMetric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm"><span className="text-slate-300">{label}</span><strong className="text-white">{value}%</strong></div>
      <Progress value={value} className="h-2 bg-white/10 [&>div]:bg-[#22C55E]" />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">{label}</div><div className="mt-2 font-bold text-white">{value}</div></div>;
}
