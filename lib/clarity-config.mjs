import {analyticsHosts} from './analytics-config.mjs';

export const clarityProjectId = 'z7v97eemj7';
export const clarityTagUrl = `https://www.clarity.ms/tag/${clarityProjectId}`;
export const clarityPreferenceKey = 'socialmint-recording-preference-v1';
export const clarityPreferenceLifetime = 180 * 24 * 60 * 60 * 1000;

export function readRecordingPreference(storage, now = Date.now()) {
  try {
    const value = JSON.parse(storage.getItem(clarityPreferenceKey));
    if (value?.version !== 1 || typeof value.allowed !== 'boolean' || !Number.isFinite(value.savedAt)) return null;
    const age = now - value.savedAt;
    return age >= 0 && age < clarityPreferenceLifetime ? value.allowed : null;
  } catch { return null; }
}

export function saveRecordingPreference(storage, allowed, now = Date.now()) {
  try {
    storage.setItem(clarityPreferenceKey, JSON.stringify({version: 1, allowed, savedAt: now}));
    return true;
  } catch { return false; }
}

export function privacyBlocksRecording(privacy) {
  return privacy.globalPrivacyControl === true || privacy.doNotTrack === '1';
}

export function sensitiveRecordingUrl(href) {
  if (!href) return false;
  try {
    const url = new URL(href);
    const privateValue = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (privateValue.test(decodeURIComponent(url.pathname + url.hash)) || /(?:^|[?&#])(?:name|email|phone|contact|message|body|password|token|access_token)=/i.test(url.hash)) return true;
    return [...url.searchParams].some(([key, value]) => /^(?:name|email|phone|contact|message|body|password|token|access_token)$/i.test(key) || privateValue.test(value));
  } catch { return true; }
}

export function recordingEnvironmentAllowed(production, hostname, privacy, href, referrer = '') {
  return production && analyticsHosts.includes(hostname) && !privacyBlocksRecording(privacy) && !sensitiveRecordingUrl(href) && !sensitiveRecordingUrl(referrer);
}

// Queue the actual visitor decision before requesting the Microsoft tag.
// Advertising storage remains denied for every choice.
export function recordingConsent(allowed) {
  return {analytics_Storage: allowed ? 'granted' : 'denied', ad_Storage: 'denied'};
}
