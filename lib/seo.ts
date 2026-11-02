import type { Metadata } from 'next';
import { absoluteUrl, isPreview, site } from '@/data/site';

export function pageMetadata(title: string, description: string, path: string, image?: string): Metadata {
  const images = image
    ? [{ url: absoluteUrl(image), alt: title }]
    : [{ url: absoluteUrl('/social-image.png'), width: 1200, height: 630, alt: 'SocialMint — A fresh take on social.' }];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: {
      index: !isPreview, follow: true,
      googleBot: { index: !isPreview, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    openGraph: { type: 'website', locale: 'en_IN', siteName: site.name, title, description, url: absoluteUrl(path), images },
    twitter: { card: 'summary_large_image', title, description, images: images.map(item => item.url) },
  };
}

export function breadcrumbs(items: {name: string; path: string}[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.path),
    })),
  };
}
