# SocialMint

Next.js + TypeScript agency website with GSAP/Lenis scrolling, 3D galleries, partner profiles, and locally hosted sample reels.

## Local preview

Run `npm ci` once, then `npm run dev`. Open http://localhost:3000.

## Vercel deployment

Import `Harvhoax/SocialMintLLP`, select branch `main` and repository root `./`, and use the detected **Next.js** framework settings. Build command: `npm run build`. Keep the output directory at the framework default. The project uses Next.js static export; `out/` is also available for other static hosts. No server functions or secrets are required for the current features.

Set `NEXT_PUBLIC_SITE_URL` to the final public origin when using a custom domain. Otherwise metadata uses Vercel's production project URL or deployment URL automatically. Environment changes require a rebuild.

## Contact

Email: socialmintllp@gmail.com. Phone/WhatsApp: +91 93213 88129.

Without a form endpoint, validated briefs are saved on the visitor's device and can be downloaded or opened in their email app addressed to SocialMint. Sending email is completed by the visitor. For direct form submission, configure an approved `NEXT_PUBLIC_FORM_ENDPOINT` and rebuild. No delivery credentials belong in client code.

## Content

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

`npm run build` includes TypeScript checking and produces static output. `npm audit --omit=dev` audits production dependencies. Browser QA should verify autoplay, pause, sound, native media controls, mobile layout, anchor navigation and brief validation.

## Credits

Owner-supplied logo, partner portraits and sample reels. Supporting filmmaking imagery comes from Unsplash. The six service artworks are original SVG interface illustrations with owner-supplied stills and supporting camera photography. Animation references include Codrops Cinematic3DScroll, Clément Grellier's 3DGradientCarousel and Franco Beltramella's shader scroll showcase. See `THIRD_PARTY_NOTICES.md` for adapted-code attribution and the distributed MIT notice.
