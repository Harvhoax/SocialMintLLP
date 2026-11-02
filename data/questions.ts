import {site} from './site';
export const questions = [
  { question: 'What does SocialMint do?', answer: 'SocialMint is a social media agency and creative studio serving brands in Mumbai and across India. Our services include reels and video editing, posts and carousels, social media management, video shooting, account optimization and thumbnail design.' },
  { question: 'Can I see your video work before starting a project?', answer: 'Yes. Explore the selected films in our gallery or open the film library to watch individual samples, including social content, real estate, automotive, hospitality, travel and brand films.' },
  { question: 'What should I include in a project enquiry?', answer: 'Tell us about your brand, audience, the services you need, your preferred timeline and any existing footage or brand assets. Include your email or WhatsApp number so we can discuss the scope with you.' },
  { question: 'How can I contact SocialMint?', answer: `Email ${site.email} or call ${site.phoneDisplay}. You can also contact us on WhatsApp using the same number.` },
] as const;
