# SocialMint Netlify deployment

Owner account: **tusharsingh@socialmintstudio.com**. Project: **socialmintstudio**.

Current state (3 November 2026): the static website is uploaded as a production deployment, but **production and previews remain Private at the owner's explicit request**. Anonymous visitors receive Netlify's authentication gate. No DNS records or public visibility settings have been changed. The current upload is manual; GitHub continuous deployment is not yet connected.

- Public hosting URL: https://socialmintstudio.netlify.app
- Dashboard: https://app.netlify.com/projects/socialmintstudio
- Canonical business origin: https://socialmintstudio.com
- Publish directory: `out/`; build command: `npm run build`; Node: 22.
- The existing Vercel project is retained until the custom-domain migration is verified.

## Build and export

Run `npm ci`, then `npm run build`. The build runs form/security tests, Next static export, generation of Netlify security/routing files, the SEO audit and Netlify artifact verification. It emits 23 content pages, media and social previews, a sitemap, robots file, `_headers`, `_redirects` and the real 404 document. All fourteen SD and HD films and poster images are included.

`netlify.toml` disables the Next server runtime and output post-processing. Serve/upload the contents of `out/` without manually changing the HTML or scripts, since the security policy authorizes inline scripts by their exact hashes. No database, server functions or form service is needed for the current WhatsApp/email enquiry handoff.

For a production artifact use `NETLIFY=true` and `CONTEXT=production` at build time. Netlify provides these automatically on hosted builds. For preview testing use `CONTEXT=deploy-preview`; every page and the generated headers should be noindex. Never publish a preview-built folder as production without rebuilding it.

## Deployment and account safety

Verify `netlify status` identifies the correct account before deploying. Local linking/authentication files are excluded from Git. Do not paste credentials into chat, add them to `netlify.toml`, or include them in an archive.

Deploy a draft first with `netlify deploy --dir out --no-build`. Check known routes, unknown-path 404, security headers, muted playback, video byte ranges, readable mobile layout, the enquiry review/copy/edit controls and browser CSP errors. After checks pass, publish with `netlify deploy --dir out --no-build --prod` or publish that verified deploy in the dashboard.

A manual deployment does not automatically establish GitHub continuous deployment. If the repository is not connected in the dashboard, link `Harvhoax/SocialMintLLP`, branch `main`, with the existing project's build/publish settings. GitHub may require the owner's app authorization. Use previews for intermediate changes and batch production releases to preserve the account's 300-credit allowance. Keep billing/usage notifications enabled; no paid plan or recharge is required by this configuration.

Dashboard path: **Project configuration → Developer settings → Repository → Link repository → Link to an existing repository → GitHub**. The automated browser reached this screen but the GitHub authorization launch did not progress. No extra GitHub app access was granted in this pass. Check the build settings and explicit repository permissions before completing the connection. Until then, future Git pushes alone do not update Netlify.

The private deployed review caught a trailing-slash self-redirect in the initial generated rules. It was corrected and redeployed; build checks now reject slash-only redirects. Netlify considers slash and non-slash forms equivalent when matching redirect rules, so do not add `/page/ → /page` rules. Existing browsers that visited the initial rule may retain a permanent redirect; the fresh deploy URL confirmed the corrected routing.

## Domain cutover

Assign `socialmintstudio.com` and `www.socialmintstudio.com` to this Netlify project, then use its **Domain management → Pending DNS verification** instructions. Keep the apex as primary to match existing canonicals; www redirects to it.

For standard Netlify hosting with external GoDaddy DNS, the documented fallback is an apex `A` record for `@` pointing to `75.2.60.5`, and a `www` CNAME pointing to `socialmintstudio.netlify.app`. Confirm the project's customized DNS instructions before saving. Remove conflicting old website destinations only. Preserve all Zoho MX, SPF, DKIM, DMARC and verification records and the existing nameservers.

Netlify cannot change an externally hosted DNS zone merely because the domain is assigned in its dashboard. Domain HTTPS is not complete until DNS resolves to the new host and Netlify issues the certificate. Verify HTTP/www redirects, valid HTTPS, deep links and mailbox delivery after cutover. No paid SSL certificate is needed.

Reference: [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/), [custom headers](https://docs.netlify.com/manage/routing/headers/).
