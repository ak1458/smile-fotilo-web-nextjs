import PortfolioPageClient from './PortfolioPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Developer & Creator',
  description: 'Interactive portfolio showcasing my GitHub projects and professional experience.',
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
