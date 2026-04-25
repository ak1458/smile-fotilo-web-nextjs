import type { Metadata } from 'next';
import WebsiteFactoryPageClient from './WebsiteFactoryPageClient';

export const metadata: Metadata = {
  title: 'AI Website Factory',
  description:
    'Generate a website blueprint with sitemap, messaging, design direction, keywords, and launch checklist from a simple brief.',
  alternates: {
    canonical: '/tools/website-factory',
  },
  openGraph: {
    title: 'AI Website Factory | Smile Fotilo',
    description:
      'Create a website blueprint with structure, copy direction, and launch planning using Smile Fotilo AI.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/website-factory',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Website Factory | Smile Fotilo',
    description:
      'Create a website blueprint with structure, copy direction, and launch planning using Smile Fotilo AI.',
  },
};

export default function Page() {
  return <WebsiteFactoryPageClient />;
}
