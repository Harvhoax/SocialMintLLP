import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://socialmint-creative-studio.greylamp256.chatgpt.site'),
  title: 'SocialMint — Social Media Agency | Reels, Video, Growth',
  description: 'Strategy, stories, and social that grows with you. SocialMint plans, shoots, designs, and runs your content with one consistent creative standard.',
  openGraph: { title: 'SocialMint — A fresh take on social.', description: 'We turn attention into growth. A strategy-led creative social media agency.', images: [{url:'/brand/logo.png',width:1296,height:1213,alt:'SocialMint social media agency'}] },
  icons: { icon: '/brand/mark.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="stylesheet" href="/fonts/fonts.css" /></head><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'SocialMint',description:'Social media strategy, content creation, and video production agency.'})}} /></body></html>;
}


