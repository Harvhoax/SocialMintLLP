# SocialMint

Next.js + TypeScript agency website with GSAP/Lenis scrolling, 3D galleries, partner profiles, and locally hosted sample reels.

## Local preview

Run `npm ci` once, then `npm run dev`. Open http://localhost:3000.

## Development and release branches

`main` holds the stable production version. Make and push changes to `pre-deployment` first. GitHub Actions checks both production and preview builds, including security, SEO, script policy and routing checks. After the checks pass and the changes are reviewed, open a pull request from `pre-deployment` into `main` and merge only after approval. GitHub Actions runs checks only. Netlify independently builds and publishes pushes to main after the approved promotion.

Netlify continuous deployment is connected to `Harvhoax/SocialMintLLP`. Pushes to `main` automatically build and publish production using `netlify.toml`. A read-only repository deploy key and a push webhook provide access; no Netlify token is stored in GitHub Actions. `pre-deployment` remains a review branch without automatic publishing. Preview access stays private. The hosted production build uses `NETLIFY=true` and `CONTEXT=production`; never publish preview-built HTML with noindex.

## Netlify deployment

The primary hosting target is Netlify, in `tusharsingh@socialmintstudio.com`, at `https://socialmintstudio.netlify.app`. `netlify.toml` builds with `npm run build` and publishes `out/` as a fully static site. No functions, database, API keys or paid runtime are required. The build generates `_headers` with a hash-based script CSP and fingerprinted immutable media caching, plus `_redirects` for every exported route and a genuine 404. Post-processing is disabled to preserve the exact hashed script bytes. See [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md).

Netlify production builds are indexable; deploy-preview and branch-deploy builds emit noindex in HTML and HTTP headers. Unknown Netlify contexts also default to noindex. Rebuild for production rather than promoting preview-built HTML. The canonical domain remains `https://socialmintstudio.com`.

## Existing Vercel deployment

Import `Harvhoax/SocialMintLLP`, select branch `main` and repository root `./`, and use the detected **Next.js** framework settings. Build command: `npm run build`. Keep the output directory at the framework default. The project uses Next.js static export; `out/` is also available for other static hosts. No server functions or secrets are required for the current features.

The public origin is `https://socialmintstudio.com`, configured in `data/site.ts`. Canonical and social URLs always use this domain, including during local review. Vercel preview/development builds carry `noindex`; production builds are indexable. Optional Google/Bing HTML verification tokens are described in `.env.example` and require a rebuild. DNS verification does not require code tokens. See [SEO-LAUNCH.md](SEO-LAUNCH.md) for domain setup, search-console verification and the launch checks that require account access.

## Contact

Email: info@socialmintstudio.com. Phone/WhatsApp: +91 93213 88129.

The enquiry form needs no database, backend or API key. It validates input locally, shows the full enquiry for review, then opens a prepared WhatsApp message or email. The visitor completes sending in that app. Long enquiries use copy/paste rather than truncation; copy and plain-text download fallbacks are included. Values remain in this tab's memory only, and Edit/Clear controls are available. No form endpoint is used.


## Content

- Search and answer-engine discovery: the cinematic homepage links to `/services`, six detailed service pages, `/work` and fourteen native film watch pages. These routes are rendered as static HTML without gallery or animation JavaScript. Titles, descriptions, self canonicals, social previews, Organization/Person/Service and breadcrumb data, `robots.txt`, and an image/video-aware sitemap share one production identity. Mumbai and India are confirmed target markets; no office address, client results, reviews or pricing are invented. Questions and answers are visible in native HTML details. A film only emits `VideoObject` after its actual first-publication date is entered in `data/reel-details.ts`; the video sitemap already includes every watch page and file.
- Fonts: local WOFF2 versions reduce the combined font variant size from 674,920 to 229,240 bytes (66%); existing TTF fallbacks remain available. Only the body font is preloaded; other weights load when used. The homepage's artificial loader wait is 450ms instead of 1,400ms, and below-fold partner portraits load lazily.
- Text motion: original SocialMint implementations in `components/ui/TextEffects.tsx`, `lib/text-motion.ts` and `app/text-effects.css`. The hero gets a one-time vapor entrance after loading; section headings reveal by word; shared letters glide between service titles; the contact prompt uses a one-time ghost completion; selected links and buttons flip letters on hover/focus. Text remains readable without JavaScript, visual duplicates are hidden from assistive technology, and reduced-motion preferences disable the effects. No React Bits Pro code or license is required.
- Active theme: Palette A (mint + coral, with peach details). `data/theme.ts` is the shared color source for CSS variables, the service canvas and WebGL accents. `app/palette.css` maps colors to interface roles. Service SVG artwork carries the matching warm accent inks.
- Page scrolling uses continuous Lenis wheel smoothing with native touch scrolling. Section alignment is optional and limited to 40px in the last scroll direction, after both input and smoothing stop. It is interruptible and never locks or drops user input. Header, fonts and viewport changes are measured by `lib/section-scroll.ts`. Reduced motion keeps native page scrolling.
- Partner names, roles, portraits, portfolio and LinkedIn links: `data/partners.ts`.
- Opening sequence: twelve distinct, locally optimized 900 × 1242 images in `public/hero/`; source credits are retained in `sources.json`.
- Services: an infinite 3D carousel with continuous horizontal wheel tracking, immediate direction changes, gentle settling after input stops, 28° card rotation, 140px center depth, and blended mint gradients. Vertical wheel gestures scroll the page. Swipe, keyboard, arrows and direct selection remain available. Card transforms update only while moving; rendering pauses offscreen and respects reduced motion.
- Work is hosted locally; no Google Drive links remain.
- Fourteen films: `data/reels.ts`, `components/ReelsShowcase.tsx`, and `public/reels/`. The work section is an infinite circular WebGL gallery with all fourteen films. Posters initialize near the section; only visible panels request artwork, and videos wait for an explicit Play action.
- Full-length SD films are encoded offline to H.264 at 24fps, a maximum 640px edge, video bitrate capped at 360kbps and mono AAC capped at 40kbps. Fast-start metadata is retained. HD files remain available only on request. The 14 new SD files total 23.08 MB instead of 35.42 MB. Existing public URLs remain available.
- Gallery playback is click-to-play and muted initially, with no loop or automatic playback in full view. Moving films, leaving the gallery or hiding the tab pauses and releases the shared player source; reopening a film also requires Play. Native watch pages use preload="none". Reduced-motion and unavailable WebGL use a static scrollable poster gallery.
- The circular layout, frame borders, focus enlargement and smooth horizontal transitions are retained. New WebP images and compressed SVG artwork reduce image bytes by about 80%. Fingerprinted files under public/media receive one-year immutable browser caching. The source manifest is data/media-manifest.json; no runtime transforms, image CDN or serverless functions were added. GA4 is integrated separately as described below. See [BANDWIDTH-OPTIMIZATION.md](BANDWIDTH-OPTIMIZATION.md) for measurements and the release budget.

## Analytics

GA4 uses the official Next.js integration with measurement ID G-WKYJ3WLFRL on the production business domain. Local/preview visits are excluded. Contact intent is measured through safe custom click/handoff events without form values or message URLs; confirmed leads and bookings are not invented. See [ANALYTICS.md](ANALYTICS.md) for privacy boundaries, the exact CSP initializer hash and owner-side Realtime/Key Event verification.

## Checks

`npm run build` includes TypeScript checking and produces static output. Run `npm run check:seo` after a build to check every sitemap URL, canonical, unique title/description, native video source, local link/asset, JSON-LD, social preview and crawl configuration. `npm audit --omit=dev` audits production dependencies. Browser QA should verify no video requests before Play, playback, pause, sound, native media controls, mobile layout, anchor navigation and brief validation. Real-user Core Web Vitals and public indexing must be measured after domain launch.

## Credits

Owner-supplied logo, partner portraits and sample reels. Supporting filmmaking imagery comes from Unsplash. The six service artworks are original SVG interface illustrations with owner-supplied stills and supporting camera photography. Animation references include Codrops Cinematic3DScroll, Clément Grellier's 3DGradientCarousel and Franco Beltramella's shader scroll showcase. See `THIRD_PARTY_NOTICES.md` for adapted-code attribution and the distributed MIT notice.

## Security review

See [SECURITY-REVIEW.md](SECURITY-REVIEW.md) for findings, fixes and deployment checks. `npm run build` runs the form/security checks and the exported-page SEO audit automatically. `npm run check:security` also runs the security checks independently. If a submission backend is introduced later, it will require its own server validation and abuse controls.
