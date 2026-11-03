import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {analyticsPageLocation, analyticsReferrer, contactEvents, measurementId} from '../lib/analytics-config.mjs';
import {googleAnalyticsInitializer} from './analytics-csp.mjs';
import {isPreviewDeployment} from '../lib/deploy-context.mjs';

assert.equal(measurementId, 'G-WKYJ3WLFRL');
assert.equal(analyticsPageLocation('https://socialmintstudio.com/work?email=private%40example.com#private-message'), 'https://socialmintstudio.com/work');
assert.equal(analyticsReferrer('https://example.com/secret?email=private%40example.com'), 'https://example.com');
assert.equal(analyticsReferrer('invalid'), '');
assert.deepEqual(contactEvents('unexpected-private-value', true), []);
assert.deepEqual(contactEvents('email'), [{name: 'email_click', params: {contact_context: 'direct'}}]);
assert.deepEqual(contactEvents('whatsapp', true), [
  {name: 'whatsapp_click', params: {contact_context: 'enquiry'}},
  {name: 'enquiry_handoff', params: {contact_channel: 'whatsapp'}},
]);
assert.ok(!JSON.stringify(contactEvents('email', true)).includes('generate_lead'), 'Handoff is not a confirmed received lead');
const initializer = googleAnalyticsInitializer();
const sandbox = {window: {dataLayer: []}};
runInNewContext(initializer, sandbox);
assert.equal(sandbox.window.dataLayer.filter(args => args[0] === 'config').length, 1, 'One config/page_view command');
assert.equal(sandbox.window.dataLayer.find(args => args[0] === 'config')[1], measurementId);
const headers = readFileSync('out/_headers', 'utf8');
const hash = `'sha256-${createHash('sha256').update(initializer).digest('base64')}'`;
assert.equal(headers.includes(hash), !isPreviewDeployment(), 'Only production authorizes the exact official initializer');
assert.equal(headers.includes('https://www.googletagmanager.com'), !isPreviewDeployment());
assert.ok(!headers.includes('doubleclick.net') && !headers.includes('googleadservices.com'), 'Advertising origins are not permitted');
const source = readFileSync('components/SiteAnalytics.tsx', 'utf8');
assert.ok(source.includes('analyticsHosts.includes(location.hostname)'), 'Local and preview hosts do not collect');
assert.ok(source.includes('globalPrivacyControl') && source.includes('doNotTrack'));
const brief = readFileSync('components/ContactBrief.tsx', 'utf8');
assert.ok(!/href=\{links\.(whatsapp|email)\}/.test(brief), 'Enhanced outbound-link tracking must not read enquiry body URLs');
assert.ok(brief.includes('data-analytics-context="enquiry"'));
let checked = 0;
for (const file of readdirSync('out', {recursive: true}).filter(file => file.endsWith('.html'))) {
  const html = readFileSync(`out/${file}`, 'utf8');
  assert.ok(!/googletagmanager\.com\/(?:gtm\.js|ns\.html)/.test(html), 'No second GTM container');
  checked++;
}
console.log(`Analytics checks passed: ${checked} pages, one GA4 initializer, exact CSP hash, preview isolation and contact payload privacy.`);
