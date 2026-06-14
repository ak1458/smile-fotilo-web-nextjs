# Portfolio Rebuild — "AURORA" — Design Spec

**Date:** 2026-06-14
**Branch:** `feature/portfolio-aurora`
**Scope:** Rebuild `/portfolio` only. `/work` (agency client case studies) stays untouched.
**Source of design:** Owner-provided mockup `Ashraf's Interactive Portfolio.zip` (the "AURORA" design system).

## Goal

Transform `/portfolio` into a modern, premium, high-conversion, mobile-first showcase that
reflects Ashraf Kamal's full builder identity (freelancer, full-stack dev, AI-assisted builder,
automation, SEO, e-commerce, content creator, founder of Smile Fotilo) — not a generic agency page.
Projects are pulled **live from GitHub** so new repos appear automatically with no manual edits.

## Decisions (locked with owner)

1. **Rebuild `/portfolio` only.** Keep `/work` as the agency client case-studies surface (SEO-anchored).
2. **Standalone immersive shell.** `/portfolio` uses the AURORA nav + fullscreen menu overlay + footer.
   It does NOT render the site-wide `NavBar`/`Footer`. This is the only page that opts out.
3. **Work section = 100% GitHub-fed, fully dynamic.** No hardcoded client project list on `/portfolio`.
   New public repo on `github.com/ak1458` auto-appears within ~1h via ISR. This deletes the
   duplication between `/portfolio` and `/work`.
4. **Client case studies (PulseKart, Veloria, etc.) stay only on `/work`.** Not shown as cards here.
5. **Premium + smart-degraded motion.** Full Three.js (3D hero + skills constellation) on capable
   desktops, lazy-loaded; automatic lightweight CSS/2D fallback on mobile + `prefers-reduced-motion`.
6. **No invented stats / no invented testimonials** (existing project rule, test-enforced).
   Only real, verifiable data is used. The mockup's placeholder data (Nebula/Atelier, "$2.4M ARR",
   "12M users", `hello@ashrafkamal.dev`) is discarded.
7. **Keep the Voices (testimonials) section** using real testimonials.

## Architecture

### Data flow

```
app/portfolio/page.tsx  (Server Component, ISR revalidate: 3600)
   └─ fetch https://api.github.com/users/ak1458/repos?sort=updated&per_page=100
   └─ transform via lib/portfolio.ts (filter junk, dedupe families, alias, categorize,
       derive status, derive featured, build tech badges)
   └─ pass typed Project[] (featured[], rest[]) to PortfolioClient
```

- **Server-side fetch only** (browser CSP `connect-src` does not allow api.github.com — fine, fetch
  is server-side in the RSC). ISR makes new repos appear within the revalidate window, no deploy.
- Graceful degradation: if the GitHub fetch fails, render a small curated fallback set so the page
  is never empty.

### GitHub → Project derivation (zero manual upkeep)

For each repo, derive:
- **name**: alias map override (e.g. `tuition-mandi` → `Takhti`) else title-cased repo name.
- **category**: first matching repo topic mapped via `TOPIC_CATEGORY` (e.g. `ai`→"AI & Automation",
  `ecommerce`→"E-Commerce", `wordpress`→"WordPress", `game`→"Game", `automation`→"Automation",
  `seo`→"SEO"); else language-based fallback (e.g. "TypeScript · Web App"); else "Open Source".
- **featured**: repo topic `featured` if present; else heuristic = has `homepage` AND has description
  AND recently pushed — top N by that score.
- **status**: `archived` → "Archived"; has `homepage` → "Live"; else "Active".
- **liveUrl**: `homepage` if present.
- **repoUrl**: `html_url`.
- **tech badges**: topics (filtered) + `language`; capped, deduped.
- **thumbnail**: manual override map (`/public/portfolio/<repo>.webp`) if present; else generated
  gradient/code-art cover (CSS, deterministic from repo name/accent). No fake screenshots.

### Config file — `app/data/portfolio.ts`

Thin config (NOT project content). Holds: `GITHUB_USER`, junk-exclude regex, `NAME_ALIASES`,
`TOPIC_CATEGORY` map, `THUMBNAIL_OVERRIDES`, `FEATURED_COUNT`, accent palette, and the small
`FALLBACK_PROJECTS` used only if GitHub is unreachable.

### Logic module — `app/portfolio/lib/portfolio.ts`

Pure functions, unit-tested:
`filterRepos`, `dedupeFamilies` (reuse hardened existing logic), `toProject`, `splitFeatured`.

## Page structure (sections)

Standalone `/portfolio`, dark immersive, top→bottom:

1. **PortfolioNav** + **MenuOverlay** — AURORA fixed nav (hide-on-scroll, solid-on-scroll, active
   section dot) + fullscreen clip-path menu. Real links: GitHub, LinkedIn, YouTube, WhatsApp, email.
2. **Hero** — 3D canvas (desktop, lazy, `ssr:false`) / CSS gradient fallback (mobile/reduced-motion).
   Title: line-mask reveal. Real role line. Tech marquee. CTAs: "View work" + WhatsApp.
3. **About** — 4 chapters (journey/philosophy/process/mindset, drafted from real identity, owner edits).
   Stats: **only real** — 4.9★, 118 Google reviews, 10+ projects, 2 countries. Portrait image slot
   (gradient ring placeholder until owner supplies an image).
4. **Work** — GitHub-fed. Featured projects = large alternating cards (mockup style); rest = grid.
   Each card: category, tech badges, status pill, repo + live links, hover parallax/glow, click→case.
5. **Experience** — horizontal-scroll sticky timeline from real path (2018→2026), no invented employers.
6. **Skills** — constellation: 3D draggable (desktop) / 2D cluster (mobile). Clusters: Frontend,
   AI & Automation, Backend/CMS, Growth/SEO — from real stack.
7. **Voices** — stacked-card testimonials, **real** quotes (3 verified Google reviews + client quotes
   from existing `Testimonials.tsx`). Link to live Google reviews.
8. **Contact** — terminal-style form wired to the **real** `app/actions/email.ts` server action +
   real WhatsApp/email/GitHub. No fake "transmit" simulation.
9. **Footer** — AURORA footer, real links + clock.

**Case study view:** in-page overlay (mockup style) showing real description, tech, status, and
repo/live links. No fabricated metrics. (Client `/work/[slug]` routes are unaffected.)

## File plan

```
app/portfolio/
  page.tsx                      # server: fetch + transform + ISR
  PortfolioClient.tsx           # client root: Lenis(desktop), reveals, accent, section orchestration
  sections/
    PortfolioNav.tsx  MenuOverlay.tsx  Hero.tsx  About.tsx  Work.tsx
    Experience.tsx  Skills.tsx  Voices.tsx  Contact.tsx  PortfolioFooter.tsx  CaseOverlay.tsx
  three/
    HeroScene.tsx   SkillsScene.tsx     # dynamic import, ssr:false, desktop+capable only
  lib/
    portfolio.ts                # transform/dedupe/categorize/status (unit-tested)
    useReveal.ts  useMagnetic.ts  useLenis.ts  useReducedMotion.ts
  portfolio.module.css          # scoped AURORA tokens + styles (faithful port of mockup CSS)
app/data/portfolio.ts           # thin config (aliases, topic map, overrides, fallback)
app/portfolio/__tests__/portfolio.test.ts
```

- **Fonts:** `next/font/google` — Bricolage Grotesque, Instrument Serif, JetBrains Mono,
  Schibsted Grotesk. Self-hosted, no CLS, CSP-safe (no runtime Google Fonts request).
- **Motion:** framer-motion for reveals + magnetic; raw rAF for timeline + constellation.
  Everything gated on `prefers-reduced-motion`.
- **Three.js:** already a dependency (`three@^0.182`). Dynamic-imported, `ssr:false`, desktop +
  non-reduced-motion + GPU-capable only. Never shipped to mobile initial bundle.
- **Lenis:** new dep (~3KB), desktop only, disabled on reduced-motion. (Optional — can fall back to
  native smooth scroll if we choose not to add the dep.)

## Non-goals / untouched

- `/work` and `/work/[slug]` pages, NavBar, Footer, home, services, blog — not redesigned.
- One reconciliation only: the Curbit data contradiction ("Smart City Solution" vs
  "Service Website") is resolved to a single truth in the `/work` data while we're here.
- No URL changes. `/portfolio` stays in sitemap, health check, manifest.

## Quality targets

- **Performance:** mobile = zero Three.js, no Lenis, CSS-only effects; LCP target < 2.0s mobile;
  3D code-split out of initial JS.
- **Accessibility:** visible focus states, full keyboard nav, ESC closes menu/overlay, reduced-motion
  fully honored, semantic headings, aria labels, color-contrast AA.
- **SEO:** server-rendered content; real metadata; `Person` / `ProfilePage` + `ItemList` JSON-LD.
- **Tests:** Jest unit tests for transform/dedupe/categorize/status; existing 88 tests stay green;
  lint clean; build passes.

## Deploy

Build + verify on `feature/portfolio-aurora`. Owner authorized push to live ("push to live").
Final confirmation before the production push (merge/push to `main` → Vercel auto-deploy), then
smoke-check the live `/portfolio`.
