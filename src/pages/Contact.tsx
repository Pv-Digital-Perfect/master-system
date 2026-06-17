import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";
import { notifyLeadByEmail } from "@/lib/leadNotifications";

const PRIVACY_CONSENT_VERSION = "contact-form-2026-06-17";

export default function Contact() {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const resetForm = () => {
    setIsSuccess(false);
    setPrivacyAccepted(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Bitte fülle Name, E-Mail und Nachricht aus.");
      return;
    }

    if (!privacyAccepted) {
      toast.error("Bitte bestätige die Datenschutzhinweise, damit wir deine Nachricht bearbeiten dürfen.");
      return;
    }

    setIsSubmitting(true);
    try {
      const leadId = crypto.randomUUID();

      const { error } = await (supabase.from("pv_leads" as any) as any).insert({
        id: leadId,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || "Nicht angegeben",
        message: formData.message,
        source: "contact_form",
        lead_status: "new",
        privacy_policy_accepted: true,
        privacy_consent_at: new Date().toISOString(),
        privacy_consent_version: PRIVACY_CONSENT_VERSION,
      });

      if (error) throw error;

      await notifyLeadByEmail({ leadId, source: "contact_form" });

      setIsSuccess(true);
      toast.success("Nachricht wurde erfolgreich übermittelt.");
    } catch (error) {
      console.error(error);
      toast.error("Nachricht konnte gerade nicht übermittelt werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Helmet key={location.pathname} prioritizeSeoTags defer={false}>
        <title>Kontakt | Photovoltaik Beratung</title>
        <meta name="description" content="Kontakt für Photovoltaik, Stromspeicher und Wallbox: Anfrage, Rückruf oder Projektbesprechung starten." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/kontakt")} />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 py-16 text-white md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Kontakt aufnehmen</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Für Rückfragen, eine erste Einschätzung oder eine direkte Projektanfrage rund um Photovoltaik, Stromspeicher und Wallbox.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <Card><CardContent className="p-7"><Mail className="mb-4 h-7 w-7 text-orange-500" /><h2 className="text-xl font-black">E-Mail</h2><a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="mt-2 block font-bold text-emerald-700">{DEFAULT_CONTACT_EMAIL}</a></CardContent></Card>
              <Card><CardContent className="p-7"><Phone className="mb-4 h-7 w-7 text-orange-500" /><h2 className="text-xl font-black">Schnelle Rückmeldung</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Für eine genaue Ersteinschätzung nutzen Sie am besten direkt das strukturierte Anfrageformular.</p><Button asChild className="mt-5 rounded-full bg-orange-500 font-black text-white hover:bg-orange-600"><Link to="/angebot-anfordern">Anfrage starten</Link></Button></CardContent></Card>
            </div>

            <Card className="border-0 bg-white shadow-2xl shadow-slate-900/10">
              <CardContent className="p-6 md:p-10">
                {isSuccess ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-10 w-10" /></div>
                    <h2 className="mt-6 text-3xl font-black">Nachricht erfolgreich übermittelt.</h2>
                    <p className="mt-3 text-slate-600">Vielen Dank. Wir prüfen Ihre Nachricht und melden uns zeitnah zurück.</p>
                    <Button className="mt-8 rounded-full" variant="outline" onClick={resetForm}>Neue Nachricht schreiben</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                      <div className="space-y-2"><Label htmlFor="email">E-Mail *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="phone">Telefon</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="space-y-2"><Label htmlFor="message">Nachricht *</Label><Textarea id="message" rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} /></div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                      <label htmlFor="contact-privacy-consent" className="flex cursor-pointer gap-3 text-sm leading-relaxed text-slate-700">
                        <Checkbox
                          id="contact-privacy-consent"
                          checked={privacyAccepted}
                          onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                          className="mt-1 border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                        />
                        <span>
                          Ich habe die <Link to="/datenschutz" className="font-extrabold text-emerald-700 underline-offset-4 hover:underline">Datenschutzerklärung</Link> gelesen und stimme zu, dass meine Angaben zur Bearbeitung meiner Nachricht und zur Kontaktaufnahme verarbeitet werden. Diese Zustimmung kann ich jederzeit mit Wirkung für die Zukunft widerrufen.
                        </span>
                      </label>
                    </div>

                    <Button disabled={isSubmitting} className="h-12 rounded-full bg-orange-500 px-8 font-black text-white hover:bg-orange-600">
                      {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                      Nachricht senden
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
