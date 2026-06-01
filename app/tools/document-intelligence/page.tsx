import type { Metadata } from 'next';
import DocumentIntelligencePageClient from './DocumentIntelligencePageClient';

export const metadata: Metadata = {
  robots: { index: false, follow: true }, // Phase 3: thin AI tool noindexed pending rebuild/removal
  title: 'Document Intelligence Tool',
  description:
    'Analyze document text with AI to extract summaries, structured data, key fields, and actionable next steps.',
  alternates: {
    canonical: '/tools/document-intelligence',
  },
  openGraph: {
    title: 'Document Intelligence Tool | Smile Fotilo',
    description:
      'Turn raw document text into summaries, extracted fields, and action items with Smile Fotilo AI.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/document-intelligence',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Document Intelligence Tool | Smile Fotilo',
    description:
      'Turn raw document text into summaries, extracted fields, and action items with Smile Fotilo AI.',
  },
};

export default function Page() {
  return <DocumentIntelligencePageClient />;
}
