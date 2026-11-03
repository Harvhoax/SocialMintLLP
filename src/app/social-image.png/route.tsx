import { ImageResponse } from 'next/og';
import { siteTheme } from '@/data/theme';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '70px 80px', background: siteTheme.background, color: siteTheme.text, border: `2px solid ${siteTheme.brand}` }}>
      <div style={{ display: 'flex', fontSize: 42, letterSpacing: -2 }}>social<span style={{ color: siteTheme.brand }}>mint</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 84, lineHeight: 1.04, letterSpacing: -4 }}><span>A fresh take</span><span style={{ color: siteTheme.brand }}>on social.</span></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}><span>Social media. Film. Creative.</span><span style={{ color: siteTheme.accentSoft }}>socialmintstudio.com</span></div>
    </div>,
    { width: 1200, height: 630 },
  );
}
