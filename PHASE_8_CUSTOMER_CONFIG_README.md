# Phase 8: Kunden-Konfiguration & skalierbares Deployment

## Ziel

Das PV-System kann jetzt pro Kunde sauber konfiguriert werden, ohne dass Brand, Domain, Kontakt, Betreiberangaben, Bilder und Paketstufe in mehreren Dateien manuell geändert werden müssen.

## Phase 8.1: Kunden-Prozess

### Empfohlenes Setup pro Kunde

- 1 Kunde = 1 Coolify App
- 1 Kunde = 1 Supabase Projekt
- 1 Kunde = eigene Domain/Subdomain
- 1 Kunde = eigene ENV-Konfiguration
- 1 Kunde = eigene Supabase Secrets für Lead-Mail

Diese Trennung reduziert Datenschutzrisiken, verhindert Lead-Vermischung und erleichtert spätere Kündigung, Übergabe oder Backups.

### Kundenangaben vor Launch

Pflichtdaten:

- Firmenname / Betreibername
- Adresse
- Kontakt-E-Mail
- Telefonnummer
- Domain
- gewünschte Paketstufe: starter, business oder premium
- Ziel-E-Mail für Leads
- Logo / Bildmaterial, falls vorhanden
- Leistungsgebiet
- angebotene Leistungen: PV, Speicher, Wallbox, Gewerbe, Förderung, Wartung

Rechtliche Daten, falls vorhanden:

- UID / Umsatzsteuer-ID
- Firmenbuchnummer
- Geschäftsführung / Inhaber
- zuständige Behörde
- Kammer / Berufsverband
- anwendbare berufsrechtliche Vorschriften

Technikdaten:

- DNS-Zugriff vorhanden?
- Cloudflare vorhanden?
- bestehende E-Mail-Infrastruktur / MX-Records
- darf `mail.kundendomain.at` für Resend verwendet werden?

### Mail-Strategie

Für echte Kunden sollte der Absender nicht Digital-Perfect sein.

Empfohlen:

```text
From: PV-Anfrage <anfrage@mail.kundendomain.at>
To: kunde@kundendomain.at
Reply-To: Interessent aus dem Formular
```

Dafür muss die Versanddomain/Subdomain im Resend-Account verifiziert werden. Ein eigener Resend-Account pro Kunde ist nicht zwingend notwendig.

## Phase 8.2: SiteConfig-Code-Patch

Neu:

```text
src/config/siteConfig.ts
.env.customer.example
```

Geändert:

```text
src/lib/constants.ts
src/pages/Impressum.tsx
src/pages/Datenschutz.tsx
src/pages/AGB.tsx
src/pages/Contact.tsx
src/pages/Index.tsx
src/components/layout/Footer.tsx
src/components/seo/SeoDefaults.tsx
src/pages/admin/Settings.tsx
scripts/generate-sitemap.js
```

## Neue ENV-Variablen

### Paket

```env
VITE_PACKAGE_TIER=premium
```

Werte:

```text
starter
business
premium
```

### Public Brand / Website

```env
VITE_BRAND_NAME="Muster Solar GmbH"
VITE_SITE_SHORT_NAME="Muster Solar"
VITE_SITE_URL="https://www.muster-solar.at"
VITE_SITE_DESCRIPTION="Photovoltaik, Speicher und Wallbox planen: Kosten berechnen, Förderung prüfen und unverbindlich Beratung anfragen."
VITE_CONTACT_EMAIL="anfrage@muster-solar.at"
VITE_CONTACT_PHONE="+43 732 000000"
VITE_CONTACT_ADDRESS="Musterstraße 1|4020 Linz|Österreich"
```

### Rechtliches

```env
VITE_LEGAL_OPERATOR_NAME="Muster Solar GmbH"
VITE_LEGAL_OPERATOR_LABEL="Betreiber der Website"
VITE_LEGAL_COUNTRY="Österreich"
VITE_LEGAL_REPRESENTED_BY="Max Mustermann"
VITE_LEGAL_VAT_ID="ATU00000000"
VITE_LEGAL_COMPANY_REGISTER="FN 000000x, Landesgericht Linz"
VITE_LEGAL_AUTHORITY="Magistrat / Bezirkshauptmannschaft"
VITE_LEGAL_PROFESSIONAL_BODY="Wirtschaftskammer Österreich"
VITE_LEGAL_PROFESSIONAL_RULES="Gewerbeordnung, abrufbar unter ris.bka.gv.at"
```

### Bilder / SEO

```env
VITE_HERO_IMAGE_DESKTOP="https://example.com/pv-hero-desktop.webp"
VITE_HERO_IMAGE_MOBILE="https://example.com/pv-hero-mobile.webp"
VITE_OG_IMAGE="https://example.com/og-image.webp"
VITE_THEME_COLOR="#0F172A"
VITE_SEO_LOCALE="de_AT"
```

## Coolify je Kunde

In der jeweiligen Coolify-App setzen:

```env
VITE_PACKAGE_TIER=starter/business/premium
VITE_SUPABASE_URL=https://KUNDEN_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=KUNDEN_SUPABASE_ANON_KEY
VITE_BRAND_NAME="Kundenname"
VITE_SITE_URL="https://www.kundendomain.at"
VITE_CONTACT_EMAIL="anfrage@kundendomain.at"
```

Wichtig: Nach ENV-Änderungen immer Redeploy, nicht nur Restart. Vite liest `VITE_`-Variablen zur Buildzeit.

## Supabase Secrets je Kunde

Immer mit `npx supabase` ausführen:

```powershell
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF RESEND_API_KEY="re_xxxxxxxxx"
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF PV_LEAD_EMAIL_TO="kunde@kundendomain.at"
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF PV_LEAD_EMAIL_FROM="PV-Anfrage <anfrage@mail.kundendomain.at>"
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF PV_SITE_NAME="Kundenname"
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF PV_SITE_URL="https://www.kundendomain.at"
npx supabase secrets set --project-ref KUNDEN_PROJECT_REF PV_SEND_CUSTOMER_CONFIRMATION="false"
```

## Deployment-Check je Kunde

1. Kundendaten eintragen.
2. Supabase Projekt erstellen.
3. SQL-Migrationen ausführen.
4. Edge Function deployen.
5. Supabase Secrets setzen.
6. Coolify ENV setzen.
7. Domain/DNS verbinden.
8. Build/Deploy ausführen.
9. Live-Routen prüfen.
10. Testlead senden.
11. Resend-Mail prüfen.
12. Admin-Leads und Admin-Settings prüfen.
13. Mobile CTA prüfen.
14. Impressum/Datenschutz/AGB prüfen.

## Kein Routen-Risiko

Diese Phase ändert keine Slugs und keine öffentlichen URLs. Keine Redirects nötig.
