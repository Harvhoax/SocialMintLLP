import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/data/site';

export const dynamic = 'force-static';

// Includes search/answer crawlers. No special AI file is needed to make these
// same public pages available to Google, Bing or other compliant search bots.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: absoluteUrl('/sitemap.xml') };
}
