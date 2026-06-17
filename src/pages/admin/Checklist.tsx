import { CheckCircle2, CircleAlert, ClipboardCheck, ExternalLink, Rocket, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/siteConfig";
import { activePackageFeatures, activePackageLabel, externalToolLinks, lockedPublicPageLinks } from "@/config/adminConfig";
import { featureLabels } from "@/config/packageConfig";
import { usePvSettings } from "@/hooks/usePvSettings";

function isFilled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

type CheckItem = {
  label: string;
  ok: boolean;
  hint: string;
  critical?: boolean;
};

function StatusIcon({ ok, critical }: { ok: boolean; critical?: boolean }) {
  if (ok) return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
  return <CircleAlert className={critical ? "h-5 w-5 text-red-600" : "h-5 w-5 text-orange-500"} />;
}

function CheckListCard({ title, items }: { title: string; items: CheckItem[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex gap-3 rounded-2xl border border-border p-4">
            <StatusIcon ok={item.ok} critical={item.critical} />
            <div>
              <div className="font-black text-foreground">{item.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function AdminChecklist() {
  const { data: settings } = usePvSettings();

  const legalChecks: CheckItem[] = [
    { label: "Betreibername", ok: isFilled(siteConfig.legal.operatorName), hint: "Wird im Impressum und in der Datenschutzerklärung verwendet.", critical: true },
    { label: "Kontakt-E-Mail", ok: isFilled(siteConfig.contact.email), hint: "Wird im Kontaktbereich, Footer und auf Rechtstext-Seiten angezeigt.", critical: true },
    { label: "Live-Domain", ok: siteConfig.siteUrl === "https://pv-system.digital-perfect.com" || siteConfig.siteUrl === "https://pv-system.digital-perfect.com/" || isFilled(siteConfig.siteUrl), hint: `Aktive Domain: ${siteConfig.siteUrl}`, critical: true },
    { label: "Adresse", ok: isFilled(siteConfig.contact.addressLines), hint: "Für Impressum, Vertrauen und regionale Einordnung wichtig.", critical: true },
    { label: "Telefon", ok: isFilled(siteConfig.contact.phone), hint: "Empfohlen für stärkere Conversion und schnellere Rückfragen." },
    { label: "UID / Firmenbuch", ok: isFilled(siteConfig.legal.vatId) || isFilled(siteConfig.legal.companyRegister), hint: "Je nach Unternehmensform ergänzen." },
    { label: "Behörde / Kammer", ok: isFilled(siteConfig.legal.authority) || isFilled(siteConfig.legal.professionalBody), hint: "Für österreichische Unternehmensseiten häufig relevant." },
  ];

  const contentChecks: CheckItem[] = [
    { label: "Hero-Überschrift", ok: isFilled(settings?.hero_headline), hint: "Startseite hat einen gepflegten Hauptverkaufstext.", critical: true },
    { label: "Hero-Beschreibung", ok: isFilled(settings?.hero_subheadline), hint: "Startseite erklärt Leistung, Nutzen und Anfrage sauber.", critical: true },
    { label: "Einsatzgebiet", ok: isFilled(settings?.service_area_text), hint: "Regionale Ausrichtung ist in den Einstellungen gepflegt." },
    { label: "Spezialisierung", ok: isFilled(settings?.company_specialization), hint: "PV, Speicher, Wallbox und Beratung sind klar beschrieben." },
    { label: "Rückmeldezeit", ok: isFilled(settings?.response_time_text), hint: "Interessenten sehen bzw. Betreiber kennen die erwartete Reaktionszeit." },
    { label: "Terminlink", ok: isFilled(settings?.appointment_link), hint: "Optional: Link zu Terminbuchung oder Beratungskalender." },
  ];

  const technicalChecks: CheckItem[] = [
    { label: "Datenbankverbindung", ok: Boolean(import.meta.env.VITE_SUPABASE_URL && (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)), hint: "Website ist mit der richtigen Lead-Datenbank verbunden.", critical: true },
    { label: "Paket gesetzt", ok: Boolean(import.meta.env.VITE_PACKAGE_TIER), hint: `Aktives Paket: ${activePackageLabel}.`, critical: true },
    { label: "OG-Bild", ok: isFilled(siteConfig.seo.ogImage), hint: "Wichtig für Vorschauen in Social Media und Messenger-Links." },
    { label: "Weitere Verwaltungslinks", ok: externalToolLinks.length > 0, hint: "Optional: zusätzliche Verwaltungsbereiche können direkt verlinkt werden." },
  ];

  const liveChecks: CheckItem[] = [
    { label: "Anfrageformular testen", ok: false, hint: "Nach Änderungen immer eine Testanfrage absenden und Danke-Seite prüfen.", critical: true },
    { label: "Mailzustellung prüfen", ok: false, hint: "Betreiber-Mail muss ankommen und im Mailstatus sichtbar sein.", critical: true },
    { label: "Admin-Leads prüfen", ok: false, hint: "Lead muss im Admin sichtbar sein; Status und Notiz müssen speicherbar sein.", critical: true },
    { label: "Mobile Ansicht prüfen", ok: false, hint: "Hero, Menü, Sticky CTA, Formular und Rechtliches am Handy prüfen." },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl font-black tracking-tight text-foreground">Website-Check</h2>
          <p className="mt-2 text-muted-foreground">Betreiberangaben, Inhalte, Technik und Live-Prüfung für den laufenden PV-Betrieb.</p>
        </div>
        <Badge className="w-fit rounded-full bg-emerald-600 px-4 py-2 text-white">{activePackageLabel}</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CheckListCard title="Betreiber & Rechtliches" items={legalChecks} />
        <CheckListCard title="Website-Inhalte" items={contentChecks} />
        <CheckListCard title="Technik & Verbindung" items={technicalChecks} />
        <CheckListCard title="Live-Prüfung" items={liveChecks} />
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Aktive Funktionen</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activePackageFeatures.map((feature) => <div key={feature} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-950">{featureLabels[feature]}</div>)}
          {lockedPublicPageLinks.map((link) => <div key={link.href} className="rounded-2xl border border-orange-200 bg-orange-50 p-4 font-bold text-orange-950">Nicht aktiv: {link.label}</div>)}
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3 text-emerald-950"><ClipboardCheck className="mt-0.5 h-5 w-5" /><div><div className="font-black">Nächster sinnvoller Prüfschritt</div><p className="mt-1 text-sm text-emerald-900/80">Öffnen Sie die Live-Website, senden Sie eine Testanfrage und prüfen Sie anschließend Lead, Mailstatus und mobile Darstellung.</p></div></div>
          <Button onClick={() => window.open(siteConfig.siteUrl, "_blank", "noopener,noreferrer")} className="rounded-full bg-emerald-700 font-black text-white hover:bg-emerald-800"><Rocket className="mr-2 h-4 w-4" /> Live öffnen <ExternalLink className="ml-2 h-4 w-4" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}
