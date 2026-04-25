import type { Metadata } from 'next';
import BuilderPageClient from './BuilderPageClient';

export const metadata: Metadata = {
  title: 'AI Agent Builder',
  description:
    'Preview the Smile Fotilo AI Agent Builder workflow for configuration, integrations, and deployment planning.',
  alternates: {
    canonical: '/builder',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function Page() {
  return <BuilderPageClient />;
}
