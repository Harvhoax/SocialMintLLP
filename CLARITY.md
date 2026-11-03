# Microsoft Clarity

Owner-supplied project: **SocialMint / z7v97eemj7**, website socialmintstudio.com. The existing GA4 property and contact events are unchanged.

## Loading and consent

`components/SiteClarity.tsx` uses Next.js Script with `lazyOnload` to request the official project tag once. It starts only on the production business domain after the visitor chooses **Allow recording**. There is no Clarity request before a decision or after an initial decline. The footer's **Recording preferences** control is available on all content pages. This control applies only to session recording; it does not change GA4.

The Clarity project's **Settings → Setup → Cookies** default is Off, enabling consent mode as documented by Microsoft. Before requesting the tag, the app queues Consent V2 with analytics_Storage granted and ad_Storage denied. No advertising consent or user identifiers are sent. A decline after recording started sends denied consent and stops the SDK; starting again uses the SDK's start command. These lifecycle commands are supported in Microsoft's open-source client. They avoid a reload that would discard an unfinished enquiry.

The preference stores only a version, boolean and timestamp, expires after 180 days, and propagates across open tabs. Storage failures leave the decision in memory for the current page with a notice. Do Not Track and Global Privacy Control prevent recording. Local development, localhost, Netlify previews and preview domains never request the tag. URLs/referrers with recognizable sensitive query keys, email-like path/fragment values or malformed encoding also prevent initialization. This guard is deliberately limited; do not place personal data in public URLs.

## Masking

- The entire `.brief-panel` has `data-clarity-mask="true"` before the SDK can initialize. This covers name/contact inputs, message fields, validation/review states and the read-only enquiry preview.
- Clarity project settings retain **Balanced** masking, with an explicit **Mask** rule for `.brief-panel` as a second layer. The app attribute applies immediately to new recordings; remote dashboard setting changes can take longer to propagate.
- The recording preference panel is masked. No custom identify calls, form values or enquiry bodies are passed to Clarity.
- Enquiry handoff buttons keep private mailto/WhatsApp message URLs out of DOM href attributes. GA4 and Clarity can measure the interaction without reading the message from an outbound anchor.

Clarity records DOM interactions; it cannot reproduce content drawn inside the WebGL/canvas hero and film gallery. Use recordings to inspect navigation, layout, service cards and the enquiry flow, and use GA4 for contact intent counts. Heatmap/session data do not prove that a message was sent or a lead was received.

## Security and resource use

Production CSP permits the official www.clarity.ms tag and scripts.clarity.ms client bundle, *.clarity.ms collection/image endpoints and c.bing.com images. Other script origins remain denied. No unsafe-inline scripts, unsafe-eval, server functions, database, paid dependency or second tag-manager container was added. The loader is an external Next Script; there is no new inline snippet to authorize.

Clarity script delivery and collection use Microsoft infrastructure. The site still serves its own small integration bundle, and playing back recordings may fetch public images from the site; this does not guarantee zero additional hosting bandwidth. Click-to-play video behavior is retained.

## Verification

The build checks default/expired/invalid consent, blocked storage, privacy signals, preview/host isolation, sensitive-URL examples, denied advertising storage, lazy loading, withdrawal handling and masking. Browser QA covers decline, persistence, re-opening, opt-in and narrow-screen layout before release.

After deployment, allow recording on a controlled public-site visit, browse the homepage/services/contact flow and use synthetic contact details without sending a message. End the visit and check the project's Recordings view. Confirm the form/review text is masked in playback; do not treat merely loading the tag as proof of a processed recording.

References: [Microsoft setup](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup), [Consent mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode), [Consent V2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2), [Masking](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking), [Client lifecycle implementation](https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/clarity.ts).
