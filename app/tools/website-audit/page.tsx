import type { Metadata } from 'next';
import WebsiteAuditPageClient from './WebsiteAuditPageClient';

export const metadata: Metadata = {
  title: 'Free Website Audit Tool — SEO, Speed & Mobile Checker',
  description:
    'Free website audit: real SEO, performance, mobile, and security checks with category scores and prioritized fixes. Enter any URL and get results in seconds.',
  alternates: {
    canonical: '/tools/website-audit',
  },
  openGraph: {
    title: 'Free Website Audit Tool | Smile Fotilo',
    description:
      'Run a real SEO, speed, mobile, and security audit on any website — scored by category with prioritized fixes.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/website-audit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Website Audit Tool | Smile Fotilo',
    description:
      'Run a real SEO, speed, mobile, and security audit on any website — scored by category with prioritized fixes.',
  },
};

export default function Page() {
  return <WebsiteAuditPageClient />;
}
