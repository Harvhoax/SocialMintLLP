import type { Question } from '@/data/service-questions';
import { absoluteUrl } from '@/data/site';

// Describes the same questions and answers rendered in native HTML. This is
// standard vocabulary, not a promise of AI citations or FAQ rich results.
export function faqSchema(questions: readonly Question[], path: string, about: string) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    '@id': absoluteUrl(`${path}#webpage`), url: absoluteUrl(path), inLanguage: 'en-IN',
    isPartOf: { '@id': absoluteUrl('/#website') },
    publisher: { '@id': absoluteUrl('/#organization') }, about: { '@id': about },
    mainEntity: questions.map(item => ({
      '@type': 'Question', '@id': absoluteUrl(`${path}#${item.id}`), name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
