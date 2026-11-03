import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { isPreviewDeployment } from '../lib/deploy-context.mjs';

for (const [env, expected] of [
  [{}, false], [{VERCEL_ENV:'production'}, false], [{VERCEL_ENV:'preview'}, true],
  [{NETLIFY:'true',CONTEXT:'production'}, false], [{NETLIFY:'true',CONTEXT:'deploy-preview'}, true],
  [{NETLIFY:'true',CONTEXT:'branch-deploy'}, true], [{NETLIFY:'true'}, true],
  [{NETLIFY:'true',CONTEXT:'production',VERCEL_ENV:'preview'}, false],
]) assert.equal(isPreviewDeployment(env), expected, `Correct deploy indexing for ${JSON.stringify(env)}`);
const out = join(process.cwd(), 'out');
const headers = readFileSync(join(out, '_headers'), 'utf8');
const redirects = readFileSync(join(out, '_redirects'), 'utf8');
const config = readFileSync('netlify.toml', 'utf8');
assert.match(config, /publish = "out"/);
assert.match(config, /skip_processing = true/);
assert.match(config, /NETLIFY_NEXT_PLUGIN_SKIP = "true"/);
assert.match(headers, /X-Frame-Options: DENY/);
assert.match(headers, /X-Content-Type-Options: nosniff/);
const csp = headers.match(/Content-Security-Policy: ([^\n]+)/)?.[1];
assert.ok(csp);
const scripts = csp.split(';').find(d => d.trim().startsWith('script-src '));
assert.ok(scripts && !scripts.includes('unsafe-inline') && !scripts.includes('unsafe-eval') && !scripts.includes('https:'));
assert.match(csp, /frame-ancestors 'none'/);
assert.match(csp, /object-src 'none'/);
assert.match(csp, /form-action 'none'/);
assert.equal(/X-Robots-Tag: noindex/.test(headers), isPreviewDeployment());
assert.ok(Buffer.byteLength(csp) < 8000, 'CSP fits a conservative response-header size');
let scriptCount = 0;
for (const file of readdirSync(out, {recursive:true})) {
  assert.ok(!/(^|[\\/])(?:\.env[^\\/]*|\.git|\.netlify|node_modules)([\\/]|$)/.test(file), `No private build files published: ${file}`);
  if (!file.endsWith('.html')) continue;
  const html = readFileSync(join(out, file), 'utf8');
  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>(.*?)<\/script>/gs)) {
    if (/\bsrc=/.test(attributes) || /application\/ld\+json/.test(attributes) || !body) continue;
    assert.ok(csp.includes(`'sha256-${createHash('sha256').update(body).digest('base64')}'`), `${file}: every inline script is authorized by its exact hash`);
    scriptCount++;
  }
}
const paths = [...readFileSync(join(out, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
for (const path of paths.filter(path => path !== '/')) {
  assert.ok(existsSync(join(out, `${path.slice(1)}.html`)));
  assert.ok(redirects.includes(`${path} ${path}.html 200\n`), `Route ${path} resolves to its own exported file`);
}
assert.match(redirects, /\/\* \/404\.html 404\n$/);
assert.ok(!redirects.includes('/* /index.html 200'), 'No soft-404 catchall');
for (const line of redirects.split('\n').filter(line => line && !line.startsWith('#'))) {
  const [from, to, status] = line.split(/\s+/);
  if (status?.startsWith('30')) assert.notEqual(from.replace(/\/$/, ''), to.replace(/\/$/, ''), 'No slash-only self-redirects on Netlify');
}
console.log(`Netlify security/export checks passed: deploy contexts, static routing, headers, ${scriptCount} script hashes and no private files in publish output.`);
