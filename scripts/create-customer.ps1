param(
  [string]$OutputDir = ".\customer-output"
)

$ErrorActionPreference = "Stop"

function Ask($Label, $Default = "") {
  $prompt = if ($Default) { "$Label [$Default]" } else { $Label }
  $value = Read-Host $prompt
  if ([string]::IsNullOrWhiteSpace($value)) { return $Default }
  return $value.Trim()
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$customerName = Ask "Kundenname / Firma" "PV-System.Digital-Perfect"
$shortName = Ask "Kurzname" "PV-System"
$domain = Ask "Live-Domain inkl. https://" "https://pv-system.digital-perfect.com/"
$package = Ask "Paket (starter/business/premium)" "premium"
$contactEmail = Ask "Lead-Ziel-E-Mail" "pv@digital-perfect.com"
$contactPhone = Ask "Telefon" ""
$address = Ask "Adresse mit | als Zeilentrenner" "Österreich"
$projectRef = Ask "Supabase Project Ref" "KUNDEN_PROJECT_REF"
$supabaseUrl = Ask "Supabase URL" "https://$projectRef.supabase.co"
$anonKey = Ask "Supabase Public/Anon Key" "KUNDEN_SUPABASE_ANON_KEY"
$resendFrom = Ask "Resend Absender" "PV-Anfrage <pv@digital-perfect.com>"
$representedBy = Ask "Vertreten durch" ""
$vatId = Ask "UID / USt-ID" ""
$companyRegister = Ask "Firmenbuch / Register" ""
$authority = Ask "Behörde" ""
$professionalBody = Ask "Kammer / Berufsverband" "Wirtschaftskammer Österreich"

$coolifyEnv = @"
VITE_PACKAGE_TIER=$package
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$anonKey
VITE_BRAND_NAME=$customerName
VITE_SITE_SHORT_NAME=$shortName
VITE_SITE_URL=$domain
VITE_SITE_DESCRIPTION=Photovoltaik, Speicher und Wallbox planen: Kosten berechnen, Förderung prüfen und unverbindlich Beratung anfragen.
VITE_CONTACT_EMAIL=$contactEmail
VITE_CONTACT_PHONE=$contactPhone
VITE_CONTACT_ADDRESS=$address
VITE_LEGAL_OPERATOR_NAME=$customerName
VITE_LEGAL_OPERATOR_LABEL=Betreiber der Website
VITE_LEGAL_COUNTRY=Österreich
VITE_LEGAL_REPRESENTED_BY=$representedBy
VITE_LEGAL_VAT_ID=$vatId
VITE_LEGAL_COMPANY_REGISTER=$companyRegister
VITE_LEGAL_AUTHORITY=$authority
VITE_LEGAL_PROFESSIONAL_BODY=$professionalBody
VITE_LEGAL_PROFESSIONAL_RULES=Gewerbeordnung, abrufbar unter ris.bka.gv.at
VITE_ADMIN_SUPABASE_URL=https://supabase.com/dashboard/project/$projectRef
VITE_ADMIN_RESEND_URL=https://resend.com/emails
VITE_ADMIN_COOLIFY_URL=
VITE_ADMIN_SEARCH_CONSOLE_URL=
"@

$supabaseSecrets = @"
# Erst RESEND_API_KEY manuell einsetzen, dann ausführen.
npx supabase secrets set --project-ref $projectRef RESEND_API_KEY="DEIN_RESEND_API_KEY"
npx supabase secrets set --project-ref $projectRef PV_LEAD_EMAIL_TO="$contactEmail"
npx supabase secrets set --project-ref $projectRef PV_LEAD_EMAIL_FROM="$resendFrom"
npx supabase secrets set --project-ref $projectRef PV_SITE_NAME="$customerName"
npx supabase secrets set --project-ref $projectRef PV_SITE_URL="$domain"
npx supabase secrets set --project-ref $projectRef PV_SEND_CUSTOMER_CONFIRMATION="false"
"@

$dnsChecklist = @"
# DNS-Checkliste für $customerName

## Website
- [ ] Domain in Coolify hinterlegt: $domain
- [ ] A/CNAME laut Coolify gesetzt
- [ ] www-Variante geprüft
- [ ] SSL aktiv
- [ ] Cloudflare Full Strict, falls Cloudflare aktiv
- [ ] MX-Records nicht verändert

## Resend Versanddomain
- [ ] Versanddomain im Resend-Konto geprüft
- [ ] DKIM-Einträge gesetzt, falls eigene Versanddomain genutzt wird
- [ ] Return-Path/Bounce-Eintrag gesetzt, falls eigene Versanddomain genutzt wird
- [ ] Absender getestet: $resendFrom
"@

$launchChecklist = @"
# Launch-Checkliste für $customerName

- [ ] Supabase Projekt erstellt: $projectRef
- [ ] supabase/migrations/20260617_pv_launch_baseline.sql ausgeführt
- [ ] Edge Function deployt: send-pv-lead-email
- [ ] Supabase Secrets gesetzt
- [ ] Coolify App erstellt
- [ ] Coolify ENV gesetzt
- [ ] Domain verbunden
- [ ] npm run build erfolgreich
- [ ] Live-Routen geprüft
- [ ] Testlead gesendet
- [ ] Betreiber-Mail angekommen
- [ ] Admin /admin/leads geprüft
- [ ] Admin /admin/settings geprüft
- [ ] Mobile Sticky CTA geprüft
- [ ] Impressum/Datenschutz/AGB geprüft
"@

Set-Content -Path (Join-Path $OutputDir "customer-env.coolify.txt") -Value $coolifyEnv -Encoding UTF8
Set-Content -Path (Join-Path $OutputDir "customer-supabase-secrets.ps1") -Value $supabaseSecrets -Encoding UTF8
Set-Content -Path (Join-Path $OutputDir "customer-dns-checklist.md") -Value $dnsChecklist -Encoding UTF8
Set-Content -Path (Join-Path $OutputDir "customer-launch-checklist.md") -Value $launchChecklist -Encoding UTF8

Write-Host "Kunden-Dateien erstellt in $OutputDir" -ForegroundColor Green
