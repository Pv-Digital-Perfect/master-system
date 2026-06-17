import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { notifyLeadByEmail } from "@/lib/leadNotifications";

const PRIVACY_CONSENT_VERSION = "pv-request-2026-06-17";

type PvLeadForm = {
  name: string;
  email: string;
  phone: string;
  postal_code: string;
  city: string;
  ownership_status: string;
  property_type: string;
  roof_type: string;
  roof_area_sqm: string;
  roof_orientation: string;
  roof_age: string;
  meter_cabinet_status: string;
  annual_consumption_kwh: string;
  storage_interest: string;
  wallbox_interest: string;
  timeline: string;
  budget_range: string;
  message: string;
};

const initialForm: PvLeadForm = {
  name: "",
  email: "",
  phone: "",
  postal_code: "",
  city: "",
  ownership_status: "",
  property_type: "",
  roof_type: "",
  roof_area_sqm: "",
  roof_orientation: "",
  roof_age: "",
  meter_cabinet_status: "",
  annual_consumption_kwh: "",
  storage_interest: "",
  wallbox_interest: "",
  timeline: "",
  budget_range: "",
  message: "",
};

export default function OfferRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<PvLeadForm>(() => ({
    ...initialForm,
    annual_consumption_kwh: searchParams.get("consumption") || "",
    storage_interest: searchParams.get("storage") === "yes" ? "yes" : searchParams.get("storage") === "no" ? "no" : "",
    wallbox_interest: searchParams.get("wallbox") === "yes" ? "yes" : searchParams.get("wallbox") === "no" ? "no" : "",
  }));
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof PvLeadForm, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.postal_code || !form.ownership_status || !form.property_type || !form.timeline) {
      toast.error("Bitte fülle Name, E-Mail, Telefon, PLZ, Eigentümerstatus, Immobilientyp und Zeitrahmen aus.");
      return;
    }

    if (!privacyAccepted) {
      toast.error("Bitte bestätige die Datenschutzhinweise, damit wir deine Anfrage bearbeiten dürfen.");
      return;
    }

    setIsSubmitting(true);

    try {
      const annualConsumption = Number(form.annual_consumption_kwh.replace(/[^0-9]/g, "")) || null;
      const roofArea = Number(form.roof_area_sqm.replace(/[^0-9]/g, "")) || null;
      const source = searchParams.get("source") || (searchParams.get("consumption") ? "pv_calculator" : "offer_request");
      const leadId = crypto.randomUUID();

      const { error } = await (supabase.from("pv_leads" as any) as any).insert({
        id: leadId,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        postal_code: form.postal_code,
        city: form.city || null,
        ownership_status: form.ownership_status,
        property_type: form.property_type,
        roof_type: form.roof_type || null,
        roof_area_sqm: roofArea,
        roof_orientation: form.roof_orientation || null,
        roof_age: form.roof_age || null,
        meter_cabinet_status: form.meter_cabinet_status || null,
        annual_consumption_kwh: annualConsumption,
        storage_interest: form.storage_interest || null,
        wallbox_interest: form.wallbox_interest || null,
        timeline: form.timeline,
        budget_range: form.budget_range || null,
        message: form.message || null,
        source,
        lead_status: "new",
        privacy_policy_accepted: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_consent_version: PRIVACY_CONSENT_VERSION,
      });

      if (error) throw error;

      await notifyLeadByEmail({ leadId, source });

      toast.success("Ihre PV-Anfrage wurde erfolgreich übermittelt.");
      navigate("/danke");
    } catch (error) {
      console.error(error);
      toast.error("Die Anfrage konnte gerade nicht übermittelt werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Helmet>
        <title>PV-Angebot anfordern | Photovoltaik Beratung</title>
        <meta name="description" content="Fordere eine strukturierte Photovoltaik-Anfrage an: Eigentümerstatus, Dachart, Dachfläche, Stromverbrauch, Speicherwunsch, Wallbox und Zeitrahmen erfassen." />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="relative overflow-hidden bg-white py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,0.14),transparent_30%),radial-gradient(circle_at_8%_28%,rgba(34,197,94,0.12),transparent_28%)]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 inline-flex rounded-full border border-[#808080]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#F97316]">Kostenlose PV-Anfrage</div>
              <h1 className="font-display text-4xl font-extrabold tracking-[-0.045em] md:text-6xl">Photovoltaik-Angebot anfordern</h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">Mit Ihren Angaben können wir Dach, Verbrauch, Speicherwunsch und Zeitrahmen besser einordnen und Ihnen eine fundierte erste Rückmeldung geben.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <Card className="mx-auto -mt-10 max-w-6xl border border-[#808080]/20 bg-white shadow-2xl shadow-slate-900/10">
            <CardContent className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-9">
                <FormBlock title="Kontakt" description="Damit wir Sie für Rückfragen und die persönliche Rückmeldung erreichen können.">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Name *"><Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Max Mustermann" /></Field>
                    <Field label="E-Mail *"><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="max@beispiel.at" /></Field>
                    <Field label="Telefon *"><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+43 ..." /></Field>
                    <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
                      <Field label="PLZ *"><Input value={form.postal_code} onChange={(e) => update("postal_code", e.target.value)} placeholder="4020" /></Field>
                      <Field label="Ort"><Input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Linz" /></Field>
                    </div>
                  </div>
                </FormBlock>

                <FormBlock title="Objekt & Dach" description="Diese Angaben helfen bei der ersten Einschätzung Ihrer geplanten Photovoltaikanlage.">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Field label="Eigentümerstatus *"><Select value={form.ownership_status} onValueChange={(value) => update("ownership_status", value)}><SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent><SelectItem value="owner">Eigentümer/in</SelectItem><SelectItem value="co_owner">Miteigentümer/in</SelectItem><SelectItem value="tenant">Mieter/in</SelectItem><SelectItem value="company_decision_maker">Entscheider/in im Unternehmen</SelectItem></SelectContent></Select></Field>
                    <Field label="Immobilientyp *"><Select value={form.property_type} onValueChange={(value) => update("property_type", value)}><SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent><SelectItem value="single_family_house">Einfamilienhaus</SelectItem><SelectItem value="multi_family_house">Mehrfamilienhaus</SelectItem><SelectItem value="commercial">Gewerbeobjekt</SelectItem><SelectItem value="farm">Landwirtschaft</SelectItem></SelectContent></Select></Field>
                    <Field label="Dachart"><Select value={form.roof_type} onValueChange={(value) => update("roof_type", value)}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="pitched_roof">Schrägdach</SelectItem><SelectItem value="flat_roof">Flachdach</SelectItem><SelectItem value="unknown">Noch nicht sicher</SelectItem></SelectContent></Select></Field>
                    <Field label="Dachfläche"><Input value={form.roof_area_sqm} onChange={(e) => update("roof_area_sqm", e.target.value)} placeholder="z. B. 55 m²" /></Field>
                    <Field label="Dachausrichtung"><Select value={form.roof_orientation} onValueChange={(value) => update("roof_orientation", value)}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="south">Süd</SelectItem><SelectItem value="east_west">Ost/West</SelectItem><SelectItem value="south_west">Süd-West</SelectItem><SelectItem value="south_east">Süd-Ost</SelectItem><SelectItem value="unknown">Unbekannt</SelectItem></SelectContent></Select></Field>
                    <Field label="Dachalter"><Select value={form.roof_age} onValueChange={(value) => update("roof_age", value)}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="under_10">unter 10 Jahre</SelectItem><SelectItem value="10_25">10–25 Jahre</SelectItem><SelectItem value="over_25">über 25 Jahre</SelectItem><SelectItem value="unknown">Unbekannt</SelectItem></SelectContent></Select></Field>
                  </div>
                </FormBlock>

                <FormBlock title="Verbrauch & Technik" description="Speicher, Wallbox und Zählerschrank entscheiden stark über Aufwand und Nutzen.">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Field label="Stromverbrauch/Jahr"><Input value={form.annual_consumption_kwh} onChange={(e) => update("annual_consumption_kwh", e.target.value)} placeholder="z. B. 4500 kWh" /></Field>
                    <Field label="Speicher gewünscht?"><Select value={form.storage_interest} onValueChange={(value) => update("storage_interest", value)}><SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent><SelectItem value="yes">Ja</SelectItem><SelectItem value="no">Nein</SelectItem><SelectItem value="consultation">Beratung gewünscht</SelectItem></SelectContent></Select></Field>
                    <Field label="Wallbox interessant?"><Select value={form.wallbox_interest} onValueChange={(value) => update("wallbox_interest", value)}><SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent><SelectItem value="yes">Ja</SelectItem><SelectItem value="no">Nein</SelectItem><SelectItem value="later">Vielleicht in Zukunft</SelectItem></SelectContent></Select></Field>
                    <Field label="Zählerschrank"><Select value={form.meter_cabinet_status} onValueChange={(value) => update("meter_cabinet_status", value)}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="modern">modern / neu</SelectItem><SelectItem value="older">älter</SelectItem><SelectItem value="unknown">weiß ich nicht</SelectItem></SelectContent></Select></Field>
                    <Field label="Zeitpunkt *"><Select value={form.timeline} onValueChange={(value) => update("timeline", value)}><SelectTrigger><SelectValue placeholder="Bitte wählen" /></SelectTrigger><SelectContent><SelectItem value="now">Sofort / so schnell wie möglich</SelectItem><SelectItem value="3_months">In den nächsten 3 Monaten</SelectItem><SelectItem value="6_months">In den nächsten 6 Monaten</SelectItem><SelectItem value="research">Erst informieren</SelectItem></SelectContent></Select></Field>
                    <Field label="Budgetrahmen"><Select value={form.budget_range} onValueChange={(value) => update("budget_range", value)}><SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger><SelectContent><SelectItem value="under_10000">unter 10.000 €</SelectItem><SelectItem value="10000_20000">10.000–20.000 €</SelectItem><SelectItem value="20000_35000">20.000–35.000 €</SelectItem><SelectItem value="over_35000">über 35.000 €</SelectItem><SelectItem value="unknown">noch offen</SelectItem></SelectContent></Select></Field>
                  </div>
                </FormBlock>

                <div className="space-y-2">
                  <Label htmlFor="message" className="font-bold text-[#0F172A]">Zusätzliche Angaben</Label>
                  <Textarea id="message" value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} placeholder="z. B. Wärmepumpe, E-Auto, bestehende Anlage, besondere Wünsche ..." />
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                  <label htmlFor="privacy-consent" className="flex cursor-pointer gap-3 text-sm leading-relaxed text-slate-700">
                    <Checkbox
                      id="privacy-consent"
                      checked={privacyAccepted}
                      onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                      className="mt-1 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                    />
                    <span>
                      Ich habe die <Link to="/datenschutz" className="font-extrabold text-emerald-700 underline-offset-4 hover:underline">Datenschutzerklärung</Link> gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage und zur Kontaktaufnahme verarbeitet werden. Diese Zustimmung kann ich jederzeit mit Wirkung für die Zukunft widerrufen.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col gap-4 rounded-3xl border border-[#808080]/20 bg-[#F8FAFC] p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-3 text-sm text-slate-600"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" /><span>Ihre Angaben werden vertraulich behandelt und ausschließlich zur Bearbeitung Ihrer Photovoltaik-Anfrage verwendet.</span></div>
                  <Button disabled={isSubmitting} className="h-12 rounded-full bg-[#F97316] px-8 font-extrabold text-white hover:bg-orange-600">
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null} Anfrage senden <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mx-auto mt-8 max-w-5xl text-center text-sm text-slate-500"><Link to="/pv-rechner" className="font-bold text-[#22C55E] hover:text-green-700">Erst den PV-Rechner nutzen</Link></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FormBlock({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="rounded-[1.75rem] border border-[#808080]/20 bg-white p-5 shadow-sm md:p-6"><div className="mb-6"><h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-[#0F172A]">{title}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p></div>{children}</div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label className="font-bold text-[#0F172A]">{label}</Label>{children}</div>;
}
