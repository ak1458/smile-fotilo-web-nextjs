import type { Metadata } from 'next';
import InstallTemplatePageClient from './InstallTemplatePageClient';

const titleizeSlug = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const templateName = titleizeSlug(slug);

  return {
    title: `Install ${templateName} Template`,
    description: `Configure and install the ${templateName} AI agent template for your business inside the Smile Fotilo marketplace.`,
    alternates: {
      canonical: `/marketplace/${slug}/install`,
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
}

export default function Page() {
  return <InstallTemplatePageClient />;
}
