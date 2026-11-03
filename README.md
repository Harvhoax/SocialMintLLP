# SocialMint

Next.js + TypeScript agency website with GSAP/Lenis scrolling, 3D galleries, partner profiles, and locally hosted sample reels.

## Local preview

Run `npm ci` once, then `npm run dev`. Open http://localhost:3000.

## Netlify deployment

The primary hosting target is Netlify, in `tusharsingh@socialmintstudio.com`, at `https://socialmintstudio.netlify.app`. `netlify.toml` builds with `npm run build` and publishes `out/` as a fully static site. No functions, database, API keys or paid runtime are required. The build generates `_headers` with a hash-based script CSP and finite media caching, plus `_redirects` for every exported route and a genuine 404. Post-processing is disabled to preserve the exact hashed script bytes. See [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md).

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
- Fourteen films: `data/reels.ts`, `components/ReelsShowcase.tsx`, and `public/reels/`. The work section is an infinite circular WebGL gallery with all fourteen films. Posters initialize near the section; only the centered and settled preview loads.
- Each film has a data-saving SD preview and an HD copy with H.264/AAC and fast-start MP4 metadata. New clips use 24fps, preview bitrate capped at 650kbps and HD video bitrate capped at 1600kbps. Original source files are not committed. Landscape footage retains its format.
- The centered film autoplays muted after gallery motion settles. Moving away swaps back to its poster. The single shared player releases its source when the section leaves view or the page is hidden. HD loads only on request. Drag, swipe, horizontal wheel, arrow controls, keyboard navigation and an expanded native video player are available. Reduced-motion and unavailable WebGL use a static scrollable poster gallery. Data-saving and 2G connections disable autoplay.
- Film frames are 1.2× the original desktop size (20% smaller than the enlarged version), with a rounded mint/coral rim, tighter spacing and a taller stage to avoid vertical clipping; narrow screens cap frame width to fit. The film nearest the center grows smoothly while side frames taper in size. Vertical gestures scroll the page; horizontal gestures browse films. Autoplay requires at least 65% of the gallery stage to be visible, and leaving the gallery pauses and unloads its shared preview player.

## Checks

`npm run build` includes TypeScript checking and produces static output. Run `npm run check:seo` after a build to check every sitemap URL, canonical, unique title/description, native video source, local link/asset, JSON-LD, social preview and crawl configuration. `npm audit --omit=dev` audits production dependencies. Browser QA should verify autoplay, pause, sound, native media controls, mobile layout, anchor navigation and brief validation. Real-user Core Web Vitals and public indexing must be measured after domain launch.

## Credits

Owner-supplied logo, partner portraits and sample reels. Supporting filmmaking imagery comes from Unsplash. The six service artworks are original SVG interface illustrations with owner-supplied stills and supporting camera photography. Animation references include Codrops Cinematic3DScroll, Clément Grellier's 3DGradientCarousel and Franco Beltramella's shader scroll showcase. See `THIRD_PARTY_NOTICES.md` for adapted-code attribution and the distributed MIT notice.

## Security review

See [SECURITY-REVIEW.md](SECURITY-REVIEW.md) for findings, fixes and deployment checks. `npm run build` runs the form/security checks and the exported-page SEO audit automatically. `npm run check:security` also runs the security checks independently. If a submission backend is introduced later, it will require its own server validation and abuse controls.
