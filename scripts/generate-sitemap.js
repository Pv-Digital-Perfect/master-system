import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const [rawKey, ...rawValueParts] = trimmed.split('=');
    const key = rawKey.trim();
    const rawValue = rawValueParts.join('=').trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.resolve(__dirname, '../.env'));
loadDotEnv(path.resolve(__dirname, '../.env.local'));

const DOMAIN = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://pv-system.digital-perfect.com').replace(/\/+$/, '');
const PACKAGE_TIER = String(process.env.VITE_PACKAGE_TIER || 'premium').trim().toLowerCase();
const today = new Date().toISOString().split('T')[0];

const packageFeatures = {
  starter: new Set(['pvCalculator', 'offerRequest', 'contact', 'photovoltaicCosts']),
  business: new Set(['pvCalculator', 'offerRequest', 'contact', 'photovoltaicCosts', 'savingsCalculator', 'storageCalculator', 'fundingOverview', 'fundingCheck']),
  premium: new Set(['pvCalculator', 'offerRequest', 'contact', 'photovoltaicCosts', 'savingsCalculator', 'storageCalculator', 'fundingOverview', 'fundingCheck', 'references']),
};

const activeFeatures = packageFeatures[PACKAGE_TIER] || packageFeatures.premium;

const STATIC_PAGES = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/pv-rechner', changefreq: 'weekly', priority: '0.95', feature: 'pvCalculator' },
  { path: '/photovoltaik-kosten', changefreq: 'weekly', priority: '0.88', feature: 'photovoltaicCosts' },
  { path: '/stromkosten-sparen', changefreq: 'weekly', priority: '0.9', feature: 'savingsCalculator' },
  { path: '/speicher-rechner', changefreq: 'weekly', priority: '0.9', feature: 'storageCalculator' },
  { path: '/foerder-check', changefreq: 'weekly', priority: '0.9', feature: 'fundingCheck' },
  { path: '/foerderung', changefreq: 'weekly', priority: '0.82', feature: 'fundingOverview' },
  { path: '/referenzen', changefreq: 'monthly', priority: '0.72', feature: 'references' },
  { path: '/angebot-anfordern', changefreq: 'weekly', priority: '0.85', feature: 'offerRequest' },
  { path: '/kontakt', changefreq: 'monthly', priority: '0.5', feature: 'contact' },
  { path: '/impressum', changefreq: 'yearly', priority: '0.25' },
  { path: '/datenschutz', changefreq: 'yearly', priority: '0.25' },
  { path: '/agb', changefreq: 'yearly', priority: '0.2' },
];

const visiblePages = STATIC_PAGES.filter((page) => !page.feature || activeFeatures.has(page.feature));

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${visiblePages.map((page) => `  <url>
    <loc>${DOMAIN}${page.path || '/'}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/login
Disallow: /auth/
Disallow: /my-account/

Sitemap: ${DOMAIN}/sitemap.xml
`;

const publicDir = path.resolve(__dirname, '../public');
const sitemapPath = path.resolve(publicDir, 'sitemap.xml');
const robotsPath = path.resolve(publicDir, 'robots.txt');

fs.writeFileSync(sitemapPath, sitemapXml);
fs.writeFileSync(robotsPath, robotsTxt);

console.log(`✅ Sitemap erstellt: ${visiblePages.length} URLs → ${sitemapPath}`);
console.log(`✅ Robots.txt aktualisiert → ${robotsPath}`);
console.log(`ℹ️ Paket: ${PACKAGE_TIER}`);
