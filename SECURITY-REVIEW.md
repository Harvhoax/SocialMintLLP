# Pre-hosting security review — 2 November 2026

Scope: current local Next.js static export, dependency advisory audit (including development dependencies), form and storage code, external links, structured-data serialization, deployment configuration and existing export checks. This is a bounded code/configuration review, not a penetration-test certification or a guarantee that every vulnerability or browser edge case has been found.

## Findings and fixes

- Privacy: enquiry drafts previously persisted indefinitely in localStorage. New drafts now remain only in component memory and are cleared when leaving/reloading; the old draft key is removed on mount. Saving/downloading/emailing is explained accurately. Browser storage denial no longer prevents preparing a draft.
- Validation: punctuation-only phone strings previously passed; phone numbers now require 10–15 digits. Added bounded name/contact/message/service lengths, normalized submitted values, and rejection of name newline/header injection characters.
- Submission surface removed: the current form does not POST to any backend or accept an endpoint environment variable. It validates and prepares an enquiry locally; the visitor explicitly chooses WhatsApp or email and sends there. The UI never claims delivery. Edit preserves the fields, Clear removes them, and long messages switch to copy/paste without truncation.
- Draft downloads: use the validated in-memory draft, handle failures, and delay object URL revocation so the browser can start the download.
- Browser policy: Vercel configuration now denies framing with X-Frame-Options and CSP frame-ancestors, disables object embedding, restricts base URLs, and denies unneeded camera/microphone/geolocation permissions. Existing MIME-sniffing protection and referrer policy remain.

## Checks and boundaries

- `npm audit --json`: zero known advisories across the installed dependency graph at review time. This does not prove that dependencies have no undisclosed defects.
- Contact data is interpolated through React text or percent-encoded into mailto. JSON-LD escapes `<` before embedding. The code search found no eval or untrusted innerHTML sink. External new-tab links use noopener/noreferrer.
- Git's tracked environment-file inventory contains `.env.example` only, with blank configuration fields. This was not an exhaustive historical secret scan; review hosting secrets and repository history separately if credentials were ever committed.
- No app authentication, database, uploads or API mutation routes exist in this static export. SQL injection, session-cookie policy and application API authorization are therefore not active features to test here.
- The CSP is a baseline framing/object/base policy, **not a strict script-execution CSP**. A nonce-based policy requires a different serving architecture; a hash-based static policy needs generation and deployed-browser testing. Do not claim full CSP-based XSS protection.
- No form API exists in this version, so there is no publicly callable form submission endpoint to rate-limit. Validation is a usability safeguard, not an authentication boundary. WhatsApp/email providers handle actual delivery; their accounts and services are outside this audit. No test enquiry was transmitted.
- Mailto delivery depends on a configured mail application; the download and direct email/WhatsApp links remain fallbacks. A long enquiry can exceed a mail client's URL limit; use its downloaded copy in that case.
- Previously tested: mobile/desktop layout, native muted playback, video byte ranges, 404 responses, all local links, production/preview indexing. All media files intentionally published under public/ are publicly downloadable; there is no access control for portfolio assets.

## Before public launch

Verify actual deployed headers (Vercel headers do not run under next dev), HTTPS certificate/redirects and HSTS. Do not enable HSTS preload or includeSubDomains without checking every subdomain. Verify the info@ mailbox and SPF/DKIM/DMARC with the mail provider. Check Vercel/GitHub/registrar account MFA, permissions and spending/traffic alerts. CDN costs or traffic abuse need hosting-layer controls; application code cannot guarantee protection.

Run `node scripts/check-security.cjs`, `npm run build` and `npm audit` before release. Test the real domain's form/provider only with owner-authorized test data after it is configured. Domain/hosting account checks and real-device accessibility/network-failure coverage remain outside this local review.

References: [OWASP HTML5 security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html), [OWASP response headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html).

## Public checks completed on 2 November 2026

- `https://social-mint-llp.vercel.app/` returns 200 over verified HTTPS and supplies HSTS. An unknown path correctly returns 404. The production response does not yet include the new app security headers; the current `/services`, `/robots.txt` and `/sitemap.xml` return 404. Deploying the prepared revision is required before retesting.
- The apex domain currently resolves to `3.33.130.190` and `15.197.148.33`, using `ns19.domaincontrol.com` and `ns20.domaincontrol.com`. HTTP returns 200, but apex and www HTTPS fail TLS name negotiation. It is not yet serving this Vercel app with working HTTPS. Do not bypass certificate warnings.
- Public MX records point to `mx.zoho.in`, `mx2.zoho.in` and `mx3.zoho.in`. SPF is `v=spf1 include:zoho.in ~all`. A DKIM public key is published at `zoho._domainkey`; DMARC is published with `p=quarantine` and relaxed alignment. These observations verify published records, not actual outbound signing or existence/deliverability of `info@`.
- Remaining owner/account-dependent tasks: add apex and www to the existing Vercel project's production Domains settings; copy Vercel's exact current records to GoDaddy while preserving all mail records; verify domain/certificate issuance and redirects; verify mailbox receipt/signing with an authorized test; review MFA and hosting permissions. No authenticated dashboard access was available in this pass, so no DNS or account setting was changed.
- Local browser control is disabled in Work settings, preventing the interactive form review and authenticated hosting-dashboard checks. Validation/URL tests and production checks passed; a visual check of the latest review/copy/edit states remains necessary.
