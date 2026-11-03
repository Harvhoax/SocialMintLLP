import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { isPreviewDeployment } from '../src/lib/deploy-context.mjs';
import { googleAnalyticsInitializer } from './analytics-csp.mjs';

const out = join(process.cwd(), 'out');
const htmlFiles = readdirSync(out, { recursive: true }).filter(file => file.endsWith('.html'));
const hashes = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(join(out, file), 'utf8');
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>(.*?)<\/script>/gs)) {
    if (/\bsrc=/.test(attributes) || /application\/ld\+json/.test(attributes) || !body) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
}
const analytics = !isPreviewDeployment();
if (analytics) hashes.add(`'sha256-${createHash('sha256').update(googleAnalyticsInitializer()).digest('base64')}'`);
const csp = [
  "default-src 'self'", `script-src 'self' ${analytics ? 'https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms ' : ''}${[...hashes].sort().join(' ')}`,
  "script-src-attr 'none'", "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${analytics ? ' https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com' : ''}`, "font-src 'self'", "media-src 'self' blob:",
  `connect-src 'self'${analytics ? ' https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://*.clarity.ms' : ''}`, "worker-src 'self' blob:", "object-src 'none'",
  "base-uri 'none'", "frame-ancestors 'none'", "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');
let headers = `# Generated at build time. Rebuild after changing any HTML or script.\n/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Permitted-Cross-Domain-Policies: none\n  Content-Security-Policy: ${csp}\n`;
if (isPreviewDeployment()) headers += '  X-Robots-Tag: noindex, follow\n';
// HTML revalidates. Fingerprinted assets can also stay in the visitor browser cache.
headers += '\n/_next/static/*\n  Cache-Control: public, max-age=31536000, immutable\n';
headers += '\n/media/*\n  Cache-Control: public, max-age=31536000, immutable\n';
for (const folder of ['reels', 'hero', 'team']) {
  headers += `\n/${folder}/*\n  Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400\n`;
}
headers += '\n/fonts/*\n  Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400\n';
writeFileSync(join(out, '_headers'), headers);

const sitemap = readFileSync(join(out, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
let redirects = '# Exact static routes; never rewrite unknown URLs to the home page.\nhttps://www.socialmintstudio.com/* https://socialmintstudio.com/:splat 301!\n';
for (const path of paths.filter(path => path !== '/')) {
  // Netlify matches redirect paths with and without a trailing slash. A
  // /page/ -> /page rule therefore redirects /page to itself indefinitely.
  redirects += `${path} ${path}.html 200\n`;
}
redirects += '/* /404.html 404\n';
writeFileSync(join(out, '_redirects'), redirects);
console.log(`Netlify export prepared: ${paths.length} page routes, real 404, ${hashes.size} trusted inline script hashes and ${isPreviewDeployment() ? 'preview noindex' : 'production indexing'}.`);
