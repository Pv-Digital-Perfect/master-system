import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Database, Globe, Link as LinkIcon, Loader2, Save, ShieldCheck, SunMedium, Wrench } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL, DEFAULT_SITE_DESCRIPTION, DEFAULT_SITE_URL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";
import { supabaseUrl } from "@/integrations/supabase/client";
import {
  DEFAULT_PV_SETTINGS,
  type PvCalculatorSettings,
  type PvNumericSettingKey,
  type PvTextSettingKey,
  calculatePvResult,
  formatEuro,
  formatNumber,
  usePvSettings,
  useUpdatePvSettings,
} from "@/hooks/usePvSettings";

const calculatorFields: Array<{ key: PvNumericSettingKey; label: string; suffix: string; helper: string }> = [
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

const textFields: Array<{ key: PvTextSettingKey; label: string; helper: string; multiline?: boolean; placeholder?: string }> = [
  { key: "hero_badge", label: "Hero-Kennzeichnung", helper: "kleiner Text oberhalb der Hauptüberschrift", placeholder: "Photovoltaik Beratung & Planung" },
  { key: "hero_headline", label: "Hero-Hauptüberschrift", helper: "wichtigster Verkaufstext auf der Startseite", multiline: true },
  { key: "hero_subheadline", label: "Hero-Beschreibung", helper: "kurze Erklärung unter der Hauptüberschrift", multiline: true },
  { key: "primary_cta_label", label: "Primärer Button", helper: "Beschriftung des wichtigsten Buttons auf der Startseite" },
  { key: "secondary_cta_label", label: "Zweiter Button", helper: "Beschriftung des Anfrage-Buttons" },
  { key: "service_area_text", label: "Einsatzgebiet", helper: "z. B. Österreich, Oberösterreich, Linz und Umgebung" },
  { key: "company_specialization", label: "Spezialisierung", helper: "Welche PV-Leistungen besonders betont werden sollen", multiline: true },
  { key: "response_time_text", label: "Rückmeldezeit", helper: "wird intern und in der Beratungskommunikation verwendet" },
  { key: "consultation_note", label: "Beratungshinweis", helper: "Hinweis zur unverbindlichen Ersteinschätzung", multiline: true },
  { key: "funding_note", label: "Förderhinweis", helper: "kurzer Hinweis zu Förderprüfung und regionalen Unterschieden", multiline: true },
  { key: "financing_note", label: "Finanzierungshinweis", helper: "optional für Ratenzahlung, Finanzierung oder Zahlungsmodelle", multiline: true },
  { key: "warranty_note", label: "Service-/Garantiehinweis", helper: "Hinweis zu Service, Garantie oder Wartung", multiline: true },
  { key: "appointment_link", label: "Terminlink", helper: "optional: externer Link für Beratungstermine" },
  { key: "lead_receiver_label", label: "Empfänger-Bezeichnung", helper: "z. B. PV-Beratung, Vertrieb, Technik-Team" },
  { key: "trust_primary_text", label: "Trust-Hinweis 1", helper: "kurzer Vertrauenspunkt direkt im Hero" },
  { key: "trust_secondary_text", label: "Trust-Hinweis 2", helper: "zweiter Vertrauenspunkt direkt im Hero" },
  { key: "hero_stat_1_label", label: "Hero-Kachel 1 Titel", helper: "kleine Kachel rechts unter dem Hero-Bild" },
  { key: "hero_stat_1_text", label: "Hero-Kachel 1 Text", helper: "Beschreibung der ersten Hero-Kachel" },
  { key: "hero_stat_2_label", label: "Hero-Kachel 2 Titel", helper: "kleine Kachel rechts unter dem Hero-Bild" },
  { key: "hero_stat_2_text", label: "Hero-Kachel 2 Text", helper: "Beschreibung der zweiten Hero-Kachel" },
  { key: "hero_stat_3_label", label: "Hero-Kachel 3 Titel", helper: "kleine Kachel rechts unter dem Hero-Bild" },
  { key: "hero_stat_3_text", label: "Hero-Kachel 3 Text", helper: "Beschreibung der dritten Hero-Kachel" },
  { key: "decision_section_badge", label: "Abschnitt Planung: Badge", helper: "kleiner grüner Text über dem Planungsabschnitt" },
  { key: "decision_section_headline", label: "Abschnitt Planung: Überschrift", helper: "Hauptüberschrift im Planungsabschnitt", multiline: true },
  { key: "decision_section_text", label: "Abschnitt Planung: Beschreibung", helper: "Beschreibung im Planungsabschnitt", multiline: true },
  { key: "process_section_badge", label: "Abschnitt Ablauf: Badge", helper: "kleiner Text über dem Ablaufabschnitt" },
  { key: "process_section_headline", label: "Abschnitt Ablauf: Überschrift", helper: "Hauptüberschrift im Ablaufabschnitt", multiline: true },
  { key: "process_section_text", label: "Abschnitt Ablauf: Beschreibung", helper: "Beschreibung im Ablaufabschnitt", multiline: true },
  { key: "final_cta_badge", label: "Abschluss-CTA: Kennzeichnung", helper: "kleiner Hinweis im dunklen Abschlussbereich" },
  { key: "final_cta_headline", label: "Abschluss-CTA: Überschrift", helper: "Hauptüberschrift im Abschlussbereich", multiline: true },
  { key: "final_cta_text", label: "Abschluss-CTA: Beschreibung", helper: "Beschreibung im Abschlussbereich", multiline: true },
  { key: "final_primary_cta_label", label: "Abschluss-CTA: Button 1", helper: "Button zum PV-Rechner" },
  { key: "final_secondary_cta_label", label: "Abschluss-CTA: Button 2", helper: "Button zum Anfrageformular" },
];

const previewInput = {
  annualConsumptionKwh: 5200,
  roofAreaSqm: 58,
  includeStorage: true,
  includeWallbox: true,
};

export default function AdminSettings() {
  const { data: settings, isLoading, isError, error } = usePvSettings();
  const updateSettings = useUpdatePvSettings();
  const [form, setForm] = useState<PvCalculatorSettings>(DEFAULT_PV_SETTINGS);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const preview = useMemo(() => calculatePvResult({ ...previewInput, settings: form }), [form]);

  const updateNumber = (key: PvNumericSettingKey, value: string) => {
    const normalized = value.replace(",", ".");
    setForm((current) => ({ ...current, [key]: normalized === "" ? 0 : Number(normalized) }));
  };

  const updateText = (key: PvTextSettingKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast.success("Einstellungen gespeichert.");
    } catch (saveError) {
      console.error(saveError);
      toast.error("Einstellungen konnten nicht gespeichert werden. Prüfe pv_settings, neue Spalten und RLS.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Einstellungen</h2>
          <p className="text-muted-foreground">Website-Texte, Angebotsprozess, Rechnerwerte und sichtbare Startseiten-Inhalte für die PV-Beratung.</p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="rounded-full bg-orange-500 font-black text-white hover:bg-orange-600">
          {updateSettings.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Einstellungen speichern
        </Button>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-emerald-600" /> Website-Basis</CardTitle>
            <CardDescription>Diese Werte kommen aus der Live-Konfiguration und werden auf der Website angezeigt.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Brand</Label><Input readOnly value={DEFAULT_BRAND_NAME} /></div>
            <div className="space-y-2"><Label>Website URL</Label><Input readOnly value={DEFAULT_SITE_URL} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Beschreibung</Label><Input readOnly value={DEFAULT_SITE_DESCRIPTION} /></div>
            <div className="space-y-2"><Label>Kontakt E-Mail</Label><Input readOnly value={DEFAULT_CONTACT_EMAIL} /></div>
            <div className="space-y-2"><Label>Telefon</Label><Input readOnly value={siteConfig.contact.phone || "Nicht gesetzt"} /></div>
            <div className="space-y-2"><Label>Betreiber</Label><Input readOnly value={siteConfig.legal.operatorName} /></div>
            <div className="space-y-2"><Label>Adresse</Label><Input readOnly value={siteConfig.contact.addressLines.join(", ") || "Nicht gesetzt"} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-orange-500" /> Datenbank</CardTitle>
            <CardDescription>Geschützte Verbindung für Anfragen, Status und interne Notizen.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Datenbank URL</Label><Input readOnly value={supabaseUrl || "Nicht gesetzt"} /></div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="mb-2 flex items-center gap-2 font-black"><ShieldCheck className="h-4 w-4" /> Sicherheitsmodus aktiv</div>
              Öffentliche Besucher können Anfragen senden. Verwaltung, Status und Notizen sind nur nach Login zugänglich.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><SunMedium className="h-5 w-5 text-orange-500" /> Website-Texte & Angebotsprozess</CardTitle>
          <CardDescription>Diese Felder steuern die wichtigsten sichtbaren Website-Inhalte direkt aus dem Admin.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          {textFields.map((field) => (
            <div key={field.key} className={field.multiline ? "space-y-2 lg:col-span-2" : "space-y-2"}>
              <Label htmlFor={field.key}>{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  id={field.key}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateText(field.key, event.target.value)}
                  placeholder={field.placeholder}
                  className="min-h-24"
                />
              ) : (
                <Input
                  id={field.key}
                  value={String(form[field.key] ?? "")}
                  onChange={(event) => updateText(field.key, event.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">{field.helper}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5 text-orange-500" /> PV-Rechner Preisbasis</CardTitle>
          <CardDescription>Diese Werte steuern Investitionsspanne, Ersparnis und Amortisationsrichtung im Frontend-Rechner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="flex items-center gap-2 rounded-2xl border border-border p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Einstellungen werden geladen …</div>
          ) : null}

          {isError ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-900">
              Tabelle <strong>pv_settings</strong> ist noch nicht erreichbar oder hat nicht alle benötigten Spalten. Fallback-Werte sind aktiv. Meldung: {String((error as Error)?.message || "unbekannt")}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {calculatorFields.map((field) => (
              <div key={field.key} className="space-y-2 rounded-2xl border border-border bg-background p-4">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="flex items-center gap-2">
                  <Input id={field.key} type="number" step="0.01" value={Number(form[field.key] ?? 0)} onChange={(event) => updateNumber(field.key, event.target.value)} />
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
          <CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-emerald-600" /> Rechner-Vorschau</CardTitle>
          <CardDescription>Beispiel mit 5.200 kWh Jahresverbrauch, 58 m² Dachfläche, Speicher und Wallbox.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Preview label="Empfohlene Leistung" value={`${formatNumber(preview.recommendedKwp)} kWp`} />
          <Preview label="Jahresproduktion" value={`${formatNumber(preview.annualProduction)} kWh`} />
          <Preview label="Investition" value={`${formatEuro(preview.totalCostMin)} – ${formatEuro(preview.totalCostMax)}`} />
          <Preview label="Amortisation" value={preview.paybackMinYears ? `${formatNumber(preview.paybackMinYears)} – ${formatNumber(preview.paybackMaxYears || preview.paybackMinYears)} Jahre` : "nicht berechenbar"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5 text-slate-700" /> Bearbeitbare Bereiche</CardTitle>
          <CardDescription>Aktuell direkt pflegbar: Startseiten-Texte, CTA-Beschriftungen, Angebotsprozess, Beratungshinweise und Rechnerwerte.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Badge variant="outline" className="justify-center rounded-full py-2">Startseite</Badge>
          <Badge variant="outline" className="justify-center rounded-full py-2">Anfrageprozess</Badge>
          <Badge variant="outline" className="justify-center rounded-full py-2">PV-Rechner</Badge>
          <Badge variant="outline" className="justify-center rounded-full py-2">Beratungshinweise</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

function Preview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-black text-foreground">{value}</div>
    </div>
  );
}
