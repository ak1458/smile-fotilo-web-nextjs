// Thin config for the GitHub-fed portfolio. NOT project content — repos are the content.

export const GITHUB_USER = 'ak1458';
export const FEATURED_COUNT = 3;

// repos whose names match are excluded entirely (junk / infra / profile readme)
export const JUNK_RE = /(\.github|original|souce|source|archive|legacy|backup|-old\b|\btest\b|template|\bconfig\b|dotfiles|^ak1458$)/i;

// repo name (lowercase) -> clean display name
export const NAME_ALIASES: Record<string, string> = {
  'tuition-mandi': 'Takhti',
  'tuition-mandi-pwa': 'Takhti',
  'kapdafactory-web-nextjs': 'KapdaFactory',
  'kapdafactory-legacy-laravel': 'KapdaFactory',
  'veloriavault-headless-v2': 'Veloria Vault',
  'veloriavault-web-nextjs': 'Veloria Vault',
  'veloriavault-headless-v1': 'Veloria Vault',
  'pulsekart-web-nextjs': 'PulseKart',
  'smile-fotilo-web-nextjs': 'Smile Fotilo',
  'carfax-for-boats': 'Carfax for Boats',
  'attest-health-tracker': 'Attest Health',
  'sovereign-vault': 'Sovereign Vault',
  'ai-executive-seo-agent': 'AI SEO Agent',
  'creator-agent-toolbox': 'Creator Agent Toolbox',
  'youtube-bulk-optimizer': 'YouTube Bulk Optimizer',
  'liar-loop-puzzle': 'Liar Loop',
  'simple-trivia-app': 'Trivia & Jokes',
};

// repo topic -> category label (first match wins; order matters)
export const TOPIC_CATEGORY: Array<[string, string]> = [
  ['ai', 'AI & Automation'],
  ['automation', 'Automation'],
  ['ecommerce', 'E-Commerce'],
  ['e-commerce', 'E-Commerce'],
  ['wordpress', 'WordPress'],
  ['game', 'Game'],
  ['seo', 'SEO'],
  ['saas', 'SaaS · Full-stack'],
  ['webapp', 'Web App'],
  ['web-app', 'Web App'],
];

// manual cover override: repo name (lowercase) -> /public path.
// Drop a 16:11 image (≈1280×880, .webp/.png/.jpg) at each path. Missing files
// fall back to the generated gradient cover automatically (Work.tsx onError).
export const THUMBNAIL_OVERRIDES: Record<string, string> = {
  'kapdafactory-web-nextjs': '/portfolio/covers/kapdafactory.png',
  'veloriavault-headless-v2': '/portfolio/covers/veloriavault.png',
  'veloriavault-web-nextjs': '/portfolio/covers/veloriavault.png',
  'veloriavault-headless-v1': '/portfolio/covers/veloriavault.png',
  'pulsekart-web-nextjs': '/portfolio/covers/pulsekart.png',
  'carfax-for-boats': '/portfolio/covers/carfax-boats.png',
  'attest-health-tracker': '/portfolio/covers/attest-health.png',
  'sovereign-vault': '/portfolio/covers/sovereign-vault.png',
  'ai-executive-seo-agent': '/portfolio/covers/ai-seo-agent.png',
  'creator-agent-toolbox': '/portfolio/covers/creator-toolbox.png',
  'youtube-bulk-optimizer': '/portfolio/covers/youtube-optimizer.png',
  // No cover yet (gradient fallback): tuition-mandi-pwa (Takhti),
  // smile-fotilo-web-nextjs, liar-loop-puzzle, simple-trivia-app.
};

// deterministic accent palette for generated gradient covers
export const ACCENTS = ['#3D7BFF', '#22D3EE', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'];

// shown ONLY if the GitHub fetch fails, so the page is never empty
export const FALLBACK_PROJECTS = [
  {
    id: -1,
    name: 'Takhti',
    category: 'AI & Automation',
    summary: 'Tuition management platform for coaching centres.',
    tech: ['Next.js', 'TypeScript'],
    repoUrl: 'https://github.com/ak1458',
    liveUrl: null,
    status: 'Active' as const,
    featured: true,
    accent: '#3D7BFF',
    pushedAt: '',
  },
];

// real social links; empty string = omit the link (never fabricate one)
export const SOCIAL = {
  github: 'https://github.com/ak1458',
  whatsapp: 'https://wa.me/919453878422?text=Hi%20Ashraf%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project.',
  email: 'ashrafkamal1458@gmail.com',
  linkedin: '',
  youtube: '',
};

// public Google Business reviews page (linked WITHOUT any review/star count — pinned decision)
export const GOOGLE_REVIEWS_URL = 'https://search.google.com/local/reviews?placeid=ChIJy15NOsPzmTkRJNmOFVBIiHQ';
