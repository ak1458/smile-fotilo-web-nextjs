import { toProjects, splitFeatured, type GithubRepo } from '../lib/portfolio';

const repo = (o: Partial<GithubRepo>): GithubRepo => ({
  id: 1,
  name: 'thing',
  description: 'A thing',
  html_url: 'https://github.com/ak1458/thing',
  homepage: null,
  language: 'TypeScript',
  topics: [],
  archived: false,
  pushed_at: '2026-06-01T00:00:00Z',
  fork: false,
  ...o,
});

describe('toProjects', () => {
  it('drops junk repos (template/config/dotfiles/profile)', () => {
    const out = toProjects([repo({ name: 'dotfiles' }), repo({ name: 'my-template' }), repo({ name: 'ak1458' })]);
    expect(out.find((p) => /dotfiles|template/i.test(p.name))).toBeUndefined();
  });

  it('drops repos with no description', () => {
    const out = toProjects([repo({ name: 'nodesc', description: null })]);
    expect(out).toHaveLength(0);
  });

  it('applies name alias (tuition-mandi -> Takhti)', () => {
    const out = toProjects([repo({ name: 'tuition-mandi' })]);
    expect(out[0].name).toBe('Takhti');
  });

  it('derives category from topic, falling back to language', () => {
    const [a, b] = toProjects([
      repo({ id: 10, name: 'bot', topics: ['ai', 'whatever'] }),
      repo({ id: 11, name: 'sitez', topics: [], language: 'PHP' }),
    ]);
    expect(a.category).toBe('AI & Automation');
    expect(b.category).toContain('PHP');
  });

  it('derives status: archived -> Archived, homepage -> Live, else Active', () => {
    const [arch, live, act] = toProjects([
      repo({ id: 1, name: 'oldp', archived: true }),
      repo({ id: 2, name: 'livep', homepage: 'https://x.com' }),
      repo({ id: 3, name: 'actp' }),
    ]);
    expect(arch.status).toBe('Archived');
    expect(live.status).toBe('Live');
    expect(act.status).toBe('Active');
  });

  it('uses homepage as liveUrl and html_url as repoUrl', () => {
    const [p] = toProjects([repo({ name: 'p', homepage: 'https://demo.dev' })]);
    expect(p.liveUrl).toBe('https://demo.dev');
    expect(p.repoUrl).toBe('https://github.com/ak1458/thing');
  });

  it('dedupes repo families (keeps one per family, newest)', () => {
    const out = toProjects([
      repo({ id: 1, name: 'takhti', pushed_at: '2025-01-01T00:00:00Z' }),
      repo({ id: 2, name: 'takhti-v2', pushed_at: '2026-01-01T00:00:00Z' }),
    ]);
    expect(out).toHaveLength(1);
  });

  it('marks a repo featured when it has topic "featured"', () => {
    const [p] = toProjects([repo({ name: 'star', topics: ['featured'] })]);
    expect(p.featured).toBe(true);
  });

  it('caps featured by FEATURED_COUNT via heuristic when no explicit topic', () => {
    const repos = Array.from({ length: 8 }, (_, i) =>
      repo({ id: i, name: `proj${i}`, homepage: 'https://x.com', pushed_at: `2026-0${(i % 8) + 1}-01T00:00:00Z` }));
    const out = toProjects(repos);
    expect(out.filter((p) => p.featured).length).toBeLessThanOrEqual(3);
  });

  it('sorts newest first and excludes forks', () => {
    const out = toProjects([
      repo({ id: 1, name: 'old', pushed_at: '2024-01-01T00:00:00Z' }),
      repo({ id: 2, name: 'newp', pushed_at: '2026-06-01T00:00:00Z' }),
      repo({ id: 3, name: 'forked', fork: true }),
    ]);
    expect(out[0].name).toBe('Newp');
    expect(out.find((p) => /forked/i.test(p.name))).toBeUndefined();
  });

  it('splitFeatured separates featured from rest', () => {
    const projects = toProjects([
      repo({ id: 1, name: 'one', topics: ['featured'] }),
      repo({ id: 2, name: 'two' }),
    ]);
    const { featured, rest } = splitFeatured(projects);
    expect(featured.every((p) => p.featured)).toBe(true);
    expect(rest.every((p) => !p.featured)).toBe(true);
  });
});
