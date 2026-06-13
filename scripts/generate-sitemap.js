import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DOMAIN = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://pv-system.digital-perfect.com').replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];

const STATIC_PAGES = [
  { path: '', changefreq: 'weekly', priority: '1.0' },
  { path: '/pv-rechner', changefreq: 'weekly', priority: '0.95' },
  { path: '/stromkosten-sparen', changefreq: 'weekly', priority: '0.9' },
  { path: '/speicher-rechner', changefreq: 'weekly', priority: '0.9' },
  { path: '/foerder-check', changefreq: 'weekly', priority: '0.9' },
  { path: '/photovoltaik-kosten', changefreq: 'weekly', priority: '0.88' },
  { path: '/foerderung', changefreq: 'weekly', priority: '0.82' },
  { path: '/referenzen', changefreq: 'monthly', priority: '0.72' },
  { path: '/angebot-anfordern', changefreq: 'weekly', priority: '0.85' },
  { path: '/kontakt', changefreq: 'monthly', priority: '0.5' },
  { path: '/impressum', changefreq: 'yearly', priority: '0.25' },
  { path: '/datenschutz', changefreq: 'yearly', priority: '0.25' },
  { path: '/agb', changefreq: 'yearly', priority: '0.2' },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map((page) => `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml);
console.log(`✅ Sitemap erstellt: ${STATIC_PAGES.length} URLs → ${outputPath}`);
