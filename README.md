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

- Partner names, roles, portraits, portfolio and LinkedIn links: `data/partners.ts`.
- Two Google Drive collections: `data/projects.ts`. Drive permissions control client access.
- Reels: `components/ReelsShowcase.tsx` and `public/reels/`.
- Reels are optimized to H.264/AAC, 720x1280, 30fps, with fast-start MP4 metadata. The original source videos are not committed.
- Playback starts muted when at least 40% of a reel is visible and pauses offscreen or in a hidden tab. Reduced-motion and data-saving preferences disable automatic playback. Play, sound, native timeline, and fullscreen controls remain available.

## Checks

`npm run build` includes TypeScript checking and produces static output. `npm audit --omit=dev` audits production dependencies. Browser QA should verify autoplay, pause, sound, native media controls, mobile layout, anchor navigation and brief validation.

## Credits

Owner-supplied logo, partner portraits and sample reels. Supporting filmmaking imagery comes from Unsplash. Animation references include Codrops Cinematic3DScroll, Clément Grellier's 3DGradientCarousel and Franco Beltramella's shader scroll showcase. See `THIRD_PARTY_NOTICES.md` for adapted-code attribution and the distributed MIT notice.
