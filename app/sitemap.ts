import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/data/site';
import { serviceDetails } from '@/data/service-details';
import { filmDetails, durationSeconds } from '@/data/reel-details';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...['/', '/services', '/work'].map(path => ({ url: absoluteUrl(path) })),
    ...serviceDetails.map(service => ({ url: absoluteUrl(`/services/${service.slug}`) })),
    ...filmDetails.map(film => ({
      url: absoluteUrl(`/work/${film.slug}`),
      videos: [{
        title: film.title, description: film.description,
        thumbnail_loc: absoluteUrl(`/reels/${film.slug}.jpg`),
        content_loc: absoluteUrl(`/reels/${film.slug}.mp4`),
        duration: durationSeconds(film.duration),
      }],
    })),
  ];
}
