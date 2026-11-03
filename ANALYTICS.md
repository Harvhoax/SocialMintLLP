# Google Analytics 4

Measurement ID: **G-WKYJ3WLFRL**, supplied by the owner for Social Mint / socialmintstudio.com. This is public configuration, not a credential.

`components/SiteAnalytics.tsx` uses the official `@next/third-parties/google` component once in the root layout. Scripts load after hydration. Production builds on the apex/www business domain collect activity; development, localhost, Netlify preview builds and preview URLs do not. Do Not Track, Global Privacy Control and Google's `ga-disable-G-WKYJ3WLFRL` flag prevent initialization when enabled. Ad blockers may also prevent collection.

The component queues privacy settings before the first config/page_view: Google advertising signals and ad personalization are disabled. It does not set user IDs or user-provided data. Reported page locations omit query strings and fragments; referrers contain origin only. This deliberately limits campaign/query attribution and referral detail. Existing Enhanced Measurement can supply pageviews and engagement; the application does not send a duplicate manual page_view.

## Contact events

| Event | Trigger | Allowed custom parameters |
| --- | --- | --- |
| `whatsapp_click` | Direct WhatsApp link or enquiry WhatsApp button | `contact_context`: direct/enquiry |
| `email_click` | Direct email link or enquiry email button | `contact_context`: direct/enquiry |
| `phone_click` | Business telephone link | `contact_context`: direct |
| `enquiry_handoff` | Validated enquiry's WhatsApp/email continuation button | `contact_channel`: whatsapp/email |

Events contain a fixed vocabulary, never names, contact fields, message bodies, raw destination URLs or element text. Enquiry continuation uses buttons instead of anchors so Enhanced Measurement's outbound-click listener cannot read a URL containing the message. Review, copying and downloading do not count as received enquiries.

`generate_lead` and `book_appointment` are intentionally absent: the current site cannot verify a sent message, received lead or confirmed booking. Add those events only when there is a real confirmation signal from the corresponding service. Avoid counting both a contact click and its enquiry_handoff as separate confirmed leads.

## Security and maintenance

The exported CSP allows Google's tag script and limited Analytics collection origins. It retains exact inline hashes, script-src-attr none, no unsafe-eval and no unsafe-inline scripts. `scripts/analytics-csp.mjs` reads the exact installed official initializer to authorize the after-hydration script, which is not present as a script body in server-rendered HTML. Dependencies are locked; unexpected initializer placeholders fail the build. Do not add a second Google Tag Manager or Analytics tag.

`npm run build` now includes `check:analytics`: measurement ID, initialization count, official initializer hash, production/preview CSP, URL sanitization, safe contact event payloads and enquiry URL exposure are checked along with the existing security, SEO and media audits.

## Owner verification in GA4

Open the existing Social Mint property, then Reports → Realtime. Visit the public website in a browser where Analytics is allowed. Google's Test installation and the browser's Network panel can confirm a gtag.js script request and a g/collect request with tid=G-WKYJ3WLFRL. A successful collection request does not itself prove that the correct property reports have populated.

The browser available during integration opened Analytics's Start measuring screen rather than the existing property. No second account/property was created. Realtime confirmation and Key Event settings require access to the existing property.

After events arrive, use Admin → Data display → Events/Key events to mark the chosen intent events (such as enquiry_handoff) as Key Events. These measure intent, not confirmed receipt. Register contact_context and contact_channel as event-scoped custom dimensions if you want them in exploration breakdowns. Review Enhanced Measurement settings in the stream; automatic form_submit means the local review action, not a delivered enquiry. Keep it out of lead conversion totals.

References: [Next.js official integration](https://nextjs.org/docs/app/guides/third-party-libraries), [Google pageview behavior](https://developers.google.com/analytics/devguides/collection/ga4/views), [Enhanced Measurement and personal data](https://support.google.com/analytics/answer/9216061), [Google CSP requirements](https://developers.google.com/tag-platform/security/guides/csp).
