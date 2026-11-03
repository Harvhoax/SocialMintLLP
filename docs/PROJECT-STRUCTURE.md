# Project structure

```text
SocialMint/                    Local workspace, not the Git repository
├── README.md                  Workspace navigation
├── archives/                  Local history; never deployed or committed
│   ├── exports/               Earlier source/Netlify ZIPs and export manifest
│   ├── legacy-sites/          Earlier .tar.gz site versions
│   └── references/            Original owner-provided IndexNow key file
└── site/                      Git repository; run npm and git here
    ├── src/
    │   ├── app/               Next.js routes, root layout and metadata
    │   ├── components/        Site sections, analytics and enquiry UI
    │   │   ├── three/         React Three Fiber scene
    │   │   └── ui/            Shared text and interaction components
    │   ├── data/              Brand, services, team, FAQs and media manifest
    │   ├── lib/               Validation, SEO, consent and motion helpers
    │   └── styles/            Global/theme/scroll/text/discovery styles
    ├── public/                Stable public URLs and ownership files
    │   ├── media/             Fingerprinted, immutable optimized assets
    │   ├── brand/             Brand originals
    │   ├── fonts/             Font originals/fallbacks
    │   ├── hero/              Hero source imagery and source credits
    │   ├── reels/             Original video/poster URLs retained for compatibility
    │   ├── services/          Service artwork originals
    │   ├── team/              Partner portrait originals
    │   ├── work/              Supporting images
    │   └── licenses/          Distributed asset/code license notices
    ├── scripts/               Build/export verification and static preview
    ├── tools/                 Offline media encoding and optimization reports
    ├── docs/                  Operational guides
    ├── .github/workflows/     Production/preview CI checks
    ├── .sites-local/          Ignored local evidence and scratch files
    ├── .netlify/              Ignored local Netlify state
    ├── .next/                 Ignored Next.js build cache
    ├── out/                   Ignored static export; Netlify publish directory
    └── node_modules/          Ignored installed dependencies
```

`@/*` resolves to `src/*`. Keep Next.js/package/TypeScript/PostCSS/hosting configuration, `.env.example`, `AGENTS.md`, `README.md` and `THIRD_PARTY_NOTICES.md` at the repository root. Actual `.env` values remain local. Do not put private documents, exports, credentials or recordings in `public/`.

Keep original and fingerprinted public media paths intact: they have different jobs, and published links/cache entries depend on them. `tools/optimize_media.py` reads originals, writes fingerprinted derivatives and updates `src/data/media-manifest.json`; it never runs during Netlify builds.

## Common edits

| Change | Location |
| --- | --- |
| Team names, roles, LinkedIn and portfolio links | `src/data/partners.ts` |
| Business identity, email and phone | `src/data/site.ts` |
| Palette | `src/data/theme.ts`, `src/styles/palette.css` |
| Services and answers | `src/data/services.ts`, `service-details.ts`, `service-questions.ts` |
| Films and publication details | `src/data/reels.ts`, `reel-details.ts` |
| Homepage FAQ | `src/data/questions.ts` |
| Form behavior | `src/components/ContactBrief.tsx`, `src/lib/brief.ts` |
| Tracking and consent | `src/components/SiteAnalytics.tsx`, `SiteClarity.tsx`, `src/lib/*-config.mjs` |
| Headers, caching and static routing | `scripts/prepare-netlify.mjs`, `netlify.toml` |

## Local commands and release

`npm run dev` starts development. `npm run build` generates and audits the static export. `npm start` (or `npm run preview`) serves that export at `http://localhost:4173`, with clean routes, security headers, real 404s and video range requests. It binds only to the local machine. Set `PORT` to use a different port. Rebuild and restart preview after changing source; preview does not rebuild it and reads the exported header rules on startup.

Make and push changes to `pre-deployment`, wait for both CI contexts and review the local preview. Promote to `main` only after the owner's explicit approval. A main push automatically publishes on Netlify. Archives stay local; they are historical snapshots and are not substitutes for a fresh build.
