# SocialMint search launch

Primary origin: **https://socialmintstudio.com**. Target market: **Mumbai, India**, confirmed by the owner. This implementation prepares the local app; it does not connect DNS, deploy, verify search-console accounts or submit indexing requests.

## Prepared in the app

- 23 crawlable static pages: home, services directory, six service pages, film library and fourteen individual watch pages.
- Unique descriptive titles and descriptions, one main heading per page, production canonicals and Open Graph/Twitter previews. A branded 1200 × 630 social image is generated locally at build time.
- Organization, team member and service data using the actual roles, LinkedIn profiles, contact details and service areas. Breadcrumbs on directory and detail pages. No invented address, ratings, clients, prices or outcomes.
- Human-readable answers and internal links. Search/answer crawlers receive the same HTML as visitors. No hidden SEO copy, keyword lists, fake FAQ rich-result promises or AI-only version of the site.
- `/robots.txt` allows public crawling and points to `/sitemap.xml`. The sitemap includes stable film thumbnails and video files. Sitemap modification dates are omitted rather than reset on every build.
- Direct watch pages have an actual HTML video source and poster, native controls, muted defaults, and `preload="none"`. The existing gallery still loads only its centered preview. Film-rich-result JSON-LD waits for confirmed publication dates; see below.
- WOFF2 fonts, lazy partner portraits, shorter artificial loading delay and lightweight server-rendered content routes. No analytics, tracking dependency or consent banner added in this pass.
- Vercel preview/development builds use `noindex, follow`; production is indexable. A build created as a preview must be rebuilt in the production environment before it is used for launch.

## Connect the domain after local review

1. Push and deploy this revision to the existing Vercel project. Use the Next.js framework setting, `npm run build`, and the default output setting; the app retains static export support.
2. In the project's **Settings → Domains**, add `socialmintstudio.com` for production. Add `www.socialmintstudio.com` as well and redirect it permanently to `https://socialmintstudio.com` (the canonical origin chosen in the code).
3. At the authoritative DNS provider, apply the **exact records Vercel shows for this project**. Do not copy a generic IP/CNAME from an old tutorial. Preserve unrelated MX/TXT email records. Wait for Vercel to report a valid configuration and issue HTTPS.
4. Check apex, www and HTTP variants. They should resolve to one HTTPS origin, preserving the path. Check `/services/video-production`, `/work/socialcox`, `/robots.txt`, `/sitemap.xml` and `/social-image.png` on the public domain. A nonexistent path must return HTTP 404, not the home page with HTTP 200.
5. If the previous public hostname is indexed, set permanent redirects from its URLs to the corresponding new domain URLs where you control the old host. Canonicals are a signal, not a substitute for these redirects. Do not add an unconditional redirect that also catches preview/local hosts.
6. Verify production is publicly accessible without Vercel authentication or a bot challenge that prevents compliant search crawlers from accessing pages, images, scripts and videos.

Source: [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [Google site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).

## Search-console setup after DNS works

1. Add the **Domain property** `socialmintstudio.com` to [Google Search Console](https://search.google.com/search-console). Add the exact ownership TXT record Google supplies to the authoritative DNS zone and complete verification. Keep the TXT record in place.
2. Submit `https://socialmintstudio.com/sitemap.xml`. Use URL Inspection's live test on the home page and a representative service and film page; inspect the selected canonical, crawl permissions and rendered content, then request indexing for the important starting pages. A sitemap or indexing request does not guarantee inclusion or ranking.
3. Add the site to [Bing Webmaster Tools](https://www.bing.com/webmasters/) and submit the same sitemap. If you choose HTML verification for a URL-prefix property instead, set the optional `GOOGLE_SITE_VERIFICATION` and/or `BING_SITE_VERIFICATION` token in Vercel and rebuild. Do not enter an API key, account password or full HTML tag in those fields.
4. Validate public pages with [Schema Markup Validator](https://validator.schema.org/) and applicable markup with [Google Rich Results Test](https://search.google.com/test/rich-results). A valid Service schema does not promise a special Google result.
5. Run [PageSpeed Insights](https://pagespeed.web.dev/) for mobile and desktop home, a service page and a watch page. Track LCP, INP and CLS as real-user field data becomes available. Local builds and file-size reductions are not evidence of passing live Core Web Vitals.

Source: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Video details to complete

Enter the true initial public release timestamp for each film in `reelPublicationDates` in `data/reel-details.ts`, as an ISO 8601 value with timezone, only after the owner confirms it. That enables the existing `VideoObject` generator. Do not use today's date, a build date, file modification date or transcode timestamp as a substitute. If a film has never been public, record its actual first release when it launches.

For stronger individual watch pages, add owner-approved project context (the brief, SocialMint's specific contribution and an accurate transcript or captions where relevant). Do not claim a named brand is a client or invent performance metrics based on a sample filename. Check publication permission before adding client names, results or testimonials.

Source: [Google video SEO](https://developers.google.com/search/docs/appearance/video), [VideoObject requirements](https://developers.google.com/search/docs/appearance/structured-data/video).

## Mumbai visibility and ongoing work

- If SocialMint meets Google's eligibility rules for an in-person or service-area business, create/verify its real [Business Profile](https://www.google.com/business/). Confirm the actual location/service area and business details; use the site's name, phone and URL consistently. Do not invent an office or create duplicate location profiles.
- Add the domain to the partners' LinkedIn profiles and actual company social profiles. Add verified company URLs to Organization `sameAs` when available; the partners' personal LinkedIn URLs belong on their Person entities.
- Publish real, permissioned case studies with the initial brief, work delivered, specific process and measured results where available. Prioritize material that answers actual client questions. Avoid mass-produced city pages, bought links, fake reviews and thin AI articles.
- Review Search Console queries, impressions, clicks and leads regularly. Improve the pages matching real demand such as social media management, reels editing and video production in Mumbai. Track enquiries alongside traffic; rankings change and are not guaranteed.
- Google's generative search guidance uses the same crawlability, content quality and page-experience foundations. `llms.txt`, special AI schema and keyword stuffing are not requirements for Google AI visibility. There is no separate AEO/GEO ranking submission in this app.

Source: [Google generative search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

## Repeatable local checks

Every `npm run build` now runs the SEO audit automatically and fails on a regression. Both production and Vercel preview builds have been tested: production allows indexing, while previews emit noindex. Checks include reachability of every sitemap page through HTML links from home, mobile viewport metadata, image alt attributes, social-image files, self canonicals, unique titles/descriptions, parseable structured data, video assets and noindex on the 404 page.

`vercel.json` adds browser/CDN caching for reels, fonts, hero images and portraits, plus content-type sniffing protection and a referrer policy. Unversioned asset names deliberately use finite cache lifetimes rather than immutable caching. Replacing an asset at the same URL can retain an old browser copy until its cache expires; use a new filename for an immediate content replacement. HTML keeps the framework's default cache policy. Verify actual response headers after deployment because localhost does not apply Vercel's configuration.

### Coverage and outstanding evidence

| Area | Local coverage | Needed after launch / from owner |
| --- | --- | --- |
| Technical SEO | Static HTML, canonicals, robots, sitemap, internal links, 404 policy | Public crawl and Google-selected canonicals |
| Mumbai targeting | Service copy, titles and truthful service-area data | Eligible Business Profile and actual company profile links |
| Answer-engine discovery | Readable answers, entity data and accessible pages | Real citations and search performance monitoring |
| Video discovery | Fourteen native watch pages, stable files/posters, video sitemap | Confirmed publication dates, accurate captions/transcripts |
| Speed | WOFF2, lazy portraits, limited video preload, asset cache policy | Mobile/desktop field LCP, INP, CLS and CDN cache headers |
| Accessibility | Semantic headings, skip links, alt attributes, native FAQ/player, keyboard navigation | Full assistive-technology audit if formal conformance is required |
| Deployment | Production and preview build checks | DNS, HTTPS, www redirect, ownership verification and sitemap submission |

Local checks are not a claim of perfect Lighthouse scores, formal accessibility certification or guaranteed rankings.

```text
npm run build
npm run check:seo
```

The check validates exported HTML rather than relying on browser hydration. Also review navigation, the native film player and the homepage questions at mobile and desktop sizes. Changes remain local until explicitly pushed/deployed.

The current database-free form uses review → WhatsApp/email delivery, with copy/download for long messages. `NEXT_PUBLIC_FORM_ENDPOINT` is no longer used. Public domain/mail observations and remaining account-dependent tasks are recorded in SECURITY-REVIEW.md.
