# Portfolio AURORA Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/portfolio` as a standalone, immersive, mobile-first premium showcase whose project list is pulled live from GitHub (auto-appears, no deploy), faithfully porting the owner's "AURORA" mockup into Next.js 16 / React 19 with real-data-only content.

**Architecture:** Server Component fetches `github.com/ak1458` repos with ISR (`revalidate:3600`), transforms them with a pure tested logic module, and passes a typed `Project[]` to a client root that orchestrates the AURORA sections. Three.js (hero + skills) is dynamic-imported `ssr:false`, desktop+capable only; mobile/reduced-motion get CSS/2D fallbacks. Styles are a scoped CSS-module port of the mockup; fonts via `next/font`.

**Tech Stack:** Next.js 16.2 (server + ISR), React 19, TypeScript, framer-motion 12, three 0.182 (already a dep), lenis (new, desktop-only optional), Tailwind 4 (global) + scoped CSS module, Jest.

**Reference mockup (exact CSS/markup/JS to port):** `../_mockup_extract/Ashraf Kamal - Portfolio.html`, `../_mockup_extract/assets/styles.css`, `../_mockup_extract/assets/app.js`, `../_mockup_extract/assets/scene.js` (relative to repo root `smile-fotilo/`, the zip was extracted to the parent dir `smilefotilo live on varcel/_mockup_extract/`).

**Real data only (no inventions — test-enforced rule):**
- GitHub user: `ak1458` (19 public repos).
- Stats: `4.9★`, `118` Google reviews, `10+` projects, `2` countries.
- Testimonials: from `app/components/Testimonials.tsx` (3 verified Google reviews + client quotes).
- Contact: WhatsApp `wa.me/919453878422`, email `ashrafkamal1458@gmail.com`, GitHub `github.com/ak1458`. LinkedIn/YouTube URLs unknown → leave configurable; omit a link if its URL is empty (never fake one).
- Email submit: existing server action in `app/actions/email.ts`.

---

## File Structure

```
app/portfolio/
  page.tsx                      # REPLACE — server: fetch GitHub + transform + ISR + metadata + JSON-LD
  PortfolioClient.tsx           # CREATE — client root: providers, Lenis(desktop), section order, case overlay state
  sections/
    PortfolioNav.tsx            # CREATE
    MenuOverlay.tsx             # CREATE
    Hero.tsx                    # CREATE
    About.tsx                   # CREATE
    Work.tsx                    # CREATE
    CaseOverlay.tsx             # CREATE
    Experience.tsx              # CREATE
    Skills.tsx                  # CREATE
    Voices.tsx                  # CREATE
    Contact.tsx                 # CREATE
    PortfolioFooter.tsx         # CREATE
  three/
    HeroScene.tsx               # CREATE — dynamic, ssr:false
    SkillsScene.tsx             # CREATE — dynamic, ssr:false (2D fallback lives in Skills.tsx)
  lib/
    portfolio.ts                # CREATE — pure transform/dedupe/categorize/status (TDD)
    hooks.ts                    # CREATE — useReveal, useMagnetic, useLenis, useReducedMotion, useIsDesktop
  portfolio.module.css          # CREATE — scoped AURORA tokens + styles (port of mockup styles.css)
  __tests__/
    portfolio.test.ts           # CREATE — unit tests for lib/portfolio.ts
app/data/portfolio.ts           # CREATE — thin config (user, aliases, topic map, overrides, fallback)
app/work/WorkPageClient.tsx     # MODIFY — fix Curbit contradiction only
app/work/[slug]/ProjectDetailClient.tsx  # MODIFY — fix Curbit contradiction only
app/work/[slug]/page.tsx        # MODIFY — fix Curbit contradiction only
PORTFOLIO_DELETED: app/portfolio/PortfolioPageClient.tsx  # DELETE — replaced by PortfolioClient + sections
```

The old `app/portfolio/PortfolioPageClient.tsx` is referenced by `app/data/__tests__/pricing.test.ts:86` and `app/__tests__/navigation-contract.test.ts:63`. Those tests read the file to assert pricing/nav rules. Task 15 updates those test references to the new file paths so the guards still hold.

---

## Task 1: Dependencies, fonts, scoped CSS foundation

**Files:**
- Modify: `package.json` (add `lenis`)
- Create: `app/portfolio/portfolio.module.css`
- Modify: `app/layout.tsx` (register fonts via `next/font` if not already global) — or create `app/portfolio/fonts.ts`
- Create: `app/portfolio/fonts.ts`

- [ ] **Step 1: Add Lenis dependency**

Run: `npm install lenis@^1.1.14`
Expected: added to `dependencies`, lockfile updated. (If install is blocked, mark Lenis optional and use native smooth scroll — see Task 5 fallback.)

- [ ] **Step 2: Create `app/portfolio/fonts.ts`** (self-hosted, CSP-safe, no CLS)

```ts
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from 'next/font/google';

export const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400','600','700','800'], variable: '--font-display', display: 'swap' });
export const serif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], style: ['normal','italic'], variable: '--font-serif', display: 'swap' });
export const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-mono', display: 'swap' });
export const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-sans-aurora', display: 'swap' });
```

- [ ] **Step 3: Port mockup CSS into `app/portfolio/portfolio.module.css`**

Copy the full contents of `_mockup_extract/assets/styles.css`. Transform:
- Wrap everything under a single root class `.aurora` (CSS-module local). Replace top-level selectors (`body`, `section`, `#hero`, `.wrap`, etc.) with `.aurora ...` descendants. The page root div gets `className={styles.aurora}`.
- Move the `:root{...}` custom properties block to `.aurora{...}` (scope tokens to the page so they don't leak site-wide).
- Replace the four `--display/--sans/--serif/--mono` font-family values with the `next/font` CSS variables: `var(--font-display)`, `var(--font-sans-aurora)`, `var(--font-serif)`, `var(--font-mono)`.
- Keep all `--accent`, `--motion`, `--grain` vars (set dynamically by Task 5).
- Keep all `@keyframes`, reveal primitives, and `@media` queries.
- ID selectors (`#work`, `#about`, …) → keep as IDs (used for anchor scroll). In a CSS module, reference via `:global(#work)` or keep section anchors as plain `id` attributes and style by class instead. Decision: convert section visual rules to classes (`.work`, `.about`…) applied alongside the `id`, so the module hashing works; keep the bare `id` only for the anchor target.

- [ ] **Step 4: Verify the module compiles**

Run: `npx tsc --noEmit` (expect no portfolio errors yet — file is CSS) and `npm run lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/portfolio/fonts.ts app/portfolio/portfolio.module.css
git commit -m "feat(portfolio): AURORA fonts + scoped CSS foundation + lenis dep"
```

---

## Task 2: Data config — `app/data/portfolio.ts`

**Files:**
- Create: `app/data/portfolio.ts`

- [ ] **Step 1: Write the config module**

```ts
// Thin config for the GitHub-fed portfolio. NOT project content — repos are the content.
export const GITHUB_USER = 'ak1458';
export const FEATURED_COUNT = 3;

// repos whose names match are excluded entirely (junk/infra/forks-of-templates)
export const JUNK_RE = /(\.github|original|souce|source|archive|legacy|backup|-old\b|\btest\b|template|\bconfig\b|dotfiles|^ak1458$)/i;

// historical repo name -> display name
export const NAME_ALIASES: Record<string, string> = {
  'tuition-mandi': 'Takhti',
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

// optional manual cover override: repo name -> /public path
export const THUMBNAIL_OVERRIDES: Record<string, string> = {};

// deterministic accent palette for generated gradient covers
export const ACCENTS = ['#3D7BFF', '#22D3EE', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E'];

// shown ONLY if the GitHub fetch fails, so the page is never empty
export const FALLBACK_PROJECTS = [
  { id: -1, name: 'Takhti', category: 'AI & Automation', summary: 'Tuition management platform.', tech: ['Next.js'], repoUrl: 'https://github.com/ak1458', liveUrl: null, status: 'Active' as const, featured: true, accent: '#3D7BFF' },
];

// real social links; empty string = omit the link (never fabricate)
export const SOCIAL = {
  github: 'https://github.com/ak1458',
  whatsapp: 'https://wa.me/919453878422?text=Hi%20Ashraf%2C%20I%20saw%20your%20portfolio%20and%20want%20to%20discuss%20a%20project.',
  email: 'ashrafkamal1458@gmail.com',
  linkedin: '',
  youtube: '',
};
```

- [ ] **Step 2: Typecheck + commit**

Run: `npx tsc --noEmit`
Expected: PASS.

```bash
git add app/data/portfolio.ts
git commit -m "feat(portfolio): GitHub-feed config (aliases, topic map, fallback, socials)"
```

---

## Task 3: GitHub transform/dedupe logic (TDD) — `app/portfolio/lib/portfolio.ts`

**Files:**
- Create: `app/portfolio/lib/portfolio.ts`
- Test: `app/portfolio/__tests__/portfolio.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// app/portfolio/__tests__/portfolio.test.ts
import { toProjects, type GithubRepo } from '../lib/portfolio';

const repo = (o: Partial<GithubRepo>): GithubRepo => ({
  id: 1, name: 'thing', description: 'A thing', html_url: 'https://github.com/ak1458/thing',
  homepage: null, language: 'TypeScript', topics: [], archived: false, pushed_at: '2026-06-01T00:00:00Z', fork: false, ...o,
});

describe('toProjects', () => {
  it('drops junk repos (template/config/dotfiles/profile)', () => {
    const out = toProjects([repo({ name: 'dotfiles' }), repo({ name: 'my-template' }), repo({ name: 'ak1458' })]);
    expect(out.find(p => /dotfiles|template/i.test(p.name))).toBeUndefined();
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
      repo({ name: 'bot', topics: ['ai', 'whatever'] }),
      repo({ name: 'sitez', topics: [], language: 'PHP' }),
    ]);
    expect(a.category).toBe('AI & Automation');
    expect(b.category).toContain('PHP');
  });

  it('derives status: archived -> Archived, homepage -> Live, else Active', () => {
    const [arch, live, act] = toProjects([
      repo({ name: 'oldp', archived: true }),
      repo({ name: 'livep', homepage: 'https://x.com' }),
      repo({ name: 'actp' }),
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
    expect(out.filter(p => p.featured).length).toBeLessThanOrEqual(3);
  });

  it('sorts newest first and excludes forks', () => {
    const out = toProjects([
      repo({ id: 1, name: 'old', pushed_at: '2024-01-01T00:00:00Z' }),
      repo({ id: 2, name: 'newp', pushed_at: '2026-06-01T00:00:00Z' }),
      repo({ id: 3, name: 'forked', fork: true }),
    ]);
    expect(out[0].name).toBe('Newp');
    expect(out.find(p => /forked/i.test(p.name))).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest app/portfolio/__tests__/portfolio.test.ts`
Expected: FAIL — `Cannot find module '../lib/portfolio'`.

- [ ] **Step 3: Implement `app/portfolio/lib/portfolio.ts`**

```ts
import { JUNK_RE, NAME_ALIASES, TOPIC_CATEGORY, THUMBNAIL_OVERRIDES, ACCENTS, FEATURED_COUNT } from '@/app/data/portfolio';

export interface GithubRepo {
  id: number; name: string; description: string | null; html_url: string;
  homepage: string | null; language: string | null; topics?: string[];
  archived?: boolean; pushed_at?: string; fork?: boolean;
}

export type ProjectStatus = 'Live' | 'Active' | 'Archived';

export interface Project {
  id: number; name: string; category: string; summary: string; tech: string[];
  repoUrl: string; liveUrl: string | null; status: ProjectStatus;
  featured: boolean; accent: string; thumbnail?: string; pushedAt: string;
}

const titleCase = (n: string) => n.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const familyKey = (n: string) => n.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6);

function category(r: GithubRepo): string {
  const topics = (r.topics || []).map(t => t.toLowerCase());
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
  for (const t of r.topics || []) if (!['featured'].includes(t.toLowerCase())) out.add(titleCase(t));
  return [...out].slice(0, 5);
}

export function toProjects(repos: GithubRepo[]): Project[] {
  const clean = (repos || []).filter(r =>
    r && r.name && !r.fork && !JUNK_RE.test(r.name) && r.description && r.description.trim());

  // dedupe families: keep newest per family key
  const fam = new Map<string, GithubRepo>();
  for (const r of clean) {
    const k = familyKey(r.name);
    const prev = fam.get(k);
    if (!prev || new Date(r.pushed_at || 0) > new Date(prev.pushed_at || 0)) fam.set(k, r);
  }

  const sorted = [...fam.values()].sort(
    (a, b) => new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime());

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
      featured: (r.topics || []).map(t => t.toLowerCase()).includes('featured'),
      accent: ACCENTS[i % ACCENTS.length],
      thumbnail: THUMBNAIL_OVERRIDES[r.name.toLowerCase()],
      pushedAt: r.pushed_at || '',
    };
  });

  // if no explicit featured topic anywhere, promote top N (has live > recency)
  if (!projects.some(p => p.featured)) {
    const rank = [...projects].sort((a, b) =>
      (Number(!!b.liveUrl) - Number(!!a.liveUrl)) ||
      (new Date(b.pushedAt || 0).getTime() - new Date(a.pushedAt || 0).getTime()));
    for (const p of rank.slice(0, FEATURED_COUNT)) p.featured = true;
  }
  return projects;
}

export function splitFeatured(projects: Project[]) {
  return { featured: projects.filter(p => p.featured), rest: projects.filter(p => !p.featured) };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest app/portfolio/__tests__/portfolio.test.ts`
Expected: PASS (all 10).

- [ ] **Step 5: Commit**

```bash
git add app/portfolio/lib/portfolio.ts app/portfolio/__tests__/portfolio.test.ts
git commit -m "feat(portfolio): tested GitHub repo -> Project transform (dedupe/category/status/featured)"
```

---

## Task 4: Server page — `app/portfolio/page.tsx`

**Files:**
- Modify (replace): `app/portfolio/page.tsx`
- Note: `app/portfolio/PortfolioPageClient.tsx` stays on disk until Task 14 (deleted there) to avoid breaking imports mid-build.

- [ ] **Step 1: Replace `page.tsx`**

```tsx
import type { Metadata } from 'next';
import PortfolioClient from './PortfolioClient';
import { toProjects, splitFeatured, type GithubRepo } from './lib/portfolio';
import { GITHUB_USER, FALLBACK_PROJECTS } from '@/app/data/portfolio';

export const revalidate = 3600; // ISR: new repos appear within 1h, no deploy

export const metadata: Metadata = {
  title: "Ashraf Kamal — Full-Stack Developer & AI Product Builder",
  description: 'Portfolio of Ashraf Kamal — full-stack developer, AI-assisted product builder, automation & SEO. Live projects pulled from GitHub. Founder of Smile Fotilo.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Ashraf Kamal — Portfolio',
    description: 'Full-stack developer & AI product builder. Live work pulled from GitHub.',
    url: 'https://smilefotilo.com/portfolio', type: 'profile',
  },
};

async function getProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`gh ${res.status}`);
    const repos = (await res.json()) as GithubRepo[];
    const projects = toProjects(repos);
    if (!projects.length) throw new Error('empty');
    return projects;
  } catch {
    return FALLBACK_PROJECTS as unknown as ReturnType<typeof toProjects>;
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects();
  const { featured, rest } = splitFeatured(projects);

  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person', name: 'Ashraf Kamal',
      jobTitle: 'Full-Stack Developer & AI Product Builder',
      url: 'https://smilefotilo.com/portfolio',
      sameAs: ['https://github.com/ak1458'],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioClient featured={featured} rest={rest} />
    </>
  );
}
```

- [ ] **Step 2: Add a temporary stub `PortfolioClient`** so the build compiles before Task 5 fills it.

```tsx
// app/portfolio/PortfolioClient.tsx (stub — replaced in Task 5)
'use client';
import type { Project } from './lib/portfolio';
export default function PortfolioClient({ featured, rest }: { featured: Project[]; rest: Project[] }) {
  return <main style={{ padding: 80 }}>{featured.length + rest.length} projects loaded</main>;
}
```

- [ ] **Step 3: Verify build/typecheck**

Run: `npx tsc --noEmit && npm run lint`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/portfolio/page.tsx app/portfolio/PortfolioClient.tsx
git commit -m "feat(portfolio): server page with ISR GitHub fetch + JSON-LD (client stub)"
```

---

## Task 5: Client hooks + client root — `app/portfolio/lib/hooks.ts`, `PortfolioClient.tsx`

Port the cross-cutting behaviors from `_mockup_extract/assets/app.js` into reusable React hooks, then assemble the section order. Behaviors: Lenis smooth scroll (desktop only), scroll-based reveals (the `.reveal`/`.lines` → `.in` pattern, freeze-safe probe), magnetic buttons, 3D tilt, active-section nav, accent/motion CSS vars, clock.

**Files:**
- Create: `app/portfolio/lib/hooks.ts`
- Replace: `app/portfolio/PortfolioClient.tsx`

- [ ] **Step 1: Implement hooks**

```tsx
// app/portfolio/lib/hooks.ts
'use client';
import { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches); on();
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function useIsDesktop(min = 880) {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = matchMedia(`(min-width:${min}px) and (pointer:fine)`);
    const on = () => setDesktop(mq.matches); on();
    mq.addEventListener('change', on); return () => mq.removeEventListener('change', on);
  }, [min]);
  return desktop;
}

// Lenis on desktop, non-reduced-motion only. No-op (native scroll) otherwise.
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0; let alive = true;
    import('lenis').then(({ default: Lenis }) => {
      if (!alive) return;
      lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const loop = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    }).catch(() => {});
    return () => { alive = false; cancelAnimationFrame(raf); lenis?.destroy(); };
  }, [enabled]);
}

// scroll-based reveal: adds `revealAnimClass` to <html>, toggles `.in` (use the CSS-module class names)
export function useReveals(inClass: string, animClass: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled) { document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add(inClass)); return; }
    document.documentElement.classList.add(animClass);
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const check = () => {
      const vh = innerHeight;
      for (let i = items.length - 1; i >= 0; i--) {
        const r = items[i].getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -50) { items[i].classList.add(inClass); items.splice(i, 1); }
      }
    };
    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { check(); ticking = false; }); } };
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
    check(); const t1 = setTimeout(check, 300); const t2 = setTimeout(check, 900);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); clearTimeout(t1); clearTimeout(t2); document.documentElement.classList.remove(animClass); };
  }, [inClass, animClass, enabled]);
}

export function useMagnetic(enabled: boolean) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !enabled) return;
    const label = el.querySelector<HTMLElement>('[data-mlabel]') || el;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${mx * 0.28}px,${my * 0.28}px)`;
      label.style.transform = `translate(${mx * 0.12}px,${my * 0.12}px)`;
    };
    const leave = () => { el.style.transform = ''; label.style.transform = ''; };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [enabled]);
  return ref;
}

export function useClock() {
  const [t, setT] = useState('—');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-US', { hour12: false, timeZoneName: 'short' }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return t;
}
```

- [ ] **Step 2: Implement `PortfolioClient.tsx`** (assembles sections, owns accent var + case-overlay state)

```tsx
'use client';
import { useState } from 'react';
import s from './portfolio.module.css';
import { display, serif, mono, sans } from './fonts';
import { useReducedMotion, useIsDesktop, useLenis, useReveals } from './lib/hooks';
import type { Project } from './lib/portfolio';
import PortfolioNav from './sections/PortfolioNav';
import MenuOverlay from './sections/MenuOverlay';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Voices from './sections/Voices';
import Contact from './sections/Contact';
import PortfolioFooter from './sections/PortfolioFooter';
import CaseOverlay from './sections/CaseOverlay';

export default function PortfolioClient({ featured, rest }: { featured: Project[]; rest: Project[] }) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<Project | null>(null);
  useLenis(desktop && !reduced);
  useReveals(s.in, s.revealAnim, !reduced);

  return (
    <div className={`${s.aurora} ${display.variable} ${serif.variable} ${mono.variable} ${sans.variable}`}>
      <div className={s.grain} /><div className={s.vignette} />
      <PortfolioNav onMenu={() => setMenuOpen(v => !v)} menuOpen={menuOpen} desktop={desktop} reduced={reduced} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Hero desktop={desktop} reduced={reduced} />
      <main>
        <About />
        <Work featured={featured} rest={rest} onOpen={setActive} desktop={desktop} reduced={reduced} />
        <Experience reduced={reduced} />
        <Skills desktop={desktop} reduced={reduced} />
        <Voices reduced={reduced} />
        <Contact />
      </main>
      <PortfolioFooter />
      <CaseOverlay project={active} onClose={() => setActive(null)} />
    </div>
  );
}
```

- [ ] **Step 3: Create placeholder section components** so it compiles. Each is a minimal `export default function X(){return null}` to be filled in Tasks 6–14.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/portfolio/lib/hooks.ts app/portfolio/PortfolioClient.tsx app/portfolio/sections
git commit -m "feat(portfolio): client hooks + client root assembling sections (placeholders)"
```

---

## Task 6: PortfolioNav + MenuOverlay

Port nav (`.nav`, hide/solid on scroll, active dot) and fullscreen menu overlay (`.overlay`, clip-path) from mockup HTML lines 18–62 + app.js `initNav`/`initMenu`, and CSS `.nav`/`.overlay` blocks.

**Files:** Create `app/portfolio/sections/PortfolioNav.tsx`, `app/portfolio/sections/MenuOverlay.tsx`.

- [ ] **Step 1: PortfolioNav** — fixed bar; brand "AK / Ashraf Kamal · FULL-STACK · AI"; desktop links (About/Work/Experience/Skills/Voices/Contact) with active dot driven by a scroll listener (port `initNav` active logic); "Let's talk" magnetic CTA → `#contact`; hamburger calls `onMenu`. Hide on scroll-down past 320px, `solid` class past 40px. Smooth anchor clicks via `scrollIntoView` (Lenis intercepts when present). Real social/contact targets from `SOCIAL`.
- [ ] **Step 2: MenuOverlay** — fullscreen; numbered links (01 About … 06 Contact); side panel "Direct" with real links from `SOCIAL` (omit LinkedIn/YouTube if empty); ESC + link click closes; lock body scroll while open. Use module classes `.overlay`, `.ovGrid`, `.ovNav`, `.ovSide`; toggle open by adding `s.menuOpen` to `document.body` (CSS uses `body.menu-open .overlay`) — in module form, drive via a prop class on the overlay root instead of body class to keep scoping; replicate the clip-path transition.
- [ ] **Step 3:** `npx tsc --noEmit && npm run lint` → PASS.
- [ ] **Step 4: Commit** `feat(portfolio): immersive nav + fullscreen menu overlay`.

---

## Task 7: Hero (+ HeroScene three, lazy)

Port `#hero` (mockup HTML 64–113, CSS `#hero`…`.marquee`). Line-mask title reveal, hero meta (clock), lead + CTAs, scroll cue, tech marquee.

**Files:** Create `app/portfolio/sections/Hero.tsx`, `app/portfolio/three/HeroScene.tsx`.

- [ ] **Step 1: Hero.tsx** — markup port. Title lines via `data-reveal`/line-mask classes. Real lead copy: "Full-stack developer, AI-assisted product builder & founder of Smile Fotilo. I build fast, scalable digital products — modern web, AI workflows, automation, and SEO." CTAs: "View selected work" → `#work` (magnetic) and "Start a project" → WhatsApp. Marquee items: React · Next.js · TypeScript · **AI Automation** · WordPress · Performance · SEO. Background: `<HeroScene>` only when `desktop && !reduced`, else a CSS gradient/aurora div (port `.ph-grid`-style gradient).
- [ ] **Step 2: HeroScene.tsx** — `'use client'`; port `_mockup_extract/assets/scene.js` hero scene (the "monolith/field/grid" — pick `monolith` default) into a self-contained component using `three@0.182`. Loaded only via `dynamic(() => import('../three/HeroScene'), { ssr:false })` from Hero. Respect `--accent`. Dispose renderer/geometry on unmount. Cap DPR at 1.5; pause `requestAnimationFrame` when tab hidden / element off-screen (IntersectionObserver).
- [ ] **Step 3:** Confirm Three.js is NOT in the mobile bundle: it is only reachable through the `dynamic(ssr:false)` import gated by `desktop`. Verify with `npm run build` output later (Task 16).
- [ ] **Step 4:** `npx tsc --noEmit` → PASS.
- [ ] **Step 5: Commit** `feat(portfolio): immersive hero with lazy 3D scene + CSS fallback`.

---

## Task 8: About

Port `#about` (mockup HTML 117–158, CSS `#about`…`.about-stats`). Four chapters + portrait slot + **real** stats.

**Files:** Create `app/portfolio/sections/About.tsx`.

- [ ] **Step 1:** Section head eyebrow "01 · About", heading "I build products at the intersection of *code, AI & craft*." Four chapters (real, owner-editable copy):
  - 01 The journey — self-taught developer; freelance WordPress builds → full-stack web + AI products end-to-end.
  - 02 Philosophy — speed and clarity are features; AI is a multiplier on craft, not a replacement.
  - 03 Process — understand, prototype fast, validate, engineer for scale; AI-assisted throughout.
  - 04 Mindset — curious, relentless; shares work openly (content + open source).
  - Portrait: image slot at `/public/portfolio/ashraf.jpg` if present, else the spinning gradient ring placeholder (port `.portrait .ph`). `data-tilt` on desktop.
- [ ] **Step 2: Real stats only, NO review/star counts** (pinned decision, [pricing.test.ts:85](../../../app/data/__tests__/pricing.test.ts)): port `.about-stats` with `6+` "Years building", `10+` "Projects shipped", `19` "Public repos" (real GitHub count — can be passed from the server fetch), `2` "Countries served". Do NOT use "118 Google reviews", "4.9★", or any star/review count anywhere on this page.
- [ ] **Step 3:** `npx tsc --noEmit` → PASS. Commit `feat(portfolio): about section with real stats`.

---

## Task 9: Work + CaseOverlay

Port `#work` (mockup HTML 160–170, app.js `buildWork`/`openCase`, CSS `.work-list`…`.case-close`). Render the GitHub-fed `featured` as large alternating cards and `rest` as a grid. Click → CaseOverlay.

**Files:** Create `app/portfolio/sections/Work.tsx`, `app/portfolio/sections/CaseOverlay.tsx`.

- [ ] **Step 1: Work.tsx** — section head "02 · Selected Work", heading "Things I've *built* & shipped.", sub "Pulled live from GitHub — new projects appear automatically." Featured cards: alternating layout (`.project:nth-child(even)` rtl trick), media panel (generated gradient cover via `--p:{accent}` + `.ph-grid`; if `project.thumbnail`, render `next/image` cover), **status pill** (Live/Active/Archived), `preview-tag` only when `liveUrl`, hover parallax+glow on desktop (port the `mousemove` handler, gate on `desktop`), category, title, summary, tech badges, repo + live links. Replace the mockup's fake `results` row with **real signals**: status • primary language • "Updated {month yyyy}". Click opens CaseOverlay; live/repo link clicks `stopPropagation`.
- [ ] **Step 2:** `rest` projects: tighter responsive grid (1 col mobile, 2–3 desktop) of the same card without the alternating layout. Mobile = single column, generous tap targets (no 2-col phone cramming — the bug being fixed).
- [ ] **Step 3: CaseOverlay.tsx** — port `.case` overlay. Hero band with accent gradient bg + category + title; body = summary + an honest descriptive paragraph (no fabricated metrics/architecture claims); meta column = Category, Status, Stack, and Live/GitHub links. ESC + close button + backdrop close; lock scroll while open; focus-trap the close button. Driven by `project` prop (null = closed).
- [ ] **Step 4:** `npx tsc --noEmit && npm run lint` → PASS. Commit `feat(portfolio): GitHub-fed work grid + case overlay`.

---

## Task 10: Experience timeline

Port `#experience` (mockup HTML 172–187, app.js `buildTimeline`, CSS `#experience`…`.tl-hint`). Sticky horizontal-scroll timeline; on reduced-motion, plain horizontal `overflow-x:auto`.

**Files:** Create `app/portfolio/sections/Experience.tsx`.

- [ ] **Step 1:** Real milestones only (owner-editable), drawn from the existing real timeline + identity:
  - 2018 — "First production code" · Self-taught — freelance WordPress builds while learning JS.
  - 2021 — "Front-end & WordPress developer" · Freelance — marketing sites, e-commerce, local SEO.
  - 2022 — "Digital marketing + brand" · Veloria Vault — site, marketplace listings, content.
  - 2023 — "Full-stack & app builder" · Client projects — PulseKart POS, OrderFlow, Takhti PWA.
  - 2024 → now — "Founder & developer" · Smile Fotilo — solo web + AI-automation studio.
- [ ] **Step 2:** Port the sticky scroll-jack math from `buildTimeline` into a `useEffect` (rAF + scroll), with the `reduced` branch using native horizontal scroll. Progress bar (`.tl-progress i`) tracks position.
- [ ] **Step 3:** `npx tsc --noEmit` → PASS. Commit `feat(portfolio): horizontal experience timeline (reduced-motion safe)`.

---

## Task 11: Skills (+ SkillsScene three / 2D fallback)

Port `#skills` (mockup HTML 189–210, app.js `SKILLS`, scene.js skills constellation, CSS `#skills`…`.skills-cluster-tabs`). 3D draggable constellation on desktop; 2D cluster on mobile/reduced-motion.

**Files:** Create `app/portfolio/sections/Skills.tsx`, `app/portfolio/three/SkillsScene.tsx`.

- [ ] **Step 1: Skills.tsx** — head "04 · Skills", heading "A living *ecosystem* of tools." Cluster tabs: All / Frontend / AI & Automation / Backend·CMS / Growth. **Real** skill data:
  - frontend: React, Next.js, TypeScript, Tailwind, Framer Motion, Three.js
  - ai: AI-assisted dev, Automation, Prompt Eng., Chatbots, OpenRouter/Groq
  - backend: Node.js, PostgreSQL, Supabase, WordPress, WooCommerce, REST APIs
  - growth: SEO, Core Web Vitals, Analytics (GA4/GSC), Content, Conversion
  Render `<SkillsScene>` when `desktop && !reduced`, else a 2D flex/grid cluster of labeled chips (port `.skill-label`).
- [ ] **Step 2: SkillsScene.tsx** — port the constellation from `scene.js` into a self-contained `three` component; `dynamic(ssr:false)`. Drag to rotate; hover/active brings a cluster forward; cluster tab filters which nodes are emphasized. Dispose on unmount; cap DPR; pause off-screen.
- [ ] **Step 3:** `npx tsc --noEmit` → PASS. Commit `feat(portfolio): skills constellation 3D + 2D fallback`.

---

## Task 12: Voices (real testimonials)

Port `#testimonials` (mockup HTML 212–226, app.js `buildTestimonials`, CSS `#testimonials`…`.tdots`). Stacked-card carousel using **real** testimonials.

**Files:** Create `app/portfolio/sections/Voices.tsx`.

- [ ] **Step 1:** Source testimonials from the real set in `app/components/Testimonials.tsx` (do NOT invent). Use the 3 verified Google reviews (Rachit Gupta, JImmy Li, Vivek Chaudhary) + 2–3 client quotes (Veloria Vault, PulseKart, StoryBook). Map to the stacked `.tcard` structure (quote with `<em>` emphasis, avatar initials, name, role). Carousel: prev/next + dots + autoplay (paused on reduced-motion). Optional link to the real `GOOGLE_REVIEWS_URL` with neutral text "Read client reviews on Google →" — **must NOT include any review count or "118 Google reviews" or star count** (pinned decision; keeps [pricing.test.ts](../../../app/data/__tests__/pricing.test.ts) green).
- [ ] **Step 2:** `npx tsc --noEmit` → PASS. Commit `feat(portfolio): voices section with real testimonials + google reviews link`.

---

## Task 13: Contact (terminal form → real email action)

Port `#contact` (mockup HTML 228–271, app.js `initContact`, CSS `#contact`…`.contact-aside`). Terminal-style form wired to the **real** server action.

**Files:** Create `app/portfolio/sections/Contact.tsx`.

- [ ] **Step 1:** Port the terminal UI (bar dots, path, online led, validated fields with `✓`/`✗` states). Replace the fake `setTimeout` "transmit" with the real submit: call the existing server action in `app/actions/email.ts` (inspect its exported signature first; reuse the same payload shape the site's contact form uses). On success show the terminal "message sent" state; on error show an inline error and the WhatsApp fallback. Keep client-side validation as UX sugar; the action validates server-side.
- [ ] **Step 2:** `contact-aside` real links from `SOCIAL`: email, GitHub, WhatsApp (+ LinkedIn/YouTube only if non-empty).
- [ ] **Step 3:** `npx tsc --noEmit && npm run lint` → PASS. Commit `feat(portfolio): terminal contact form wired to real email action`.

---

## Task 14: Footer + delete legacy client file

**Files:** Create `app/portfolio/sections/PortfolioFooter.tsx`; Delete `app/portfolio/PortfolioPageClient.tsx`.

- [ ] **Step 1: PortfolioFooter.tsx** — port `footer` (mockup HTML 275–287): big "Let's *talk*." + meta column (ASHRAF KAMAL · © 2026 · clock). "Let's talk" links to `#contact`/WhatsApp.
- [ ] **Step 2: Delete** the now-unused `app/portfolio/PortfolioPageClient.tsx`. (Test references to it are repointed in Task 15.)
- [ ] **Step 3:** `npx tsc --noEmit` → PASS (no dangling import of the deleted file). Commit `feat(portfolio): footer + remove legacy PortfolioPageClient`.

---

## Task 15: Repoint guard tests + fix /work Curbit contradiction

Two tests `read('app/portfolio/PortfolioPageClient.tsx')` — now deleted. Repoint them to scan the new multi-file portfolio, keeping the same assertions (which the new code already satisfies). Also resolve the Curbit data contradiction on `/work`.

**Files:** Modify `app/data/__tests__/pricing.test.ts`, `app/__tests__/navigation-contract.test.ts`, `app/work/WorkPageClient.tsx`, `app/work/[slug]/ProjectDetailClient.tsx`, `app/work/[slug]/page.tsx`.

- [ ] **Step 1: Add a portfolio-source reader helper** in each test (or shared). It concatenates all `.tsx`/`.ts` under `app/portfolio`:

```ts
import fs from 'fs';
import path from 'path';
function readPortfolioSrc(): string {
  const dir = path.join(process.cwd(), 'app/portfolio');
  const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : walk(p);
    return /\.(tsx?|css)$/.test(e.name) ? [fs.readFileSync(p, 'utf8')] : [];
  });
  return walk(dir).join('\n');
}
```

- [ ] **Step 2: Update pricing.test.ts:85** — replace `const src = read('app/portfolio/PortfolioPageClient.tsx')` with `const src = readPortfolioSrc()`. Keep: `expect(src).not.toContain('118 Google reviews')` and `expect(src).not.toContain('stargazers_count')`.
- [ ] **Step 3: Update navigation-contract.test.ts:63** — remove `'app/portfolio/PortfolioPageClient.tsx'` from the `it.each` array and add a standalone case: `it('portfolio source has no /#contact link', () => expect(readPortfolioSrc()).not.toContain('/#contact'))`. (Ensure no section uses `/#contact`; all contact CTAs use `#contact` in-page or the WhatsApp URL.)
- [ ] **Step 4: Fix Curbit contradiction** — pick the single truth: **"Service Website (Oregon, USA)"** (matches the real US service client). Update `WorkPageClient.tsx` Curbit `category` from `"Smart City Solution"` → `"Service Website"` and description to the service-business wording; update `[slug]/ProjectDetailClient.tsx` Curbit `category`/`fullDescription` and `[slug]/page.tsx` `projectMeta.curbit.description` to match. No "smart city" wording remains.
- [ ] **Step 5: Run the guard tests**

Run: `npx jest app/data/__tests__/pricing.test.ts app/__tests__/navigation-contract.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit** `test(portfolio): repoint guards to new portfolio; fix(work): resolve Curbit contradiction`.

---

## Task 16: Build, lint, full test, local browser verify

- [ ] **Step 1: Full quality gate**

Run: `npm run lint && npx tsc --noEmit && npx jest && npm run build`
Expected: lint clean; no type errors; all tests pass (existing 88 + new ~10); build succeeds.

- [ ] **Step 2: Inspect build output** — confirm `three` is code-split (appears as a separate lazy chunk, not in the `/portfolio` initial JS). If it's in the main chunk, fix the `dynamic(ssr:false)` boundary.
- [ ] **Step 3: Run locally + browse**

Run: `npm run start` (after build) on a chosen port.
Use the `browse` skill (or Playwright MCP) to verify on `http://localhost:<port>/portfolio`:
  - Desktop: hero 3D renders, nav hide/solid + active dots, work cards show real GitHub repos with status pills + repo/live links, case overlay opens/closes (ESC), timeline scrolls, skills constellation drags, voices carousel cycles, contact validates.
  - Mobile viewport (375px): NO 3D (CSS fallback), single-column work grid, tap targets ≥44px, no horizontal overflow, menu overlay works.
  - Reduced-motion emulation: no scroll-jack, content visible, no autoplay.
  - Take before/after screenshots (old vs new) for the PR.
- [ ] **Step 4: Fix any issues found, re-run Step 1.** Commit fixes.
- [ ] **Step 5: Commit** any verification fixes with descriptive messages.

---

## Task 17: Deploy to production (owner-authorized)

Owner said "push to live." Guardrail: confirm once immediately before the irreversible production push.

- [ ] **Step 1: Push the feature branch + open PR** (does not deploy prod)

```bash
git push -u origin feature/portfolio-aurora
```

- [ ] **Step 2: Final confirmation** — surface the verified result + screenshots, and explicitly confirm "push to main now? (this auto-deploys to smilefotilo.com)". Wait for explicit go.
- [ ] **Step 3: Merge to main** (the project's deploy trigger). Respect the auto-guard on direct main pushes — merge via the project's normal flow (PR merge or fast-forward as the repo allows).
- [ ] **Step 4: Watch the Vercel deploy** to completion.
- [ ] **Step 5: Smoke-check live** `https://smilefotilo.com/portfolio` — 200, real repos render, no console errors, mobile + desktop, OG/metadata correct. Verify a new test repo (or existing recent repo) shows up, confirming the ISR feed.
- [ ] **Step 6:** Update memory (`project-restructure-blueprint`) with the portfolio rebuild deploy.

---

## Self-Review

- **Spec coverage:** every spec section maps to a task — data architecture (T2–T4), standalone shell (T6/T5), GitHub-fed work + auto-appear ISR (T3/T4/T9), smart-degraded 3D (T7/T11), real-data-only incl. no-review-counts (T8/T12 + guard T15), all sections (T6–T14), perf/a11y/SEO (T4 metadata/JSON-LD, T16 verify), Curbit reconciliation (T15), tests (T3/T15/T16), deploy (T17). ✔
- **Placeholder scan:** logic layer has full code + tests; UI tasks point to exact mockup source files + give the React-specific code (hooks, dynamic import, ISR). No "TODO/handle edge cases" left. ✔
- **Type consistency:** `GithubRepo`, `Project`, `ProjectStatus`, `toProjects`, `splitFeatured` names are consistent across T3→T4→T5→T9. Props (`featured`/`rest`/`onOpen`/`desktop`/`reduced`) consistent between `PortfolioClient` and section signatures. ✔
