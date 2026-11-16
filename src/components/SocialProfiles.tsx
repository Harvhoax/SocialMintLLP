import { site } from '@/data/site';

export default function SocialProfiles() {
  return <nav className="social-profiles" aria-label="SocialMint official social profiles">
    {site.socialProfiles.map(profile => <a key={profile.name} href={profile.url} target="_blank" rel="noopener noreferrer" aria-label={`SocialMint Studio on ${profile.name}`}>{profile.name}</a>)}
  </nav>;
}
