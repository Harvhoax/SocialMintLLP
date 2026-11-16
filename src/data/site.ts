import { isPreviewDeployment } from '@/lib/deploy-context.mjs';

// The public identity is stable across local, preview and production builds.
// Do not use VERCEL_URL here: it creates duplicate, deployment-specific canonicals.
export const site = {
  name: 'SocialMint',
  alternateNames: ['SocialMint Studio', 'Social Mint Studio', 'Social Mint'],
  legalName: 'SocialMint LLP',
  url: 'https://socialmintstudio.com',
  title: 'SocialMint — Social Media Agency & Creative Studio in Mumbai',
  description: 'SocialMint Studio creates reels, brand films and social media content for businesses in Mumbai and across India. Explore our work and discuss your project.',
  email: 'info@socialmintstudio.com',
  phone: '+919321388129',
  phoneDisplay: '+91 93213 88129',
  socialProfiles: [
    { name: 'Instagram', url: 'https://www.instagram.com/socialmint.studio_/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/socialmint-studio/' },
  ],
} as const;

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();

export const isPreview = isPreviewDeployment();
