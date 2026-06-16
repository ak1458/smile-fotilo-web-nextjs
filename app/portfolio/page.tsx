import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { toProjects, splitFeatured, type GithubRepo, type Project } from './lib/portfolio';
import { GITHUB_USER, FALLBACK_PROJECTS } from '@/app/data/portfolio';

export const revalidate = 3600; // ISR: new repos appear within 1h, no deploy

export const metadata: Metadata = {
  title: 'Ashraf Kamal — Full-Stack Developer & AI Product Builder',
  description:
    'Portfolio of Ashraf Kamal — full-stack developer, AI-assisted product builder, automation & SEO. Live projects pulled from GitHub. Founder of Smile Fotilo.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Ashraf Kamal — Portfolio',
    description: 'Full-stack developer & AI product builder. Live work pulled from GitHub.',
    url: 'https://smilefotilo.com/portfolio',
    type: 'profile',
  },
};

async function getData(): Promise<{ projects: Project[]; repoCount: number }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`,
      { next: { revalidate: 3600 }, headers: { Accept: 'application/vnd.github+json' } },
    );
    if (!res.ok) throw new Error(`gh ${res.status}`);
    const repos = (await res.json()) as GithubRepo[];
    const projects = toProjects(repos);
    if (!projects.length) throw new Error('empty');
    return { projects, repoCount: Array.isArray(repos) ? repos.length : projects.length };
  } catch {
    return { projects: FALLBACK_PROJECTS as unknown as Project[], repoCount: FALLBACK_PROJECTS.length };
  }
}

export default async function PortfolioPage() {
  const { projects, repoCount } = await getData();
  const { featured, rest } = splitFeatured(projects);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Ashraf Kamal',
      jobTitle: 'Full-Stack Developer & AI Product Builder',
      url: 'https://smilefotilo.com/portfolio',
      sameAs: ['https://github.com/ak1458'],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioClient featured={featured} rest={rest} repoCount={repoCount} />
    </>
  );
}
