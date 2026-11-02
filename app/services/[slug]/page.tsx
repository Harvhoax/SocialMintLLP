import { notFound } from 'next/navigation';
import ContentFrame from '@/components/ContentFrame';
import StructuredData from '@/components/StructuredData';
import { serviceDetails } from '@/data/service-details';
import { filmDetails } from '@/data/reel-details';
import { absoluteUrl, site } from '@/data/site';
import { pageMetadata, breadcrumbs } from '@/lib/seo';
import { organizationId, serviceArea } from '@/lib/business-schema';

type Props = { params: Promise<{slug: string}> };
export const dynamicParams = false;
export function generateStaticParams() { return serviceDetails.map(service => ({slug: service.slug})); }
export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const service = serviceDetails.find(item => item.slug === slug);
  if (!service) notFound();
  return pageMetadata(`${service.name} in Mumbai | SocialMint`, service.summary, `/services/${service.slug}`);
}

export default async function ServicePage({params}: Props) {
  const {slug} = await params;
  const service = serviceDetails.find(item => item.slug === slug);
  if (!service) notFound();
  const related = filmDetails.filter(film => (service.category as readonly string[]).includes(film.category)).slice(0, 3);
  return <ContentFrame>
    <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: 'Services', path: '/services'}, {name: service.name, path: `/services/${slug}`}])} />
    <StructuredData data={{'@context': 'https://schema.org', '@type': 'Service', '@id': absoluteUrl(`/services/${slug}#service`), name: service.name, description: service.summary, url: absoluteUrl(`/services/${slug}`), provider: {'@type': 'Organization', '@id': organizationId, name: site.name, url: absoluteUrl()}, areaServed: serviceArea}} />
    <div className="content-intro"><a className="content-back" href="/services">← All services</a><p className="content-kicker">{service.name} / Mumbai · India</p><h1>{service.heading}</h1><p className="content-lead">{service.summary}</p><a className="button primary" href="/#contact">Discuss your project <span aria-hidden="true">↗</span></a></div>
    <div className="service-explainer"><section><h2>Our approach</h2><p>{service.approach}</p><h2>What we work on</h2><ul>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></section><section><h2>What to share with us</h2><p>{service.brief}</p><p>Our team brings together creative direction, sales and marketing, and technical operations. <a href="/#partners">Meet the people behind SocialMint.</a></p></section></div>
    <section className="content-related" aria-labelledby="related-heading"><h2 id="related-heading">Explore our video work</h2><div className="film-directory film-directory-small">{related.map(film => <a key={film.slug} href={`/work/${film.slug}`}><img src={`/reels/${film.slug}.jpg`} width={480} height={617} alt={`${film.title} video still`} loading="lazy" decoding="async"/><span>{film.category} · {film.duration}</span><h3>{film.title} <span aria-hidden="true">↗</span></h3></a>)}</div><a className="content-action" href="/work">View the full film library <span aria-hidden="true">↗</span></a></section>
    <aside className="content-close"><h2>Find your next direction.</h2><a className="button primary" href="/#contact">Let’s talk <span aria-hidden="true">↗</span></a><a className="content-action" href="/services">Explore all six services</a></aside>
  </ContentFrame>;
}
