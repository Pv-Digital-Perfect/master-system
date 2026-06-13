import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

export default function Contact() {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Bitte fülle Name, E-Mail und Nachricht aus.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await (supabase.from("pv_leads" as any) as any).insert({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || "Nicht angegeben",
        message: formData.message,
        source: "contact_form",
        lead_status: "new",
      });

      if (error) throw error;
      setIsSuccess(true);
      toast.success("Nachricht wurde gespeichert.");
    } catch (error) {
      console.error(error);
      toast.error("Nachricht konnte nicht gespeichert werden. Bitte Supabase-Tabelle und RLS prüfen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Helmet key={location.pathname} prioritizeSeoTags defer={false}>
        <title>Kontakt | PV Lead System Pro</title>
        <meta name="description" content="Kontakt zum PV Lead System Pro: Anfrage, Rückruf oder Projektbesprechung starten." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/kontakt")} />
      </Helmet>
      <Header />

      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 py-16 text-white md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Kontakt aufnehmen</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
              Für Rückfragen, individuelle Anpassungen oder direkte Projektanfragen.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <Card><CardContent className="p-7"><Mail className="mb-4 h-7 w-7 text-orange-500" /><h2 className="text-xl font-black">E-Mail</h2><a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="mt-2 block font-bold text-emerald-700">{DEFAULT_CONTACT_EMAIL}</a></CardContent></Card>
              <Card><CardContent className="p-7"><Phone className="mb-4 h-7 w-7 text-orange-500" /><h2 className="text-xl font-black">Schneller Leadflow</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">Für echte PV-Anfragen besser direkt das strukturierte Formular nutzen.</p><Button asChild className="mt-5 rounded-full bg-orange-500 font-black text-white hover:bg-orange-600"><Link to="/angebot-anfordern">PV-Anfrage starten</Link></Button></CardContent></Card>
            </div>

            <Card className="border-0 bg-white shadow-2xl shadow-slate-900/10">
              <CardContent className="p-6 md:p-10">
                {isSuccess ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-10 w-10" /></div>
                    <h2 className="mt-6 text-3xl font-black">Nachricht gespeichert.</h2>
                    <p className="mt-3 text-slate-600">Die Anfrage ist im System eingegangen.</p>
                    <Button className="mt-8 rounded-full" variant="outline" onClick={() => { setIsSuccess(false); setFormData({ name: "", email: "", phone: "", message: "" }); }}>Neue Nachricht schreiben</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                      <div className="space-y-2"><Label htmlFor="email">E-Mail *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><Label htmlFor="phone">Telefon</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                    <div className="space-y-2"><Label htmlFor="message">Nachricht *</Label><Textarea id="message" rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} /></div>
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
