# SocialMint

Cinematic agency demo built with Next.js, TypeScript, Three.js / React Three Fiber, GSAP ScrollTrigger, Lenis, and Tailwind CSS.

Run `npm install`, then `npm run dev`. Production: `npm run build` exports the site to `out/`.

## Before launch

- Replace concept studies in `data/projects.ts` with verified client projects and outbound URLs.
- Add real names, portraits, and portfolio URLs in `data/partners.ts`.
- Configure `NEXT_PUBLIC_FORM_ENDPOINT` in `.env.local` to enable delivery to an approved form endpoint. Without it, validated briefs save only in the visitor's browser and can be downloaded. Rebuild after changing environment variables.
- No legal LLP registration claims, invented clients, prices, or performance statistics are included.

The logo is supplied by the owner. Concept photography is from Unsplash; filenames map to photo IDs: coffee `1442512595331-e89e73853f31`, running `1538805060514-97d9cc17730c`, interior `1600210492486-724fe5c67fb0`, orange `1547514701-42782101795e`, coast `1518837695005-2083093ee35b`, fashion `1483985988355-763728e1935b`.

Motion references: https://tympanus.net/Tutorials/Cinematic3DScroll/ and https://franco-showcases.webflow.io/shaders-scroll . Magnet interaction inspired by React Bits: https://github.com/DavidHDev/react-bits . The page is an original branded implementation.

Reduced-motion users receive static artwork, natural scrolling, and manually scrollable project rows. The preloader is skipped on subsequent visits in the same browser session. Modals use native dialogs for focus containment and Escape dismissal.
