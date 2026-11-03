<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## SocialMint release workflow

- `main` is the stable production branch. Keep it unchanged during development.
- Make changes on `pre-deployment` by default. A request to "push" means push to this branch unless the user explicitly requests a production promotion.
- Run `npm run build` before pushing changes. The build includes security, SEO and Netlify export checks.
- GitHub Actions validates production and preview build contexts on pushes to `pre-deployment` and pull requests into `main`.
- Review changes and any preview with the user before merging `pre-deployment` into `main`. Do not auto-merge, force-push, or publish a production deploy without their approval.
- Netlify continuous deployment is connected to `Harvhoax/SocialMintLLP` through a read-only repository key and push webhook. A push to `main` automatically builds and publishes production; treat promotion/pushing to `main` as the production approval point. Keep routine work on `pre-deployment`, which does not automatically publish. Preview access remains private. No Netlify token or webhook URL belongs in source control.
