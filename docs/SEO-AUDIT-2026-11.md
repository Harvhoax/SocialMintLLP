# Search visibility audit — 16 November 2026

## Verified production evidence

- Google Search Console's verified domain property reports **23 indexed pages** and **3 excluded pages** (report last updated 13 November). All three exclusions are intentional redirects: `http://socialmintstudio.com/`, `http://www.socialmintstudio.com/` and `https://www.socialmintstudio.com/`. These should remain redirects to the canonical HTTPS apex origin.
- Live robots.txt and sitemap.xml return 200. The sitemap lists 23 canonical content pages. The homepage already has Organization, WebSite and partner Person structured data; a simplified fetch missing this markup is not evidence of its absence.
- The live deployment predates the reviewed branch. New company-profile links, contact links and identity improvements are present in the branch and require production promotion before crawlers can see them.
- [Mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-socialmintstudio-com/ph0dx05w2n?form_factor=mobile): performance 63, accessibility 97, best practices 92, SEO 100; FCP 1.0s, LCP 2.7s, CLS 0.004, speed index 5.0s and TBT 15,730ms. This is one lab run of the old live deployment, not field Core Web Vitals. The main-thread breakdown attributes 38.1s to Other out of 40.3s total; it does not isolate a specific application function. Search Console has insufficient Core Web Vitals data.
- PageSpeed records a blocked inline script under `about:srcdoc`. No application source uses an iframe or srcdoc. Keep the restrictive CSP; do not add unsafe-inline or authorize an unidentified script to improve a diagnostic score. Actual application scripts are checked against generated CSP hashes in both build contexts.

## Changes in this branch

1. One semantic text copy for every animated label, including server-rendered HTML; decorative visual glyphs use CSS-generated content under aria-hidden. The previous implementation already hid visual copies from assistive technology, but raw HTML extraction duplicated the words. A regression check renders all five real components, including escaped and Unicode text.
2. Homepage H1 explicitly identifies SocialMint, social media/video and Mumbai; Services and Work headings describe their content. Existing cinematic visual identity remains.
3. Desktop, mobile and footer Services/Work links point to their real directory pages. Individual service and watch URLs remain discoverable through ordinary anchors. Homepage gallery links still work; anchors themselves are not an indexing defect.
4. Visible business introduction unifies SocialMint, Social Mint Studio and the owner-confirmed legal name SocialMint LLP. It explains on-location shoots and editing supplied footage. Existing Organization names, aliases, contact details and owner-supplied company sameAs profiles are retained.
5. Film pages have descriptive titles, runtime/format/category, useful enquiry guidance and links to relevant services. No client outcome, testimonial, brief, transcript or publication date is invented. Original gallery labels, URLs and film files are preserved.
6. Decorative hero fallback images have empty alternatives and are hidden as a group. Service artwork already has decorative semantics; empty alternatives there are appropriate.
7. Removed a discarded WebGL capability-test context and its unused state update. The scroll-driven hero stops GPU draws once its scroll position settles and redraws after texture loads or resize. Mobile rendering uses a smaller pixel-ratio cap. Transitions still ease while scrolling; play-on-click video behavior is unchanged.

## Remaining evidence and owner work

- Review this branch locally, then approve production promotion. Rerun PageSpeed on that published build; the old lab score cannot measure unpublished fixes or establish a performance improvement.
- After publication, inspect the homepage and important service URLs in Search Console, confirm Google-selected canonical and request indexing for materially changed pages. Monitor branded queries, impressions, clicks and enquiries over time.
- Complete a legitimate service-area Google Business Profile with owner verification. Link the exact canonical website from the official social profiles. Seek relevant, earned business mentions and links rather than manufactured citations or branded clicks.
- Provide actual first-publication dates to enable valid VideoObject markup. Existing video sitemap entries and crawlable watch pages remain available meanwhile. Add accurate captions/transcripts and permissioned case studies with real contributions/results when available.
- A blog, exact-match domain or extra schema type is not a prerequisite for indexing. Do not rename the domain, publish fake registration/address details, manufacture reviews or promise exclusive search results. No implementation can guarantee first place, a Knowledge Panel, or AI-engine citations.

## Implementation references

- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Video indexing](https://developers.google.com/search/docs/appearance/video)
- [Video structured data and required uploadDate](https://developers.google.com/search/docs/appearance/structured-data/video)
- [Business Profile guidelines](https://support.google.com/business/answer/3038177)
