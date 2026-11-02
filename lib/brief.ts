import { z } from 'zod';

export const briefSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(100, 'Keep your name under 100 characters.').refine(value => !/[\r\n\x00]/.test(value), 'Please enter a valid name.'),
  contact: z.string().trim().max(254).refine(value => z.email().safeParse(value).success || (/^\+?[\d ()-]+$/.test(value) && /^\d{10,15}$/.test(value.replace(/\D/g, ''))), 'Enter a valid email or WhatsApp number.'),
  message: z.string().trim().min(10, 'Tell us a little more (at least 10 characters).').max(3000, 'Keep your message under 3,000 characters.'),
  services: z.array(z.string().max(80)).max(6),
});
export type Brief = z.infer<typeof briefSchema>;

export function formatBrief(brief: Brief) {
  return `Project enquiry\n\nName: ${brief.name}\nContact: ${brief.contact}\nServices: ${brief.services.join(', ') || 'Please help me choose'}\n\n${brief.message}`;
}

export function enquiryLinks(brief: Brief, email: string, phone: string) {
  const body = formatBrief(brief);
  const emailBase = `mailto:${email}?subject=${encodeURIComponent('SocialMint project enquiry')}`;
  const whatsappBase = `https://wa.me/${phone.replace(/\D/g, '')}`;
  const emailFull = `${emailBase}&body=${encodeURIComponent(body)}`;
  const whatsappFull = `${whatsappBase}?text=${encodeURIComponent(body)}`;
  // Conservative limit for mobile mail clients and external-app URL handlers.
  // Never silently truncate an enquiry; show a copy/paste fallback instead.
  return { body, email: emailFull.length <= 1800 ? emailFull : emailBase, whatsapp: whatsappFull.length <= 1800 ? whatsappFull : whatsappBase, copyForEmail: emailFull.length > 1800, copyForWhatsapp: whatsappFull.length > 1800 };
}
