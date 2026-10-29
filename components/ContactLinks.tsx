import {Mail,Phone,MessageCircle,ArrowUpRight} from 'lucide-react';

export default function ContactLinks(){
 return <address className="direct-contact" aria-label="Contact SocialMint">
  <a href="mailto:socialmintllp@gmail.com"><Mail size={21}/><span>socialmintllp@gmail.com</span><ArrowUpRight size={18}/></a>
  <a href="tel:+919321388129"><Phone size={21}/><span>+91 93213 88129</span><ArrowUpRight size={18}/></a>
  <a href="https://wa.me/919321388129?text=Hi%20SocialMint%2C%20I%27d%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer"><MessageCircle size={21}/><span>Chat on WhatsApp</span><ArrowUpRight size={18}/></a>
 </address>;
}
