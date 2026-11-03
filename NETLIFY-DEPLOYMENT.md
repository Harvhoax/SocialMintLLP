# SocialMint Netlify deployment

Owner account: **tusharsingh@socialmintstudio.com**. Project: **socialmintstudio**.

Current state (3 November 2026): **production is Public and previews remain Private**. The custom domain is active. Continuous deployment is connected to `Harvhoax/SocialMintLLP`, production branch `main`, using a read-only SSH deploy key and an active GitHub push webhook. Every push to `main` builds the static export, runs the security/SEO/media checks, and publishes only if the build succeeds. The review branch `pre-deployment` does not automatically publish.

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

The automatic path is now **approved merge/push to main → GitHub push webhook → Netlify production build → successful checks → publish socialmintstudio.com**. The Netlify project uses Node 22, build command `npm run build`, publish directory `out`, and `netlify.toml` for export and processing settings. Main is the only allowed automatic branch. Existing preview authentication remains enabled.

The GitHub deploy key is read-only, scoped to this repository. The webhook subscribes only to push events and uses verified HTTPS. Its capability URL is sensitive and is not stored in source control. No GitHub personal access token was sent to Netlify, and no Netlify API token was added to GitHub Actions. Existing local account authentication is used only for administration.

For future changes, work and push on pre-deployment, pass the checks, review locally, then obtain the owner's approval before promoting to main. A main push now starts a production release, so batch changes to conserve credits. A manual CLI deployment remains available for recovery, but do not run both paths for the same release. Rollback remains available in the Netlify deploy dashboard.

For documentation-only commits, `[skip netlify]` in the commit message skips a redundant Netlify deployment while GitHub checks still run. Ordinary main pushes without this marker publish automatically. Do not use it for an application release that should go live.

If automatic delivery fails, inspect the repository webhook deliveries, then the Netlify deploy log. Confirm the repository is Harvhoax/SocialMintLLP, production branch main, build npm run build and publish out. Do not create duplicate webhooks or expose credentials in build output.

The private deployed review caught a trailing-slash self-redirect in the initial generated rules. It was corrected and redeployed; build checks now reject slash-only redirects. Netlify considers slash and non-slash forms equivalent when matching redirect rules, so do not add `/page/ → /page` rules. Existing browsers that visited the initial rule may retain a permanent redirect; the fresh deploy URL confirmed the corrected routing.

## Domain cutover

The domain is already active. For future migration or DNS repairs, assign `socialmintstudio.com` and `www.socialmintstudio.com` to this Netlify project and follow its **Domain management → Pending DNS verification** instructions. Keep the apex as primary to match existing canonicals; www redirects to it.

For standard Netlify hosting with external GoDaddy DNS, the documented fallback is an apex `A` record for `@` pointing to `75.2.60.5`, and a `www` CNAME pointing to `socialmintstudio.netlify.app`. Confirm the project's customized DNS instructions before saving. Remove conflicting old website destinations only. Preserve all Zoho MX, SPF, DKIM, DMARC and verification records and the existing nameservers.

Netlify cannot change an externally hosted DNS zone merely because the domain is assigned in its dashboard. Domain HTTPS is not complete until DNS resolves to the new host and Netlify issues the certificate. Verify HTTP/www redirects, valid HTTPS, deep links and mailbox delivery after cutover. No paid SSL certificate is needed.

Reference: [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/), [custom headers](https://docs.netlify.com/manage/routing/headers/).
