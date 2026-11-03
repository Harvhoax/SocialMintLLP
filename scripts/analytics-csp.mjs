import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
import {measurementId} from '../lib/analytics-config.mjs';

// next/script inserts this official component's initializer after hydration,
// so it isn't an inline script in exported HTML. Hash its exact installed text.
export function googleAnalyticsInitializer() {
  const require = createRequire(import.meta.url);
  const source = readFileSync(join(dirname(require.resolve('@next/third-parties/google')), 'ga.js'), 'utf8').replace(/\r\n/g, '\n');
  const template = source.match(/__html:\s*`([\s\S]*?)`/)?.[1];
  if (!template) throw new Error('Cannot locate the official GoogleAnalytics initializer');
  const text = template.replaceAll('${dataLayerName}', 'dataLayer').replaceAll('${gaId}', measurementId)
    .replace('${debugMode ? ",{ \'debug_mode\': true }" : \'\'}', '');
  if (text.includes('${')) throw new Error('GoogleAnalytics initializer changed: review its CSP hash');
  return text;
}
