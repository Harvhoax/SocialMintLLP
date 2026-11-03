# SocialMint bandwidth and credit budget

Implemented on `pre-deployment`, 3 November 2026. Production and `main` were not changed during this work.

## Measured changes

| Measure | Before | After |
| --- | ---: | ---: |
| Images and service artwork in the optimization report | 3,684,570 bytes | 741,817 bytes (79.9% smaller) |
| All 14 full-length SD films | 35,416,633 bytes | 23,079,419 bytes (34.8% smaller) |
| Cold homepage → Work visit, without pressing Play | 6,069,696 response bytes / 53 requests | 1,012,563 response bytes / 43 requests |
| MP4 requests during that visit | 1 automatic download | 0 |
| Repeat optimized homepage → Work visit | — | 14,203 response bytes / 3 requests; no media requests |

The browsing comparison saved 83.3% of response-body bytes in this local scenario. It used two distinct localhost origins for cold browser caches and the same production static export server with Brotli level 5. The repeat test used the optimized origin's existing cache. Response sizes were logged by a local server; they are not a Netlify invoice, a speed benchmark or a promise for every visitor. Browsers may request multiple ranges, abort downloads, evict cache, or preload differently. Later mobile and gallery interactions were separate from these measurements. Small final UI changes do not materially change the result.

Reproducible file totals are in `tools/media-optimization-report.json`; the browser comparison summary is in `tools/bandwidth-comparison.json`.

## What reduces usage

1. **Explicit playback.** Scrolling, changing the selected film, opening full view or selecting HD while idle does not start playback. The gallery has no video source until Play is pressed. Watch pages and full view use native players with `preload="none"`. A centered Play button keeps playback accessible on mobile. Films start muted and never loop automatically.
2. **One active gallery video.** Navigation, dragging, leaving the gallery or hiding the page releases the shared player's source. Full view stops the gallery player, waits for Play and releases its source on close. A hidden full-view player is reset with preload disabled. No background next-video prefetch is used.
3. **Smaller default media.** SD is a complete film at up to 640px on its longest edge, 24fps, H.264 video capped at 360kbps plus mono AAC capped at 40kbps. Fast-start MP4 metadata allows playback to begin before the whole file arrives. HD remains an intentional request. SD sacrifices some detail; HD is available for quality review.
4. **Smaller, deferred imagery.** Hero photographs, portraits and posters use WebP. Service SVGs keep their layouts while embedded photographs are compressed. Gallery WebGL requests only visible poster textures, rather than all fourteen upfront. Hidden fallback images are not rendered in WebGL mode. Existing transforms, shaders, focus enlargement and scrolling remain.
5. **Browser reuse.** Content-hashed images, fonts, artwork and SD videos use one-year immutable caching under `/media/`. Updating an asset creates a different URL. Existing source URLs retain conservative caching. HTML revalidates normally. Browser caching avoids repeat network requests when the cache is retained; edge/CDN cache hits still send bandwidth to visitors.
6. **Static hosting.** The site remains an exported set of HTML pages with no request-time rendering, database, image-transformation service, analytics poller or contact API. Contact continues through the existing reviewed WhatsApp/email handoff. Search pages remain crawlable; video sitemap entries now point at the smaller complete SD files, with HD accessible to visitors.

Original public media remain available for existing links and offline processing. The repository/export therefore contains extra copies; storage size is different from visitor transfer size. No files are downloaded merely because they exist in the export. Old URLs can still be requested directly, so these changes are not an anti-scraping bandwidth cap.

## Operating within the free plan

Netlify's current credit plan provides 300 monthly credits. Published rates are 15 per successful production deploy, 20 per GB served and 2 per 10,000 web requests. Deploy Preview and branch-deploy publication has no deployment charge, but its traffic still counts. Exhausting the Free balance pauses projects on the team. Check the account billing screen for the actual balance and cycle dates. [Netlify credit documentation](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)

- Keep development local and push to `pre-deployment`; run checks in GitHub Actions. Batch approved changes into fewer production releases. Four production releases would reserve 60 credits before traffic.
- Prefer local review. If sharing a Netlify preview is necessary, keep it private and avoid leaving large media tests running. Pushes to main now automatically build and publish production. Keep intermediate commits on pre-deployment, which does not automatically publish.
- Review the team's **Usage & billing → Credit usage** regularly, particularly after campaigns. Watch bandwidth and web requests together; use traffic/path information to identify video downloads or unusual request spikes. Check any available usage notification preferences.
- As a rough model using decimal GB, 1,000 visits matching the measured cold browse scenario would use about 29 traffic credits. One complete average SD film per visit adds approximately 33 bandwidth credits, plus range requests. Add production deployments separately. Actual browser behavior, other pages, bots and other team projects change this estimate.
- If traffic eventually exceeds this budget, move large films to a suitable external media host/CDN or use an external video platform after comparing its current quotas and costs. That requires a separate hosting choice, URL migration and narrowly scoped CSP changes. None was added automatically.
- Robots rules are not access control. Keep legitimate search access; investigate abuse before blocking crawlers or adding broad restrictions that could harm discovery.

## Maintaining the assets

Run `python tools/optimize_media.py` locally after source media changes. It needs Pillow and `ffmpeg`/`ffprobe` on PATH. Review visual quality, include new fingerprinted files and the updated manifest/report, then run `npm run build`. Encoding is deliberately absent from the Netlify build so deployment does not need media tools or repeat expensive conversions.

The build validates all optimized file hashes, every SD file's size, all fourteen fast-start MP4 containers, source/poster references, static playback defaults, immutable headers, routing, security and SEO. Never overwrite a fingerprinted URL with different bytes.
