import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, ShieldCheck, FileText, Info, Phone, Building2 } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL, DEFAULT_SITE_URL } from "@/lib/constants";
import { siteConfig } from "@/config/siteConfig";

export default function Impressum() {
  const { legal, contact } = siteConfig;

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>Impressum | {DEFAULT_BRAND_NAME}</title>
        <meta name="description" content="Impressum, Anbieterkennzeichnung und Kontaktinformationen der Photovoltaik-Website." />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Rechtliches</div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">Impressum</h1>
              <p className="mt-5 text-lg text-slate-300">Anbieterkennzeichnung und Kontaktinformationen gemäß den gesetzlichen Informationspflichten.</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
              <LegalCard title="Angaben zum Anbieter" icon={<FileText className="h-5 w-5" />}>
                <p><strong>{DEFAULT_BRAND_NAME}</strong></p>
                <p>{legal.operatorLabel}: {legal.operatorName}</p>
                {legal.representedBy ? <p>Vertreten durch: {legal.representedBy}</p> : null}
                {contact.addressLines.length ? contact.addressLines.map((line) => <p key={line}>{line}</p>) : <p>{legal.country}</p>}
                {legal.vatId ? <p>UID / Umsatzsteuer-ID: {legal.vatId}</p> : null}
                {legal.companyRegister ? <p>Firmenbuch / Register: {legal.companyRegister}</p> : null}
                {legal.authority ? <p>Zuständige Behörde: {legal.authority}</p> : null}
                {legal.professionalBody ? <p>Kammer / Berufsverband: {legal.professionalBody}</p> : null}
                {legal.professionalRules ? <p>Anwendbare Vorschriften: {legal.professionalRules}</p> : null}
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-600" /><a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="font-bold text-emerald-700 hover:text-emerald-900">{DEFAULT_CONTACT_EMAIL}</a></p>
                {contact.phone ? <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-600" />{contact.phone}</p> : null}
                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" />{DEFAULT_SITE_URL}</p>
              </LegalCard>

              <LegalCard title="Kontakt" icon={<Phone className="h-5 w-5" />}>
                <p>Für Fragen zu Photovoltaik, Stromspeicher, Wallbox, Fördermöglichkeiten oder einer Anfrage nutzen Sie bitte das Kontaktformular oder die angeführte E-Mail-Adresse.</p>
                <p>Eine schnelle Erstbewertung ist über das strukturierte Anfrageformular möglich.</p>
              </LegalCard>
            </div>

            <LegalCard title="Inhaltliche Verantwortung" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Die Inhalte dieser Website dienen der allgemeinen Information zu Photovoltaik-Anlagen, Stromspeichern, Wallboxen, Fördermöglichkeiten und Energieeinsparung.</p>
              <p>Berechnungen und Richtwerte stellen unverbindliche Orientierungshilfen dar. Eine verbindliche Planung, technische Prüfung, Netzanschlussprüfung oder Angebotslegung erfolgt erst nach individueller Projektprüfung.</p>
            </LegalCard>

            <LegalCard title="Haftung für Inhalte" icon={<Info className="h-5 w-5" />}>
              <p>Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Dennoch können sich technische, rechtliche, wirtschaftliche und förderbezogene Rahmenbedingungen ändern.</p>
              <p>Für die Richtigkeit, Vollständigkeit und Aktualität aller Angaben übernehmen wir keine Gewähr. Maßgeblich sind im Einzelfall die konkrete Planung, Vertragsunterlagen und die jeweils gültigen technischen sowie rechtlichen Vorgaben.</p>
            </LegalCard>

            <LegalCard title="Haftung für externe Links" icon={<Info className="h-5 w-5" />}>
              <p>Diese Website kann Links zu externen Websites enthalten. Auf deren Inhalte haben wir keinen Einfluss. Für externe Inhalte ist der jeweilige Anbieter oder Betreiber verantwortlich.</p>
            </LegalCard>

            <LegalCard title="Urheberrecht" icon={<Building2 className="h-5 w-5" />}>
              <p>Texte, Gestaltung, Bilder, Grafiken und sonstige Inhalte dieser Website sind urheberrechtlich geschützt, soweit sie nicht ausdrücklich anders gekennzeichnet sind.</p>
              <p>Eine Verwendung, Vervielfältigung oder Weitergabe außerhalb gesetzlicher Erlaubnisse bedarf der vorherigen Zustimmung des jeweiligen Rechteinhabers.</p>
            </LegalCard>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function LegalCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-3 text-xl font-black text-slate-950"><span className="text-orange-500">{icon}</span>{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-700 md:text-base">{children}</div>
    </section>
  );
}
