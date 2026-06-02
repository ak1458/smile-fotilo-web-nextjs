import PortfolioPageClient from './PortfolioPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio — Ashraf Kamal | Web Developer & AI-Automation Builder',
  description: 'Selected client work and personal projects by Ashraf Kamal — React, Next.js, WordPress and AI. Real websites and web apps for businesses across India and the US.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Portfolio — Ashraf Kamal | Smile Fotilo',
    description: 'Real client work and personal projects: PulseKart POS, Veloria Vault, StoryBook Weddings, Takhti and more.',
    url: 'https://smilefotilo.com/portfolio',
    type: 'website',
  },
};

export default async function PortfolioPage() {
  // Fetch GitHub repos at build/request time
  let repos = [];
  try {
    const res = await fetch('https://api.github.com/users/ak1458/repos?sort=updated&per_page=100', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (res.ok) {
      repos = await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch github repos', err);
  }

  return <PortfolioPageClient initialRepos={repos} />;
}
