param(
  [Parameter(Mandatory=$true)] [string]$Domain
)

$ErrorActionPreference = "Continue"
$domainClean = $Domain.TrimEnd('/')
$routes = @(
  '/',
  '/pv-rechner',
  '/stromkosten-sparen',
  '/speicher-rechner',
  '/foerder-check',
  '/photovoltaik-kosten',
  '/foerderung',
  '/referenzen',
  '/angebot-anfordern',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/sitemap.xml',
  '/robots.txt'
)

foreach ($route in $routes) {
  $url = "$domainClean$route"
  try {
    $response = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -TimeoutSec 15
    $status = [int]$response.StatusCode
    if ($status -ge 200 -and $status -lt 400) {
      Write-Host "OK $status $url" -ForegroundColor Green
    } else {
      Write-Host "WARN $status $url" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "FAIL $url - $($_.Exception.Message)" -ForegroundColor Red
  }
}
