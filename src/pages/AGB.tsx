import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Calculator, FileText, Mail, ShieldCheck } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";

export default function AGB() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>Nutzungsbedingungen | {DEFAULT_BRAND_NAME}</title>
        <meta name="description" content="Nutzungsbedingungen für die Verwendung der Photovoltaik-Website, Rechner, Informationsseiten und Anfrageformulare." />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Nutzungsbedingungen</div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Allgemeine Nutzungsbedingungen</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-300">Regeln für die Nutzung der Informationsseiten, Rechner und Anfrageformulare.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <LegalBlock title="1. Anbieter und Geltungsbereich" icon={<FileText className="h-5 w-5" />}>
              <p>Diese Nutzungsbedingungen gelten für die Nutzung der Website {DEFAULT_BRAND_NAME}, insbesondere für Informationsseiten, PV-Rechner, Speicher-Rechner, Stromkosten-Rechner, Förderinformationen, Kontaktformular und Anfrageformular.</p>
              <p>Betreiber der Website ist {siteConfig.legal.operatorName}. Weitere Angaben finden Sie im Impressum.</p>
            </LegalBlock>

            <LegalBlock title="2. Unverbindliche Informationen und Rechner" icon={<Calculator className="h-5 w-5" />}>
              <p>Die bereitgestellten Rechner und Informationen dienen ausschließlich der ersten Orientierung. Ergebnisse zu Kosten, Ersparnis, Speichergröße, Amortisation oder Fördermöglichkeiten sind unverbindliche Schätzwerte.</p>
              <p>Ein verbindliches Angebot, eine technische Planung oder eine Förderzusage entsteht erst nach individueller Prüfung durch qualifizierte Ansprechpartner und auf Grundlage der konkreten Projektbedingungen.</p>
            </LegalBlock>

            <LegalBlock title="3. Anfrage und Kontaktaufnahme" icon={<Mail className="h-5 w-5" />}>
              <p>Wenn Sie eine Anfrage absenden, werden Ihre Angaben zur Bearbeitung und Kontaktaufnahme verwendet. Bitte übermitteln Sie nur richtige und aktuelle Daten.</p>
              <p>Eine Anfrage verpflichtet Sie nicht zum Abschluss eines Vertrags. Ebenso entsteht durch die Nutzung der Website kein Anspruch auf Angebotslegung, Förderung oder Umsetzung.</p>
            </LegalBlock>

            <LegalBlock title="4. Verfügbarkeit und Änderungen" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Wir bemühen uns um einen stabilen Betrieb der Website. Dennoch können Wartung, technische Störungen oder externe Dienste zu Einschränkungen führen.</p>
              <p>Inhalte, Funktionen, Rechnerwerte und Darstellungen können angepasst werden, wenn technische, rechtliche, wirtschaftliche oder fachliche Gründe dies erforderlich machen.</p>
            </LegalBlock>

            <LegalBlock title="5. Kontakt" icon={<Mail className="h-5 w-5" />}>
              <p>Bei Fragen zu diesen Nutzungsbedingungen erreichen Sie uns unter <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="font-bold text-emerald-700 hover:text-emerald-900">{DEFAULT_CONTACT_EMAIL}</a>.</p>
            </LegalBlock>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function LegalBlock({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-black text-slate-950"><span className="text-orange-500">{icon}</span>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </section>
  );
}
