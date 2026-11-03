# IndexNow

The owner-provided key is served as a static UTF-8 text file at:

`https://socialmintstudio.com/287f4c0364e849b28728ce253aac965c.txt`

The supplied source filename differed from its contents. The published filename matches the actual key inside the source file. This verification file is public by design; it is not an account credential. Keep it in `public/` so future static exports preserve it.

`public/BingSiteAuth.xml` is the ownership file downloaded from Bing Webmaster Tools for this domain. It is separate from the IndexNow key, and allows file-based verification without changing DNS or granting Google Search Console access.

After the production deployment succeeds, verify that this URL returns HTTP 200, plain text, and only the key (a final newline is fine). Submit the canonical homepage once:

```powershell
curl.exe --include "https://api.indexnow.org/indexnow?url=https%3A%2F%2Fsocialmintstudio.com%2F&key=287f4c0364e849b28728ce253aac965c&keyLocation=https%3A%2F%2Fsocialmintstudio.com%2F287f4c0364e849b28728ce253aac965c.txt"
```

HTTP 200 means the URL was received; 202 means key validation is pending. Neither response guarantees crawling, indexing or ranking. Check the property's IndexNow report in Bing Webmaster Tools after processing. Keep the existing Google Search Console and sitemap setup.

No browser JavaScript, dependencies, functions, database or recurring request was added. Future deployments retain this key file but do not automatically submit pages. Deployment-success automation is a separate optional step: submit genuinely added, modified or deleted public URLs only after production is published, never from preview or during a build that can still fail. Do not resubmit the full sitemap on every build.

Sources: [IndexNow protocol](https://www.indexnow.org/documentation), [Bing setup](https://www.bing.com/indexnow/getstarted).
