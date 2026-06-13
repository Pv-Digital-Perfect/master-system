import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Database, Globe, KeyRound, Loader2, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_URL } from "@/lib/constants";
import { supabaseUrl } from "@/integrations/supabase/client";
import { DEFAULT_PV_SETTINGS, PvCalculatorSettings, usePvSettings, useUpdatePvSettings } from "@/hooks/usePvSettings";

type NumericSettingKey = Exclude<keyof PvCalculatorSettings, "id" | "updated_at">;

const calculatorFields: Array<{ key: NumericSettingKey; label: string; suffix: string; helper: string }> = [
  { key: "price_per_kwp_min", label: "PV Preis pro kWp min.", suffix: "€/kWp", helper: "untere Investitionsspanne für Module, Wechselrichter, Montage" },
  { key: "price_per_kwp_max", label: "PV Preis pro kWp max.", suffix: "€/kWp", helper: "obere Investitionsspanne inkl. Puffer" },
  { key: "storage_price_per_kwh_min", label: "Speicherpreis pro kWh min.", suffix: "€/kWh", helper: "untere Richtwert-Spanne für Batteriespeicher" },
  { key: "storage_price_per_kwh_max", label: "Speicherpreis pro kWh max.", suffix: "€/kWh", helper: "obere Richtwert-Spanne für Batteriespeicher" },
  { key: "wallbox_price_min", label: "Wallbox min.", suffix: "€", helper: "einfache Wallbox inkl. Basisinstallation" },
  { key: "wallbox_price_max", label: "Wallbox max.", suffix: "€", helper: "Wallbox mit höherem Installationsaufwand" },
  { key: "electricity_price_per_kwh", label: "Strompreis", suffix: "€/kWh", helper: "Basis für Eigenverbrauchs-Ersparnis" },
  { key: "feed_in_tariff_per_kwh", label: "Einspeisetarif", suffix: "€/kWh", helper: "grober Wert für eingespeisten Überschuss" },
  { key: "annual_yield_per_kwp", label: "Jahresertrag", suffix: "kWh/kWp", helper: "AT-Richtwert ohne Standort-API" },
  { key: "module_area_per_kwp", label: "Dachfläche pro kWp", suffix: "m²/kWp", helper: "Faustformel für Dachpotenzial" },
  { key: "self_consumption_without_storage", label: "Eigenverbrauch ohne Speicher", suffix: "0–1", helper: "z. B. 0.36 = 36 %" },
  { key: "self_consumption_with_storage", label: "Eigenverbrauch mit Speicher", suffix: "0–1", helper: "z. B. 0.62 = 62 %" },
  { key: "default_storage_ratio", label: "Speicherfaktor", suffix: "kWh/kWp", helper: "Speichergröße relativ zur Anlagenleistung" },
  { key: "planning_buffer_percent", label: "Planungspuffer", suffix: "%", helper: "Aufschlag auf Maximalwerte wegen Dach/Elektrik/Montage" },
];

export default function AdminSettings() {
  const { data: settings, isLoading, isError, error } = usePvSettings();
  const updateSettings = useUpdatePvSettings();
  const [form, setForm] = useState<PvCalculatorSettings>(DEFAULT_PV_SETTINGS);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateNumber = (key: NumericSettingKey, value: string) => {
    const normalized = value.replace(",", ".");
    setForm((current) => ({ ...current, [key]: normalized === "" ? 0 : Number(normalized) }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast.success("PV-Rechner-Einstellungen gespeichert.");
    } catch (saveError) {
      console.error(saveError);
      toast.error("Einstellungen konnten nicht gespeichert werden. Prüfe Tabelle pv_settings und RLS.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Einstellungen</h2>
          <p className="text-muted-foreground">Systemstatus, Supabase-Verbindung und Preisbasis für den PV-Rechner.</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="rounded-full bg-orange-500 font-black text-white hover:bg-orange-600">
          {updateSettings.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Einstellungen speichern
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-emerald-600" /> Website-Basis</CardTitle>
            <CardDescription>Diese Werte kommen aus deiner lokalen <code>.env</code>.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Brand</Label><Input readOnly value={DEFAULT_BRAND_NAME} /></div>
            <div className="space-y-2"><Label>Website URL</Label><Input readOnly value={DEFAULT_SITE_URL} /></div>
            <div className="space-y-2"><Label>Beschreibung</Label><Input readOnly value={DEFAULT_SITE_DESCRIPTION} /></div>
            <div className="space-y-2"><Label>Kontakt E-Mail</Label><Input readOnly value={DEFAULT_CONTACT_EMAIL} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-orange-500" /> Supabase</CardTitle>
            <CardDescription>Neue PV-Datenbank ohne TierTarif-Abhängigkeit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Project URL</Label><Input readOnly value={supabaseUrl || "Nicht gesetzt"} /></div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="mb-2 flex items-center gap-2 font-black"><ShieldCheck className="h-4 w-4" /> Aktiver Sicherheitsmodus</div>
              Admin-Zugriff läuft über Supabase Auth. Leads werden öffentlich nur erstellt und im Admin nur nach Login gelesen/bearbeitet.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-orange-500" /> PV-Rechner Preisbasis</CardTitle>
          <CardDescription>
            Diese Werte steuern die Investitionsspanne, Ersparnis und Amortisationsrichtung im Frontend-Rechner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-2xl border border-border p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Einstellungen werden geladen …</div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-900">
              Tabelle <strong>pv_settings</strong> ist noch nicht erreichbar. Fallback-Werte sind aktiv. Meldung: {String((error as Error)?.message || "unbekannt")}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {calculatorFields.map((field) => (
              <div key={field.key} className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={field.key}
                    type="number"
                    step="0.01"
                    value={Number(form[field.key] ?? 0)}
                    onChange={(event) => updateNumber(field.key, event.target.value)}
                  />
                  <span className="min-w-16 text-xs font-bold text-muted-foreground">{field.suffix}</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{field.helper}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5 text-slate-700" /> Nächste Ausbaustufe</CardTitle>
          <CardDescription>Nach dem Rechner kommen White-Label-Felder, Kalenderlink und Mail-Benachrichtigung.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Badge variant="outline" className="justify-center rounded-full py-2">White-Label Felder</Badge>
          <Badge variant="outline" className="justify-center rounded-full py-2">Kalenderlink</Badge>
          <Badge variant="outline" className="justify-center rounded-full py-2">E-Mail-Benachrichtigung</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
