import type { Metadata } from 'next';
import SEOContentPageClient from './SEOContentPageClient';

export const metadata: Metadata = {
  robots: { index: false, follow: true }, // Phase 3: thin AI tool noindexed pending rebuild/removal
  title: 'AI SEO Content Engine',
  description:
    'Generate SEO blog titles, meta descriptions, keyword clusters, and content outlines for local businesses and growing brands.',
  alternates: {
    canonical: '/tools/seo-content',
  },
  openGraph: {
    title: 'AI SEO Content Engine | Smile Fotilo',
    description:
      'Create SEO-friendly blog ideas, metadata, and outlines with Smile Fotilo AI.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/seo-content',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI SEO Content Engine | Smile Fotilo',
    description:
      'Create SEO-friendly blog ideas, metadata, and outlines with Smile Fotilo AI.',
  },
};

export default function Page() {
  return <SEOContentPageClient />;
}
