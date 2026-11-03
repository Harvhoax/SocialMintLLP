import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {clarityProjectId, clarityPreferenceKey, clarityPreferenceLifetime, clarityTagUrl, privacyBlocksRecording, readRecordingPreference, recordingConsent, recordingEnvironmentAllowed, saveRecordingPreference, sensitiveRecordingUrl} from '../src/lib/clarity-config.mjs';
import {isPreviewDeployment} from '../src/lib/deploy-context.mjs';

assert.equal(clarityProjectId, 'z7v97eemj7');
assert.equal(clarityTagUrl, 'https://www.clarity.ms/tag/z7v97eemj7');
let value = null;
const storage = {getItem: () => value, setItem: (key, data) => {assert.equal(key, clarityPreferenceKey); value = data;}};
assert.equal(readRecordingPreference(storage, 100), null, 'No stored decision must not imply consent');
assert.equal(saveRecordingPreference(storage, true, 100), true);
assert.equal(readRecordingPreference(storage, 101), true);
assert.equal(readRecordingPreference(storage, 100 + clarityPreferenceLifetime), null, 'Expired consent must be renewed');
assert.equal(readRecordingPreference(storage, 99), null, 'Future timestamps are not trusted');
value = '{"version":1,"allowed":"true","savedAt":100}';
assert.equal(readRecordingPreference(storage, 101), null);
value = 'broken JSON';
assert.equal(readRecordingPreference(storage, 101), null);
assert.equal(saveRecordingPreference(storage, false, 100), true);
assert.equal(readRecordingPreference(storage, 101), false);
const unavailable = {getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
assert.equal(readRecordingPreference(unavailable), null);
assert.equal(saveRecordingPreference(unavailable, true), false);
assert.equal(privacyBlocksRecording({globalPrivacyControl: true}), true);
assert.equal(privacyBlocksRecording({doNotTrack: '1'}), true);
assert.equal(recordingEnvironmentAllowed(true, 'socialmintstudio.com', {}, 'https://socialmintstudio.com/'), true);
for (const args of [
  [false, 'socialmintstudio.com', {}, 'https://socialmintstudio.com/'],
  [true, 'localhost', {}, 'http://localhost:4173/'],
  [true, 'main--socialmintstudio.netlify.app', {}, 'https://main--socialmintstudio.netlify.app/'],
  [true, 'socialmintstudio.com', {doNotTrack:'1'}, 'https://socialmintstudio.com/'],
  [true, 'socialmintstudio.com', {}, 'https://socialmintstudio.com/?email=private@example.test'],
]) assert.equal(recordingEnvironmentAllowed(...args), false);
assert.equal(sensitiveRecordingUrl('https://socialmintstudio.com/?message=private'), true);
assert.equal(sensitiveRecordingUrl('https://socialmintstudio.com/#email=private%40example.test'), true);
assert.equal(sensitiveRecordingUrl('https://socialmintstudio.com/#contact'), false);
assert.equal(sensitiveRecordingUrl('https://socialmintstudio.com/?utm_source=linkedin'), false);
assert.deepEqual(recordingConsent(true), {analytics_Storage:'granted',ad_Storage:'denied'});
assert.deepEqual(recordingConsent(false), {analytics_Storage:'denied',ad_Storage:'denied'});
const component = readFileSync('src/components/SiteClarity.tsx', 'utf8');
assert.match(component, /strategy="lazyOnload"/);
assert.ok(component.includes("existing('stop')"), 'Withdrawal must stop recording, not just switch to cookieless recording');
assert.ok(!component.includes('dangerouslySetInnerHTML'), 'Use the trusted external Next Script loader without another inline allowance');
assert.ok(component.includes("window.addEventListener('storage'"), 'Changes apply across open tabs');
const headers = readFileSync('out/_headers', 'utf8');
for (const origin of ['https://www.clarity.ms','https://scripts.clarity.ms','https://*.clarity.ms','https://c.bing.com']) {
  assert.equal(headers.includes(origin), !isPreviewDeployment(), 'Clarity origins are production-only');
}
const home = readFileSync('out/index.html', 'utf8');
assert.match(home, /class="brief-panel" data-clarity-mask="true"/, 'Mask the form and review before the tracker starts');
for (const file of readdirSync('out', {recursive:true}).filter(file => file.endsWith('.html') && !file.includes('404') && !file.includes('_not-found'))) {
  assert.ok(readFileSync(`out/${file}`, 'utf8').includes('data-recording-preferences'), `${file}: visitors can change their decision`);
}
console.log('Clarity checks passed: explicit/expiring consent, withdrawal, privacy signals, production-only lazy loading, sensitive-URL guard and masked enquiry panel.');
