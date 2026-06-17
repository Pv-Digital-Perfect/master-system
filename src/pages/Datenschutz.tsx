import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cookie, Database, FileText, Mail, Server, ShieldCheck, UserCheck } from "lucide-react";
import { DEFAULT_BRAND_NAME, DEFAULT_CONTACT_EMAIL } from "@/lib/constants";
import { buildAbsoluteSiteUrl } from "@/lib/routes";

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>Datenschutzerklärung | {DEFAULT_BRAND_NAME}</title>
        <meta name="description" content="Datenschutzerklärung zur Verarbeitung personenbezogener Daten bei Kontaktanfragen, PV-Anfragen, Cookies und technischer Bereitstellung." />
        <link rel="canonical" href={buildAbsoluteSiteUrl("/datenschutz")} />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-[#0F172A] py-16 text-white md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200">Datenschutz</div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Datenschutzerklärung</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-300">Wir behandeln personenbezogene Daten vertraulich und verwenden sie zur Bearbeitung Ihrer Anfrage und zur sicheren Bereitstellung dieser Website.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <LegalBlock title="1. Verantwortlicher" icon={<FileText className="h-5 w-5" />}>
              <p><strong>{DEFAULT_BRAND_NAME}</strong></p>
              <p>Betreiber der Website: Digital-Perfect</p>
              <p>E-Mail: <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="font-bold text-emerald-700 hover:text-emerald-900">{DEFAULT_CONTACT_EMAIL}</a></p>
              <p>Weitere Anbieterinformationen finden Sie im Impressum.</p>
            </LegalBlock>

            <LegalBlock title="2. Verarbeitung bei Kontakt- und PV-Anfragen" icon={<Mail className="h-5 w-5" />}>
              <p>Wenn Sie das Kontaktformular oder das Anfrageformular nutzen, verarbeiten wir die von Ihnen eingegebenen Angaben. Dazu können insbesondere Name, E-Mail-Adresse, Telefonnummer, Postleitzahl, Ort, Eigentümerstatus, Immobilientyp, Dachangaben, Stromverbrauch, Speicherwunsch, Wallbox-Interesse, Zeitrahmen, Budgetrahmen und Ihre Nachricht gehören.</p>
              <p>Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage, zur Kontaktaufnahme, zur Vorbereitung einer ersten Einschätzung und gegebenenfalls zur Erstellung eines Angebots.</p>
              <p>Rechtsgrundlage ist je nach Anfrageinhalt die Durchführung vorvertraglicher Maßnahmen, unser berechtigtes Interesse an der Bearbeitung Ihrer Anfrage sowie Ihre Einwilligung, soweit diese im Formular ausdrücklich abgefragt wird.</p>
            </LegalBlock>

            <LegalBlock title="3. Technische Bereitstellung der Website" icon={<Server className="h-5 w-5" />}>
              <p>Beim Aufruf dieser Website werden technisch notwendige Daten verarbeitet, damit die Website ausgeliefert, geschützt und stabil betrieben werden kann. Dazu können IP-Adresse, Datum und Uhrzeit des Zugriffs, angefragte Seiten, Browser- und Geräteinformationen sowie Server-Logdaten gehören.</p>
              <p>Diese Daten werden verarbeitet, um die Website bereitzustellen, Angriffe zu erkennen, Fehler zu analysieren und den sicheren Betrieb zu gewährleisten.</p>
            </LegalBlock>

            <LegalBlock title="4. Datenbank und Hosting" icon={<Database className="h-5 w-5" />}>
              <p>Formularanfragen werden in einer geschützten Datenbank gespeichert. Der öffentliche Zugriff ist auf das Übermitteln neuer Anfragen beschränkt; Lesen, Bearbeiten und Löschen von Anfragen ist nur für berechtigte Zugänge vorgesehen.</p>
              <p>Für Hosting, Datenbank, Sicherheitsfunktionen und technische Infrastruktur können spezialisierte Dienstleister als Auftragsverarbeiter eingesetzt werden.</p>
            </LegalBlock>

            <LegalBlock title="5. Cookies und Einwilligungen" icon={<Cookie className="h-5 w-5" />}>
              <p>Diese Website verwendet technisch notwendige Speichermechanismen, damit Grundfunktionen sicher bereitgestellt werden können.</p>
              <p>Optionale Analyse- oder Marketingdienste werden nur aktiviert, wenn Sie über das Cookie-Banner eine entsprechende Einwilligung erteilen. Sie können eine erteilte Einwilligung jederzeit über die Cookie-Einstellungen widerrufen.</p>
            </LegalBlock>

            <LegalBlock title="6. Speicherdauer" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Anfragedaten werden nur so lange gespeichert, wie dies für Bearbeitung, Rückfragen, Dokumentation, Angebotsvorbereitung oder gesetzliche Pflichten erforderlich ist.</p>
              <p>Technische Protokolldaten werden nur so lange gespeichert, wie dies für Sicherheit, Fehleranalyse und Betrieb erforderlich ist.</p>
            </LegalBlock>

            <LegalBlock title="7. Empfänger und Weitergabe" icon={<UserCheck className="h-5 w-5" />}>
              <p>Eine Weitergabe personenbezogener Daten erfolgt nur, wenn sie zur Bearbeitung Ihrer Anfrage notwendig ist, eine gesetzliche Verpflichtung besteht, Sie eingewilligt haben oder ein berechtigtes Interesse vorliegt.</p>
              <p>Eine Weitergabe zu Werbezwecken ohne entsprechende Rechtsgrundlage findet nicht statt.</p>
            </LegalBlock>

            <LegalBlock title="8. Ihre Rechte" icon={<ShieldCheck className="h-5 w-5" />}>
              <p>Sie haben nach Maßgabe der gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.</p>
              <p>Einwilligungen können Sie jederzeit mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt unberührt.</p>
              <p>Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter <a href={`mailto:${DEFAULT_CONTACT_EMAIL}`} className="font-bold text-emerald-700 hover:text-emerald-900">{DEFAULT_CONTACT_EMAIL}</a>.</p>
            </LegalBlock>

            <LegalBlock title="9. Beschwerderecht" icon={<FileText className="h-5 w-5" />}>
              <p>Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzrecht verstößt, können Sie sich an die zuständige Datenschutzaufsichtsbehörde wenden.</p>
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
