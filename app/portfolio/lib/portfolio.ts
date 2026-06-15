import {
  JUNK_RE, NAME_ALIASES, TOPIC_CATEGORY, THUMBNAIL_OVERRIDES, ACCENTS, FEATURED_COUNT,
} from '@/app/data/portfolio';

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  archived?: boolean;
  pushed_at?: string;
  fork?: boolean;
}

export type ProjectStatus = 'Live' | 'Active' | 'Archived';

export interface Project {
  id: number;
  name: string;
  category: string;
  summary: string;
  tech: string[];
  repoUrl: string;
  liveUrl: string | null;
  status: ProjectStatus;
  featured: boolean;
  accent: string;
  thumbnail?: string;
  pushedAt: string;
}

const titleCase = (n: string) => n.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const familyKey = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);

function category(r: GithubRepo): string {
  const topics = (r.topics || []).map((t) => t.toLowerCase());
  for (const [t, label] of TOPIC_CATEGORY) if (topics.includes(t)) return label;
  return r.language ? `${r.language} · Web App` : 'Open Source';
}

function status(r: GithubRepo): ProjectStatus {
  if (r.archived) return 'Archived';
  if (r.homepage) return 'Live';
  return 'Active';
}

function techBadges(r: GithubRepo): string[] {
  const out = new Set<string>();
  if (r.language) out.add(r.language);
  for (const t of r.topics || []) {
    if (!['featured'].includes(t.toLowerCase())) out.add(titleCase(t));
  }
  return [...out].slice(0, 5);
}

export function toProjects(repos: GithubRepo[]): Project[] {
  const clean = (repos || []).filter(
    (r) => r && r.name && !r.fork && !JUNK_RE.test(r.name) && r.description && r.description.trim(),
  );

  // dedupe families: keep newest per family key
  const fam = new Map<string, GithubRepo>();
  for (const r of clean) {
    const k = familyKey(r.name);
    const prev = fam.get(k);
    if (!prev || new Date(r.pushed_at || 0) > new Date(prev.pushed_at || 0)) fam.set(k, r);
  }

  const sorted = [...fam.values()].sort(
    (a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime(),
  );

  const projects: Project[] = sorted.map((r, i) => {
    const aliased = NAME_ALIASES[r.name.toLowerCase()] ?? titleCase(r.name);
    return {
      id: r.id,
      name: aliased,
      category: category(r),
      summary: (r.description || '').trim(),
      tech: techBadges(r),
      repoUrl: r.html_url,
      liveUrl: r.homepage || null,
      status: status(r),
      featured: (r.topics || []).map((t) => t.toLowerCase()).includes('featured'),
      accent: ACCENTS[i % ACCENTS.length],
      thumbnail: THUMBNAIL_OVERRIDES[r.name.toLowerCase()],
      pushedAt: r.pushed_at || '',
    };
  });

  // if no explicit featured topic anywhere, promote top N (has live > recency)
  if (!projects.some((p) => p.featured)) {
    const rank = [...projects].sort(
      (a, b) =>
        Number(!!b.liveUrl) - Number(!!a.liveUrl) ||
        new Date(b.pushedAt || 0).getTime() - new Date(a.pushedAt || 0).getTime(),
    );
    for (const p of rank.slice(0, FEATURED_COUNT)) p.featured = true;
  }
  return projects;
}

export function splitFeatured(projects: Project[]) {
  return {
    featured: projects.filter((p) => p.featured),
    rest: projects.filter((p) => !p.featured),
  };
}
