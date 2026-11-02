import type { ReactNode } from 'react';
import { site } from '@/data/site';

export default function ContentFrame({ children }: { children: ReactNode }) {
  return <div className="content-site">
    <a href="#content" className="skip">Skip to content</a>
    <header className="content-header">
      <a className="brand" href="/" aria-label="SocialMint home"><img src="/brand/mark.svg" alt="" width={34} height={33} />social<span>mint</span></a>
      <nav aria-label="Main navigation"><a href="/services">Services</a><a href="/work">Films</a><a href="/#partners">Team</a><a href="/#contact">Contact</a></nav>
    </header>
    <main id="content" className="content-main">{children}</main>
    <footer className="content-footer">
      <div><a href="/">SocialMint</a><p>A fresh perspective. A lasting impression.</p></div>
      <div><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></div>
      <nav aria-label="Footer navigation"><a href="/services">All services</a><a href="/work">Film library</a><a href="/#contact">Start a project</a></nav>
    </footer>
  </div>;
}
