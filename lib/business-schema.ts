import { absoluteUrl, site } from '@/data/site';
import { partners } from '@/data/partners';
import { serviceDetails } from '@/data/service-details';

export const organizationId = absoluteUrl('/#organization');
export const websiteId = absoluteUrl('/#website');
export const serviceArea = [{ '@type': 'City', name: 'Mumbai' }, { '@type': 'Country', name: 'India' }];

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': organizationId, name: site.name, legalName: site.legalName, url: absoluteUrl(),
        description: site.description, email: site.email, telephone: site.phone,
        logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/logo.png'), width: 1296, height: 1213 },
        areaServed: serviceArea,
        contactPoint: { '@type': 'ContactPoint', contactType: 'Sales enquiries', telephone: site.phone, email: site.email },
        member: partners.map((_, index) => ({ '@id': absoluteUrl(`/#partner-${index + 1}`) })),
        hasOfferCatalog: { '@type': 'OfferCatalog', name: 'SocialMint creative services', itemListElement: serviceDetails.map(service => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service.name, url: absoluteUrl(`/services/${service.slug}`), description: service.summary, provider: { '@id': organizationId }, areaServed: serviceArea } })) },
      },
      { '@type': 'WebSite', '@id': websiteId, name: site.name, url: absoluteUrl(), inLanguage: 'en-IN', publisher: { '@id': organizationId } },
      ...partners.map((partner, index) => ({
        '@type': 'Person', '@id': absoluteUrl(`/#partner-${index + 1}`), name: partner.name, jobTitle: partner.role,
        description: partner.bio, image: absoluteUrl(partner.photo), sameAs: [partner.linkedin],
        worksFor: { '@id': organizationId }, url: absoluteUrl('/#partners'),
      })),
    ],
  };
}
