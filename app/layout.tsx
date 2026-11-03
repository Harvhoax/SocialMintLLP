import { assetUrl } from '@/data/media';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import {siteTheme, themeVariables} from '@/data/theme';
import {site} from '@/data/site';
import {pageMetadata} from '@/lib/seo';
import './globals.css';
import './palette.css';
import './scroll-layout.css';
import './text-effects.css';
import './discovery.css';
export const metadata: Metadata = {
  ...pageMetadata(site.title, site.description, '/'),
  metadataBase: new URL(site.url),
  applicationName: site.name,
  category: 'Social media and video production',
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: process.env.BING_SITE_VERIFICATION ? {'msvalidate.01': process.env.BING_SITE_VERIFICATION} : undefined },
  icons: { icon: '/brand/mark.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-palette={siteTheme.id} style={themeVariables as CSSProperties}><head><link rel="stylesheet" href={assetUrl('/fonts/fonts.css')} /><link rel="preload" href={assetUrl('/fonts/font-0.woff2')} as="font" type="font/woff2" crossOrigin="anonymous" /></head><body><noscript><style>{'.loader,.progress,.gradient-carousel,.carousel-toolbar,.circular-stage,.circular-controls{display:none!important}.cinema{height:100svh}.cinema-sticky{position:relative}.cinema-second{display:none}.cinema-opening{visibility:visible!important;opacity:1!important}'}</style></noscript>{children}</body></html>;
}


