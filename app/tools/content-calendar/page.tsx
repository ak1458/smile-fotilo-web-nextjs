import type { Metadata } from 'next';
import ContentCalendarPageClient from './ContentCalendarPageClient';

export const metadata: Metadata = {
  title: 'AI Content Calendar Generator',
  description:
    'Generate a 7-day social content calendar with captions, hashtags, post ideas, and publishing guidance tailored to your business.',
  alternates: {
    canonical: '/tools/content-calendar',
  },
  openGraph: {
    title: 'AI Content Calendar Generator | Smile Fotilo',
    description:
      'Plan a full week of social content with AI-generated captions, themes, and posting ideas.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/content-calendar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Content Calendar Generator | Smile Fotilo',
    description:
      'Plan a full week of social content with AI-generated captions, themes, and posting ideas.',
  },
};

export default function Page() {
  return <ContentCalendarPageClient />;
}
