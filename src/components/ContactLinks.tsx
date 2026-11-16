import {site} from '@/data/site';
import {Mail,Phone,MessageCircle,ArrowUpRight,Instagram,Linkedin} from 'lucide-react';

export default function ContactLinks(){
 return <address className="direct-contact" aria-label="Contact SocialMint">
  <a href={`mailto:${site.email}`}><Mail size={21}/><span>{site.email}</span><ArrowUpRight size={18}/></a>
  <a href={`tel:${site.phone}`}><Phone size={21}/><span>{site.phoneDisplay}</span><ArrowUpRight size={18}/></a>
  <a href="https://wa.me/919321388129?text=Hi%20SocialMint%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span>Chat on WhatsApp</span><ArrowUpRight size={18}/></a>
  {site.socialProfiles.map(profile=>{
   const Icon=profile.name==='Instagram'?Instagram:Linkedin;
   return <a key={profile.name} href={profile.url} target="_blank" rel="noopener noreferrer" aria-label={`SocialMint Studio on ${profile.name}`}><Icon size={21}/><span>{profile.name}</span><ArrowUpRight size={18}/></a>;
  })}
 </address>;
}
