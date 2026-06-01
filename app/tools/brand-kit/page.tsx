import type { Metadata } from 'next';
import BrandKitPageClient from './BrandKitPageClient';

export const metadata: Metadata = {
  robots: { index: false, follow: true }, // Phase 3: thin AI tool noindexed pending rebuild/removal
  title: 'AI Brand Kit Generator',
  description:
    'Create an AI-powered brand kit with color palette, typography direction, brand voice, taglines, and social bios for your business.',
  alternates: {
    canonical: '/tools/brand-kit',
  },
  openGraph: {
    title: 'AI Brand Kit Generator | Smile Fotilo',
    description:
      'Generate brand identity direction, palette, voice, and social assets with Smile Fotilo AI.',
    type: 'website',
    url: 'https://smilefotilo.com/tools/brand-kit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Brand Kit Generator | Smile Fotilo',
    description:
      'Generate brand identity direction, palette, voice, and social assets with Smile Fotilo AI.',
  },
};

export default function Page() {
  return <BrandKitPageClient />;
}
