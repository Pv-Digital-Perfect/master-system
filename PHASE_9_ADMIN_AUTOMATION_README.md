# Phase 9: Admin Cockpit + PV-Betriebsfunktionen

Diese Phase erweitert den Adminbereich zu einem deutlich stärkeren PV-Betreiber-Cockpit.

## Neue Adminbereiche

- `/admin/analytics` – Lead-Auswertung, Funnel, Quellen, Orte und Status.
- `/admin/live` – Schnellzugriff auf aktive Website-Seiten, Sitemap, Robots und Verwaltungsbereiche.
- `/admin/checklist` – Website-Check für Betreiberangaben, Inhalte, Technik und Live-Prüfung.

## Erweiterte Einstellungen

Die Einstellungsseite kann jetzt deutlich mehr als nur Rechnerwerte pflegen:

- Hero-Kennzeichnung
- Hero-Hauptüberschrift
- Hero-Beschreibung
- primärer CTA
- zweiter CTA
- Einsatzgebiet
- Spezialisierung
- Rückmeldezeit
- Beratungshinweis
- Förderhinweis
- Finanzierungshinweis
- Service-/Garantiehinweis
- Terminlink
- Empfänger-Bezeichnung
- PV-Rechnerwerte
- Rechner-Vorschau

## Datenbank

Für bestehende Projekte muss diese Migration zusätzlich ausgeführt werden:

```text
supabase/migrations/20260618_pv_editable_admin_settings.sql
```

Die Baseline für neue Setups wurde ebenfalls erweitert:

```text
supabase/migrations/20260617_pv_launch_baseline.sql
```

## Live-Domain

```text
https://pv-system.digital-perfect.com/
```

## Hinweis

Es wurden keine öffentlichen Slugs geändert. Neue Routen liegen nur im Adminbereich.
