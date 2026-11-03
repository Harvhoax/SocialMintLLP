export const measurementId = 'G-WKYJ3WLFRL';
export const analyticsHosts = ['socialmintstudio.com', 'www.socialmintstudio.com'];

export function analyticsPageLocation(href) {
  const url = new URL(href);
  return `${url.origin}${url.pathname}`;
}

export function analyticsReferrer(referrer) {
  try { return new URL(referrer).origin; } catch { return ''; }
}

// Fixed vocabulary only: never forward form values, link URLs or link text.
export function contactEvents(channel, enquiry = false) {
  if (!['whatsapp', 'email', 'phone'].includes(channel)) return [];
  const events = [{name: `${channel}_click`, params: {contact_context: enquiry ? 'enquiry' : 'direct'}}];
  if (enquiry) events.push({name: 'enquiry_handoff', params: {contact_channel: channel}});
  return events;
}
