const SYSTEM_SITE_URL = 'https://pv-system.digital-perfect.com';

function normalizeDomain(value) {
  const normalized = String(value || SYSTEM_SITE_URL).trim().replace(/\/+$/, '');
  try {
    const hostname = new URL(normalized).hostname;
    const oldWrongHost = ['pv', 'anlage'].join('-') + '.digital-perfect.com';
    return hostname === oldWrongHost ? SYSTEM_SITE_URL : normalized;
  } catch {
    return normalized;
  }
}

const DOMAIN = normalizeDomain(process.env.VITE_SITE_URL || process.env.SITE_URL || SYSTEM_SITE_URL);
const sitemapUrl = `${DOMAIN}/sitemap.xml`;

const endpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
];

console.log(`Sitemap: ${sitemapUrl}`);

for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint, { method: 'GET' });
    console.log(`${response.ok ? 'OK' : 'WARN'} ${response.status} ${endpoint}`);
  } catch (error) {
    console.log(`FAIL ${endpoint}`);
    console.log(error instanceof Error ? error.message : String(error));
  }
}
