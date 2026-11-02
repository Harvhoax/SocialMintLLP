import { notFound } from 'next/navigation';
import ContentFrame from '@/components/ContentFrame';
import StructuredData from '@/components/StructuredData';
import { filmDetails, reelPublicationDates, durationSeconds } from '@/data/reel-details';
import { absoluteUrl } from '@/data/site';
import { pageMetadata, breadcrumbs } from '@/lib/seo';
import { organizationId } from '@/lib/business-schema';

type Props = { params: Promise<{slug: string}> };
export const dynamicParams = false;
export function generateStaticParams() { return filmDetails.map(film => ({slug: film.slug})); }
export async function generateMetadata({params}: Props) {
  const {slug} = await params;
  const film = filmDetails.find(item => item.slug === slug);
  if (!film) notFound();
  return pageMetadata(`${film.title} — ${film.category} Film | SocialMint`, film.description, `/work/${film.slug}`, `/reels/${film.slug}.jpg`);
}

export default async function FilmPage({params}: Props) {
  const {slug} = await params;
  const film = filmDetails.find(item => item.slug === slug);
  if (!film) notFound();
  const index = filmDetails.indexOf(film);
  const nextFilm = filmDetails[(index + 1) % filmDetails.length];
  const published = reelPublicationDates[slug];
  return <ContentFrame>
    <StructuredData data={breadcrumbs([{name: 'Home', path: '/'}, {name: 'Films', path: '/work'}, {name: film.title, path: `/work/${slug}`}])} />
    {/* Google requires a real uploadDate for VideoObject rich results. Emit the
        full object only when the owner has confirmed first publication. */}
    {published && <StructuredData data={{'@context': 'https://schema.org', '@type': 'VideoObject', '@id': absoluteUrl(`/work/${slug}#video`), name: film.title, description: film.description, thumbnailUrl: [absoluteUrl(`/reels/${slug}.jpg`)], contentUrl: absoluteUrl(`/reels/${slug}.mp4`), uploadDate: published, duration: `PT${durationSeconds(film.duration)}S`, publisher: {'@id': organizationId}}} />}
    <div className="watch-heading"><a className="content-back" href="/work">← All films</a><p className="content-kicker">{film.category} · {film.duration}</p><h1>{film.title}</h1></div>
    <div className={`watch-screen ${film.landscape ? 'watch-landscape' : ''}`}><video controls playsInline muted preload="none" poster={`/reels/${slug}.jpg`} width={film.landscape ? 1280 : 480} height={film.landscape ? 720 : 854} aria-label={`Watch ${film.title}`}><source src={`/reels/${slug}-preview.mp4`} type="video/mp4"/><p><a href={`/reels/${slug}.mp4`}>Open {film.title} as an MP4 video</a>.</p></video></div>
    <div className="watch-description"><p>{film.description}</p><a className="content-action" href={`/reels/${slug}.mp4`}>Watch the HD file <span aria-hidden="true">↗</span></a><p>Interested in a film for your brand? Explore our <a href="/services/reels-video-editing">reels and video editing</a> or <a href="/services/video-production">video production</a> services for projects in Mumbai and across India.</p></div>
    <div className="watch-next"><a href="/work">Back to all films</a><a href={`/work/${nextFilm.slug}`}>Next: {nextFilm.title} <span aria-hidden="true">→</span></a></div>
    <aside className="content-close"><h2>Let’s tell your story.</h2><a className="button primary" href="/#contact">Discuss your project <span aria-hidden="true">↗</span></a></aside>
  </ContentFrame>;
}
