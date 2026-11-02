import ContentFrame from '@/components/ContentFrame';
import StructuredData from '@/components/StructuredData';
import { filmDetails } from '@/data/reel-details';
import { pageMetadata, breadcrumbs } from '@/lib/seo';

export const metadata = pageMetadata('Video Editing & Production Portfolio | SocialMint Mumbai', 'Watch SocialMint’s selected video work: social reels, automotive, real estate, hospitality, travel, wedding and brand content. Explore all fourteen films.', '/work');

export default function WorkPage() {
  return <ContentFrame>
    <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: 'Films', path: '/work'}])} />
    <div className="content-intro"><a className="content-back" href="/">SocialMint / Selected films</a><h1>Stories worth<br/><em>stopping for.</em></h1><p className="content-lead">Explore our video editing and production samples, from short social content to brand and documentary films. Choose a film to watch it in full.</p><a className="content-action" href="/#work">Explore the circular gallery <span aria-hidden="true">↗</span></a></div>
    <div className="film-directory">{filmDetails.map(film => <article key={film.slug}><a href={`/work/${film.slug}`}><img src={`/reels/${film.slug}.jpg`} width={480} height={617} alt={`${film.title} video still`} loading="lazy" decoding="async"/><span>{film.category} · {film.duration}</span><h2>{film.title} <span aria-hidden="true">↗</span></h2></a><p>{film.description}</p></article>)}</div>
    <aside className="content-close"><h2>Have a story in mind?</h2><a className="button primary" href="/#contact">Tell us about your project <span aria-hidden="true">↗</span></a></aside>
  </ContentFrame>;
}
