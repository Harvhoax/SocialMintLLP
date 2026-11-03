// The public identity is stable across local, preview and production builds.
// Do not use VERCEL_URL here: it creates duplicate, deployment-specific canonicals.
export const site = {
  name: 'SocialMint',
  legalName: 'SocialMint LLP',
  url: 'https://socialmintstudio.com',
  title: 'SocialMint | Social Media Agency in Mumbai',
  description: 'Social media management, reels, video production and creative design for brands in Mumbai and across India. Explore SocialMint’s work and start a project.',
  email: 'info@socialmintstudio.com',
  phone: '+919321388129',
  phoneDisplay: '+91 93213 88129',
} as const;

export const absoluteUrl = (path = '/') => new URL(path, site.url).toString();

export const isPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development';
