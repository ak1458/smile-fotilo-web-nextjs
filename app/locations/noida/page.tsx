import type { Metadata } from 'next';
import { LocationAreaTemplate } from '../LocationAreaTemplate';
import { LocationSchema } from '../../components/LocationSchema';
import { getServiceAreaLocation } from '../../data/locations';

// Restores the local landing page Google still expects from the old
// noida.smilefotilo.com subdomain era (dead since the WP migration).
const location = getServiceAreaLocation('noida')!;

export const metadata: Metadata = {
  title: location.metaTitle,
  description: location.metaDescription,
  alternates: { canonical: '/locations/noida' },
  openGraph: {
    title: location.metaTitle,
    description: location.metaDescription,
    type: 'website',
    url: 'https://smilefotilo.com/locations/noida',
    images: [
      {
        url: '/og?title=Noida&subtitle=Website%20Development%20%C2%B7%20SEO%20%C2%B7%20NCR',
        width: 1200,
        height: 630,
        alt: 'Web design and SEO services in Noida',
      },
    ],
  },
};

export default function NoidaPage() {
  return (
    <>
      <LocationSchema location="noida" />
      <LocationAreaTemplate location={location} />
    </>
  );
}
