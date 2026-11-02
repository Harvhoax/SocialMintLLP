import ContentFrame from '@/components/ContentFrame';
import StructuredData from '@/components/StructuredData';
import { serviceDetails } from '@/data/service-details';
import { pageMetadata, breadcrumbs } from '@/lib/seo';

export const metadata = pageMetadata('Social Media & Creative Services in Mumbai | SocialMint', 'Explore SocialMint’s reels, video production, social media management, posts, account optimization and thumbnail design for brands in Mumbai and India.', '/services');

export default function ServicesPage() {
  return <ContentFrame>
    <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: 'Services', path: '/services'}])} />
    <div className="content-intro"><a className="content-back" href="/">SocialMint / Services</a><p className="content-kicker">Mumbai · India</p><h1>A fresh angle.<br/><em>For every story.</em></h1><p className="content-lead">Social media management, video and design, brought together by one creative team. Explore the services we provide for brands in Mumbai and across India.</p><a className="content-action" href="/#services">Explore the 3D gallery <span aria-hidden="true">↗</span></a></div>
    <div className="service-directory">{serviceDetails.map((service, index) => <article key={service.slug}>
      <span className="content-kicker">0{index + 1}</span><h2><a href={`/services/${service.slug}`}>{service.name} <span aria-hidden="true">↗</span></a></h2><p>{service.summary}</p><ul>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a className="content-action" href={`/services/${service.slug}`}>Explore {service.name.toLowerCase()}</a>
    </article>)}</div>
    <aside className="content-close"><h2>What does your brand need next?</h2><p>Share your audience, goals and timeline. We’ll discuss which services fit your project.</p><a className="button primary" href="/#contact">Discuss your project <span aria-hidden="true">↗</span></a></aside>
  </ContentFrame>;
}
