# PV-System.Digital-Perfect

Professionelle Photovoltaik-Website mit PV-Rechner, Anfrageformular, Lead-Verwaltung, Mail-Benachrichtigung, Admin-Cockpit und paketabhängigen Funktionen.

Live-Domain:

```text
https://pv-system.digital-perfect.com/
```

## Kernbereiche

- Öffentliche PV-Website
- PV-Kostenrechner
- Speicher-Rechner
- Stromkosten-Rechner
- Förder-Check
- Angebotsformular
- Kontaktformular
- Adminbereich für PV-Anfragen
- Analytics, Live-Seiten und Website-Check
- Bearbeitbare Website-Texte und Rechnerwerte im Admin

## Pakete

```env
VITE_PACKAGE_TIER=starter
VITE_PACKAGE_TIER=business
VITE_PACKAGE_TIER=premium
```

Für das Master-/Demo-System:

```env
VITE_PACKAGE_TIER=premium
VITE_SITE_URL=https://pv-system.digital-perfect.com/
VITE_CONTACT_EMAIL=pv@digital-perfect.com
```

## Supabase ENV

Der Client akzeptiert beide Varianten:

```env
VITE_SUPABASE_URL=https://lcbmavlggundawcomznp.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

oder:

```env
VITE_SUPABASE_URL=https://lcbmavlggundawcomznp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Adminbereich

```text
/admin
/admin/leads
/admin/analytics
/admin/live
/admin/checklist
/admin/settings
```

In den Einstellungen können gepflegt werden:

- Startseiten-Kennzeichnung
- Hero-Hauptüberschrift
- Hero-Beschreibung
- CTA-Beschriftungen
- Einsatzgebiet
- Spezialisierung
- Rückmeldezeit
- Beratungshinweise
- Förderhinweise
- Finanzierungs-/Servicehinweise
- Terminlink
- Rechnerwerte für PV, Speicher, Wallbox und Stromkosten

## Datenbank

Für neue Setups ist die Baseline enthalten:

```text
supabase/migrations/20260617_pv_launch_baseline.sql
```

Für bestehende Setups mit der erweiterten Einstellungsseite zusätzlich ausführen:

```text
supabase/migrations/20260618_pv_editable_admin_settings.sql
```

## Build

```powershell
npm run build
```

Paketweise prüfen:

```powershell
$env:VITE_PACKAGE_TIER="starter"; npm run build
$env:VITE_PACKAGE_TIER="business"; npm run build
$env:VITE_PACKAGE_TIER="premium"; npm run build
Remove-Item Env:VITE_PACKAGE_TIER
```

## Live-Prüfung

Nach Änderungen prüfen:

```text
https://pv-system.digital-perfect.com/
https://pv-system.digital-perfect.com/pv-rechner
https://pv-system.digital-perfect.com/angebot-anfordern
https://pv-system.digital-perfect.com/admin
```

Danach eine Testanfrage absenden und im Admin unter `/admin/leads` prüfen.
