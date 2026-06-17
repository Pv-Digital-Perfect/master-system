import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertTriangle, CheckCircle2, FileText, ShieldCheck, SunMedium } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

export default function AGB() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>Nutzungsbedingungen | {DEFAULT_BRAND_NAME}</title>
        <meta name="description" content="Nutzungsbedingungen für Rechner, Anfrageformular und Informationen zur Photovoltaik-Planung." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/agb")} />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Nutzungsbedingungen</div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Nutzungsbedingungen</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-300">Bedingungen für die Nutzung der Website, Rechner und Anfragefunktionen.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <Block title="1. Geltungsbereich" icon={<FileText className="h-5 w-5" />}>
              <p>Diese Nutzungsbedingungen gelten für die Nutzung der Website {DEFAULT_BRAND_NAME}, insbesondere für Informationsseiten, PV-Rechner, Speicher-Rechner, Stromkosten-Rechner, Förderinformationen, Kontaktformular und Anfrageformular.</p>
              <p>Individuelle Beratungsleistungen, Angebote, Lieferungen, Montagen oder Serviceleistungen können zusätzlichen Vereinbarungen und Vertragsunterlagen unterliegen.</p>
            </Block>

            <Block title="2. Informations- und Rechnerfunktionen" icon={<SunMedium className="h-5 w-5" />}>
              <p>Die dargestellten Inhalte, Berechnungen und Richtwerte dienen der ersten Orientierung. Sie ersetzen keine technische Prüfung vor Ort, keine statische Prüfung, keine Netzanschlussprüfung und keine verbindliche Planung.</p>
              <p>Preise, Fördermöglichkeiten, Erträge, Strompreise, Einspeisetarife, Amortisationswerte und Einsparungen können sich je nach Standort, Verbrauch, Dach, Produktwahl, Marktbedingungen und gesetzlichen Rahmenbedingungen ändern.</p>
            </Block>

            <Block title="3. Anfrage und Rückmeldung" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Übermittelte Angaben werden zur Bearbeitung der Anfrage, zur Kontaktaufnahme und zur Vorbereitung einer ersten Einschätzung verwendet. Eine Anfrage stellt noch keinen Vertragsabschluss dar.</p>
              <p>Ein verbindliches Angebot kann erst nach Prüfung der Projektdaten und gegebenenfalls weiterer technischer Informationen erstellt werden.</p>
            </Block>

            <Block title="4. Pflichten der Nutzer" icon={<CheckCircle2 className="h-5 w-5" />}>
              <p>Nutzer sind verpflichtet, bei Formularen und Anfragefunktionen richtige, vollständige und aktuelle Angaben zu machen.</p>
              <p>Eine missbräuchliche Nutzung der Website, automatisierte Störversuche, Sicherheitsumgehungen oder die Eingabe fremder Daten sind untersagt.</p>
            </Block>

            <Block title="5. Verfügbarkeit der Website" icon={<CheckCircle2 className="h-5 w-5" />}>
              <p>Wir bemühen uns um eine stabile Verfügbarkeit der Website. Dennoch können Wartungen, technische Störungen, Serverprobleme oder externe Dienste die Erreichbarkeit zeitweise beeinflussen.</p>
            </Block>

            <Block title="6. Haftungshinweis" icon={<AlertTriangle className="h-5 w-5" />}>
              <p>Wir bemühen uns um sorgfältige und verständliche Inhalte. Eine Gewähr für Vollständigkeit, Aktualität und Richtigkeit aller Angaben kann jedoch nicht übernommen werden.</p>
              <p>Für verbindliche Entscheidungen sind die individuelle technische Prüfung, die Vertragsunterlagen und die jeweils aktuellen Rahmenbedingungen maßgeblich.</p>
            </Block>

            <Block title="7. Datenschutz" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Informationen zur Verarbeitung personenbezogener Daten finden Sie in der Datenschutzerklärung.</p>
            </Block>

            <Block title="8. Kontakt" icon={<FileText className="h-5 w-5" />}>
              <p>Bei Fragen zu diesen Nutzungsbedingungen erreichen Sie uns unter <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="font-bold text-emerald-700 hover:text-emerald-900">{DEFAULT_CONTACT_EMAIL}</a>.</p>
            </Block>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Block({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-black text-slate-950"><span className="text-orange-500">{icon}</span>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </section>
  );
}
