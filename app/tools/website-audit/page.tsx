import type { Metadata } from 'next';
import WebsiteAuditPageClient from './WebsiteAuditPageClient';

export const metadata: Metadata = {
  title: 'AI Website Audit Tool',
  description:
    'Run a fast AI website audit to review SEO, performance, and technical issues with graded recommendations.',
  alternates: {
    canonical: '/tools/website-audit',
  },
  openGraph: {
    title: 'AI Website Audit Tool | Smile Fotilo',
    description:
      'Audit any website for SEO, speed, and technical issues with Smile Fotilo AI.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/website-audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Website Audit Tool | Smile Fotilo',
    description:
      'Audit any website for SEO, speed, and technical issues with Smile Fotilo AI.',
  },
};

export default function Page() {
  return <WebsiteAuditPageClient />;
}
