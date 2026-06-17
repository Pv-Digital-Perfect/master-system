$ErrorActionPreference = "Stop"

$forbidden = @(
  ('Tier' + 'Tarif'),
  ('Rank' + '-Scout'),
  ('Rank' + 'Scout'),
  ('Love' + 'able'),
  ('love' + 'able'),
  ('Scout' + 'y'),
  ('White' + '-Label'),
  ('Lead' + '-System'),
  ('Lead' + 'flow'),
  ('Lead' + 'qualität'),
  ('Open' + 'AI'),
  ('Gem' + 'ini'),
  ('KI ' + 'Generator')
)

Write-Host "1/4 Altlasten-Suche" -ForegroundColor Cyan
$paths = @('.\src', '.\public', '.\index.html', '.\README.md', '.\scripts', '.\supabase') | Where-Object { Test-Path $_ }
$hits = Get-ChildItem $paths -Recurse -File -ErrorAction SilentlyContinue |
  Select-String -Pattern $forbidden -SimpleMatch -ErrorAction SilentlyContinue |
  Select-Object Path, LineNumber, Line

if ($hits) {
  $hits | Format-Table -AutoSize
  throw "Altlasten gefunden. Bitte Treffer prüfen."
}
Write-Host "OK: keine Altlasten-Treffer" -ForegroundColor Green

Write-Host "2/4 Baseline-Dateien prüfen" -ForegroundColor Cyan
$required = @(
  '.\supabase\migrations\20260617_pv_launch_baseline.sql',
  '.\supabase\functions\send-pv-lead-email\index.ts',
  '.\scripts\generate-sitemap.js',
  '.\scripts\create-customer.ps1',
  '.\scripts\check-live-routes.ps1'
)
foreach ($file in $required) {
  if (!(Test-Path $file)) { throw "Fehlt: $file" }
  Write-Host "OK: $file" -ForegroundColor Green
}

Write-Host "3/4 Paket-Builds" -ForegroundColor Cyan
$tiers = @('starter', 'business', 'premium')
foreach ($tier in $tiers) {
  $env:VITE_PACKAGE_TIER = $tier
  Write-Host "Build: $tier" -ForegroundColor Cyan
  npm run build
}
Remove-Item Env:VITE_PACKAGE_TIER -ErrorAction SilentlyContinue

Write-Host "4/4 Fertig" -ForegroundColor Green
Write-Host "Launch-Check erfolgreich." -ForegroundColor Green
