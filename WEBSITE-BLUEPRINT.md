# Smile Fotilo — Website Architecture & Restructuring Blueprint

**Date:** 2026-06-11 · **Status:** APPROVED (owner, 2026-06-11) — implementation in progress on branch `claude/restructure-2026`. Design mandate: 2026-grade premium agency aesthetic (§11). Deploy guardrail: nothing merges to `main` (auto-deploys to production) without explicit owner OK.
**Baseline:** `main` @ `5761d82` + unmerged branch `claude/website-audit-restructure-amwxf7` @ `7c7f672` (June 10 audit fixes).

> Rule for every change below: it has a documented reason. Structure first, redesign second.

---

## 0. Pre-condition: merge yesterday's branch

Branch `claude/website-audit-restructure-amwxf7` (1 commit, unmerged) already fixes:
- Nav anchors `/#services`, `/#work` → real routes (desktop, mobile menu, bottom nav)
- Footer link grouping + order
- OG metadata for /blog, /locations, /services, /tools
- Service schema on ai-growth-os, branding, clinic-growth-autopilot
- Related blog posts by category; `@tailwindcss/typography` plugin
- Security: Razorpay secret key no longer sent to browser; WhatsApp webhook timing-safe token compare; purchase status can't be re-completed
- De-emoji'd Echo greetings; emoji icons → real icons on web-design page

**Action:** merge this branch into `main` first. Every phase below builds on it. (Verified: its removal of the home `sr-only` h1 is safe — Hero renders a real `<h1>`.)

---

## 1. Page inventory & verdicts

### Public pages

| Route | What it is | Verdict | Reason |
|---|---|---|---|
| `/` | Home (Hero, Services, AI OS, Portfolio, Testimonials, GlobalReach, FAQ, Pricing, Contact) | **REBUILD sections** | Generic visual system; trust badge to remove; FAQ contradicts pricing (see §4) |
| `/about` | Solo studio story (86 lines total) | **KEEP, expand** | Thin but honest; becomes E-E-A-T anchor for blog authorship |
| `/services` | Hub with 5 service cards | **KEEP** | Works after branch fixes; needs internal links to locations/work |
| `/services/web-design`, `/seo`, `/branding`, `/clinic-growth-autopilot`, `/ai-growth-os` | Service detail pages | **KEEP** | Solid content + schema; fix CTA labels (§4) |
| `/pricing` | Full pricing page | **KEEP** | Becomes single source of truth for all price mentions (§4) |
| `/work` + `/work/[slug]` (6 case studies) | Client case studies | **KEEP** | Real client proof; add veloria-vault + curbit to sitemap (branch does) |
| `/portfolio` | Ashraf's personal portfolio + live GitHub feed | **REBUILD partially** | Dynamic GitHub feed already exists — remove stars, improve feed (§6) |
| `/blog` + `/blog/[slug]` (53 posts) | Blog | **REBUILD** | Client-bundle data, emoji cards, no category URLs (§5) |
| `/tools` + 6 tool pages | Free AI tools (5 noindexed as thin) | **REBUILD/CULL** | Keep website-audit flagship; rebuild or cut the rest (§7) |
| `/locations` + gonda/ayodhya/greater-noida/lucknow/global | Local SEO pages | **KEEP, re-expose + extend** | Pages exist & are in sitemap — invisible on desktop nav (§3); agency-voice copy conflicts with solo positioning. Old WP site also ran city **subdomains** (`noida.smilefotilo.com`, `lucknow.smilefotilo.com`) still in Google's index with dead DNS — that's the "lost location pages" and lost local leads. Add `/locations/noida` (was the planned redirect target, never built); refactor city pages to a data-driven template so new cities are one data entry. **Owner action (DNS, blocking nothing):** CNAME `noida`, `lucknow`, `freebies`, `shop` subdomains → Vercel, redirect to `/locations/noida`, `/locations/lucknow`, `/tools`, `/` respectively |
| `/privacy`, `/terms` | Legal | **KEEP, improve** | Add cookie-policy + disclaimer; restyle (§9) |
| `/marketplace` + `[slug]` + install | AI agent marketplace (noindexed) | **KEEP noindexed, de-link from home** | B2B/product surface; linking it from home portfolio card sends visitors into an unrelated funnel |
| `/builder`, `/login`, `/portal/*`, `/admin/*` | App shell (noindexed/hidden) | **KEEP as-is** | Working product surfaces; out of marketing-site scope |

### Missing pages (create)

| New route | Reason |
|---|---|
| `/contact` | Every "Contact" link today targets `/#contact` (home scroll anchor). From any other page that's a jump-to-home — broken journey. Dedicated page = stable nav target, local-SEO landing, form + WhatsApp + NAP + map. **Gotcha:** `next.config.ts` currently 301s `/contact` → `/about` (WP-migration redirect) — must remove that redirect or the new page is unreachable |
| `/locations/noida` | Old `noida.smilefotilo.com` subdomain still indexed by Google; planned redirect target was never built. Real local keyword demand per 2026 keyword research |
| `/blog/category/[category]` | 53 posts behind client-side filter = zero crawlable category URLs; categories are the blog's information architecture |
| `/cookie-policy` | Required to pair with the new consent banner (§9) |
| `/disclaimer` | Requested; covers results/earnings claims for an agency site |

### Dead weight (remove)

| Item | Where | Reason |
|---|---|---|
| Green hero capsule badge | `HomePageClient.tsx` Hero | Explicit owner decision: auto-styled review/local badge feels generated. Do NOT replace with another badge |
| `aggregateRating` (4.9/118) in LocalBusiness JSON-LD | `components/JsonLd.tsx` | Google's policy forbids marking up third-party (Google) review counts as your own LocalBusiness rating — penalty risk, and the on-page badge it depended on is going away |
| "4.9 · 118 Google reviews" stat line | `portfolio/PortfolioPageClient.tsx:157` | Same trust-signal family as hero badge |
| GitHub star counts | `portfolio/PortfolioPageClient.tsx:217` + star sort in repo picker | Owner is not an OSS maintainer; stars ≈ 0 read as anti-proof |
| "Includes AI-assisted, human-reviewed content." | `components/Footer.tsx:94` | Creates the impression content is AI-generated; not legally required |
| `GmbUpdates` component + `data/gmb-feed.json` rendering | Location page clients (gonda, ayodhya, greater-noida) | Auto-generated generic local-marketing text ("best digital marketing company near you…") — exactly the content style the owner wants gone |
| `Breadcrumbs.tsx` component | `app/components/` | Imported nowhere — dead code (or wire it up properly in §10; decision: wire into service/location/blog pages, it's an SEO win) |
| "3 studios in Uttar Pradesh" / "Our Network / Strategic Locations" agency voice | portfolio hero stats, locations index | Contradicts the honest founder-led "I'm Ashraf Kamal" positioning used everywhere else |

---

## 2. Information architecture — target sitemap

```
smilefotilo.com
├── /                       Home (decide → route)
├── /services               WHAT I DO (hub)
│   ├── /services/web-design
│   ├── /services/seo
│   ├── /services/branding
│   ├── /services/clinic-growth-autopilot
│   └── /services/ai-growth-os
├── /work                   PROOF (client case studies)
│   └── /work/[slug]        6 case studies
├── /pricing                COST (single source of truth)
├── /portfolio              WHO BUILDS IT (Ashraf + live GitHub feed)
├── /blog                   AUTHORITY
│   ├── /blog/[slug]        53 posts
│   └── /blog/category/[c]  NEW — 7 category hubs
├── /tools                  LEAD MAGNETS
│   └── /tools/website-audit (flagship) + survivors of §7
├── /locations              LOCAL SEO
│   ├── gonda · lucknow · ayodhya · greater-noida
│   └── global              international/US clients
├── /about                  TRUST / E-E-A-T
├── /contact                NEW — conversion endpoint
└── /privacy · /terms · /cookie-policy (NEW) · /disclaimer (NEW)

(noindexed product surfaces, unchanged: /marketplace, /builder, /login, /portal, /admin)
```

**Content hierarchy (visitor logic):** Home → What (services) → Proof (work) → Cost (pricing) → Who (about/portfolio) → Act (contact). Blog/tools/locations feed that spine from search.

### Page relationship map (internal-link contract)

| From | Must link to | Why |
|---|---|---|
| Home sections | matching full pages (services→/services, pricing→/pricing, work→/work, contact→/contact) | Home is a sampler, never a dead end |
| Each service page | /pricing, /contact, 2-3 relevant /work case studies, relevant /blog category | Service → proof → price → act |
| Each case study | the service that produced it + /contact | Proof closes loops |
| Each location page | /services/web-design, /services/seo, /contact, sibling locations | Local SEO interlinking (replaces GmbUpdates blocks) |
| Each blog post | its category hub, related posts (branch did), 1 contextual service link | Blog feeds commercial pages |
| /portfolio | /work, /about, /contact | Personal page funnels back to studio |
| Footer | all top-level + legal | Crawl floor |

---

## 3. Navigation restructure

### Problems found (code-verified)

1. Desktop nav has **no Locations and no Contact** — only mobile menu/footer carry them. This is why location pages "disappeared": they're orphaned from the primary nav, not deleted.
2. **"Work" and "Portfolio" side-by-side** in nav — two portfolio concepts with no visible difference. Visitors can't predict which is which.
3. Contact is an anchor (`/#contact`) everywhere — from any non-home page it warps to home scroll position.
4. Mobile bottom nav duplicates the hamburger menu with a different item set (Home/Locations/Call/Services/Contact) — two competing mobile navs.
5. WhatsApp is the only persistent CTA; no path for visitors who won't use WhatsApp (until /contact exists).

### Target navigation

**Desktop (7 items + CTA):**
`Services · Work · Pricing · Blog · About` + secondary `Tools` `Locations` (in a slim "More" or kept if space allows) + **CTA pair: [Get a Quote → /contact] [WhatsApp]**

**Decision:** "Portfolio" leaves the primary nav. It stays linked from About ("meet the developer"), Footer, and /work ("who builds this"). Reason: one proof-surface in nav (`Work`) kills the Work-vs-Portfolio confusion; the personal page keeps its SEO value without competing for attention.

**Mobile menu (hamburger):** same order as desktop + Locations + Portfolio + Contact. Bottom nav reduces to 4: Home · Services · Call · Contact (drop Locations from bottom bar — it's a discovery page, not a daily destination; keep in hamburger).

**Footer (4 columns):** Services (6 links) · Explore (Work, Portfolio, Blog, Tools, Locations, About) · Service Areas (5 city links — unchanged) · Get in Touch (phone, email, hours, /contact). Legal row: Privacy · Terms · Cookie Policy · Disclaimer.

### Broken journeys to fix

| Journey | Today | Fix |
|---|---|---|
| "Explore Growth Blueprint" button (`AILocalBusinessOS.tsx:128`) | Lands on clinic-autopilot page — label promises a blueprint | Relabel "See Growth Autopilot" (honest label) |
| Home portfolio card "AI Agent Marketplace" → `/marketplace` | Sends prospects into a noindexed B2B install funnel | Replace card with a real case study (e.g. Veloria Vault or Curbit) |
| Hero "See Client Results" → `#work` | OK on home; concept now lives at /work | Point to `/work` |
| Pricing cards "Start with Launch" → `/pricing` | Generic; visitor already saw the price | Point to `/contact?plan=launch` (pre-filled context) once /contact exists |
| Blog CTA "Contact Us" → `/#contact` | Cross-page anchor jump | `/contact` |
| Website-factory result "turn this blueprint into a website" | CTA leads to chat only | Add `/contact` path too |

---

## 4. Content integrity (single biggest trust bug)

**Home FAQ contradicts home Pricing on the same page:** FAQ says "packages start from INR 15,999… Starter (INR 15k), Growth (INR 35k+)"; the Pricing section says ₹25,000 / ₹65,000 / ₹1,25,000+. Echo's fallback says ₹25k/₹65k. A buyer who notices loses all price trust.

**Fix — one source of truth:** create `app/data/pricing.ts` exporting plans, prices, inclusions. Consumers: home Pricing section, /pricing page, home FAQ answers, Echo system prompt + client fallback, service-page price mentions, `serviceSchema offersFrom`. A unit test asserts no orphan ₹-strings outside this module (regression guard — TDD anchor for Phase 2).

**Voice rule:** founder-led singular ("I'm Ashraf Kamal…") everywhere on marketing pages. Rewrite locations index ("Our Network/Strategic Locations" → where I work and what I've shipped there), portfolio stats ("3 studios" → cities served), GlobalReach copy is already correct. No invented claims; keep the verifiable ones (100+ projects only if owner confirms; otherwise drop — flagged for owner).

---

## 5. Blog rebuild

**Found:** all 53 posts (full markdown content) live in 5 TS files imported by `BlogPageClient.tsx` — a **client component**, so every blog visitor downloads every post's full text as JS. Cards are emoji + gradient (no images). Category filter and pagination are client state → no crawlable URLs. All posts authored "Ashraf Kamal" with no author surface.

**Plan:**
1. **Data:** split metadata from content. Listing pages import metadata only; `[slug]` page loads content server-side. (No CMS migration — TS files stay, just restructured. Cheapest fix that kills the bundle problem.)
2. **Routes:** `/blog` becomes a server component (filter/pagination via searchParams or static category hubs); add `/blog/category/[category]` (7 hubs with intro copy + post grid).
3. **Typography:** typography plugin is installed (branch). Apply a tuned `prose` scale on `[slug]`: max-w-prose measure, 1.7 line-height body, distinct h2/h3 rhythm, styled blockquotes/code/tables, TOC for posts >1200 words.
4. **Cards:** replace emoji headers with the existing `/og` image route (per-post generated covers — zero new assets) or real images where they exist; keep read-time + date.
5. **E-E-A-T:** author block links to /about; add `Article` JSON-LD with author → /about, BreadcrumbList.
6. **Content pass (separate, owner-paced):** prune/merge the weakest AI-generic posts rather than restyling all 53; quality gate > volume.

---

## 6. Portfolio — dynamic GitHub system (stars out)

Already dynamic: `portfolio/page.tsx` fetches `api.github.com/users/ak1458/repos` with 1h revalidate; client dedupes by family, requires description. Good bones — keep.

**Changes:**
1. Remove star count from repo cards and the star-based sort (use `pushed_at` recency).
2. Card shows: name (de-slugged), description, language, last-updated ("Updated May 2026"), homepage link when set (live demo > code link).
3. New public repos with a description appear automatically — that's the owner's requirement, and the fetch already guarantees it; the dedupe/junk filter stays so abandoned repos never surface.
4. Resilience: GitHub API failure already falls back to empty (section hides) — keep, add `revalidate` tag note.
5. Remove "4.9 · 118 Google reviews" stat + "3 studios" line (§1); keep "100+ projects" only if owner confirms the number.
6. Personal projects in `PERSONAL_WORK` linking to bare `github.com/ak1458` → link to actual repos (tuition-mandi, youtube-bulk-optimizer exist).

---

## 7. Tools section

**Found:** 6 tools. `website-audit` was rebuilt June 2 with real checks + lead capture and is the only indexed one. The other 5 (seo-content, brand-kit, content-calendar, document-intelligence, website-factory) are noindexed with comment "thin AI tool noindexed pending rebuild/removal" — a decision already half-made.

**Plan:**
- **Keep + promote:** `website-audit` — flagship lead magnet. Feature it on /tools hero, link from home and service pages ("Free audit before you buy").
- **Keep, rebuild to earn re-index:** `website-factory` (blueprint output is genuinely useful pre-sales; tie result to /contact) and `seo-content` (feeds the SEO service funnel). Re-index only after rebuild adds real value (saved/sharable output, no generic filler).
- **Remove:** `content-calendar`, `document-intelligence`, `brand-kit` — generic AI wrappers with no funnel role; they dilute the section and the brand. 301 → /tools.
- **Layout:** /tools becomes flagship-first (audit tool hero with inline domain input), then the 2 supporting tools. Discoverability: nav keeps "Tools", each tool cross-links the matching service.

---

## 8. Echo Assistant rebuild

**Found:** `app/actions/chat.ts` (632 lines) — keyword-matched predefined replies, then OpenRouter free models (`glm-4.5-air:free`, fallback rotation), `[QUICK_REPLIES]` parsing, in-memory rate limiting (resets per serverless instance — weak but acceptable), 59-line knowledge base. First-open greeting makes an AI call (latency + spend for zero info; branch already made greetings static — good). Separate B2B agent (`lib/ai/business-chat.ts`) for WhatsApp/portal is fine — out of scope.

**Plan:**
1. **Prompt architecture:** system prompt assembled from `data/pricing.ts` (§4) + services + FAQ data — never hand-written price strings. Page-context injection (what page the visitor is on) for context awareness.
2. **Conversation flow:** goal = qualify → route. Every thread should end in one of: WhatsApp handoff, /contact form prefill, or a page link. Add explicit lead-capture turn (name + need) before handoff.
3. **Reliability:** keep predefined-reply fast path; add per-message timeout + retry-once; client fallback already exists (keep, source prices from pricing.ts). Surface "couldn't reach AI" honestly instead of fake answer.
4. **UX:** persist conversation in sessionStorage; typing indicator already exists; add "Talk to human" always-visible action.
5. **Quality bar:** response style guide stays (the anti-robotic rules in the prompt are good); add eval set of 15 golden Q→A pairs as Jest tests against the predefined-reply layer (TDD anchor for Phase 6).

---

## 9. Legal + cookie consent

**Found:** /privacy + /terms exist (generic but real, dated Jan 24 2026, styled). No cookie policy, no disclaimer, **no consent banner — GA + GTM + conversion tracking fire unconditionally** (`app/layout.tsx`). EU visitors = GDPR exposure.

**Plan:**
1. **Consent banner** (lightweight, self-built — no third-party CMP): Accept / Reject / preferences; stores choice in `localStorage` + cookie.
2. **Google Consent Mode v2:** `default` state denied for `analytics_storage`/`ad_storage` before GTM loads; `update` on accept. GA/GTM scripts load after consent state set.
3. **New pages:** `/cookie-policy` (lists actual cookies: GA4, GTM, echo_client_id, echo_model, consent cookie) and `/disclaimer` (results vary, third-party trademarks, pricing subject to scope).
4. **Restyle all 4 legal pages** with one shared layout: TOC sidebar, prose typography (plugin from §5), last-updated, contact block. Branding-consistent, no boilerplate fluff.
5. Update /privacy to mention consent mechanism, analytics cookies, Echo chat data, contact-form data (nodemailer → Gmail), and Supabase storage.

---

## 10. SEO audit — findings → actions

| # | Finding | Action | Priority |
|---|---|---|---|
| S1 | `aggregateRating` 4.9/118 in LocalBusiness JSON-LD sourced from Google reviews — against Google review-snippet policy | Remove with badge (§1) | HIGH |
| S2 | 53 posts' full content in client JS bundle | §5 data split — biggest CWV win available | HIGH |
| S3 | No blog category URLs | `/blog/category/[c]` + sitemap | HIGH |
| S4 | No `/contact` page = no contact entity for local SEO; every CTA an anchor | §3 | HIGH |
| S5 | Locations absent from desktop nav → weak crawl + UX signals to city pages | §3 nav; replace removed GmbUpdates blocks with real internal-link sections | HIGH |
| S6 | Home FAQ has no `FAQPage` schema (service pages have it) | Add, sourced from same FAQ data | MED |
| S7 | `Breadcrumbs.tsx` exists but unused; no BreadcrumbList schema anywhere | Wire breadcrumbs + schema on services/work/blog/locations | MED |
| S8 | Sitemap missing `/work/curbit`, `/work/veloria-vault` | Branch adds — merge | DONE@merge |
| S9 | OG images missing on several pages | Branch adds blog/locations/services/tools — merge; sweep remaining (about, contact, legal noindex-ok) | MED |
| S10 | Heavy ambient animation (framer-motion blobs, blur-[128px] layers on every section) hurts LCP/TBT on budget Android — core local audience | Phase 8: reduce to CSS-only ambient, motion-safe variants | MED |
| S11 | `locations/global` US-keyword targeting added June 2 | Keep; link from GlobalReach section (already) + footer | LOW |
| S12 | `seo-daily-growth.yml` / `weekly-seo-audit.yml` workflows — June 1 commit says no-op automations were killed; verify they're disabled or delete | Audit in Phase 8 | LOW |
| S13 | Marketplace/builder/install correctly noindexed | No change | — |
| S14 | One-h1 check across pages after badge/hero edits | Phase 8 regression sweep | LOW |

---

## 11. Design system direction (applies during rebuilds, not before)

**Found:** 4 different page background bases (`#0a0118` home, `#020617` services, `#0a0a0b` portfolio, `slate-950` tools), 2 button systems (`btn-primary` indigo vs green WhatsApp pills vs gradient pills), purple-glow ambience everywhere, emoji icon fallbacks, inconsistent section badges ("Our Expertise" / "Packages" / "Got Questions?" capsule pattern repeated on every section — the generic-template feel the owner dislikes).

**Direction (tokens first, applied per-phase):**
- One background scale: `#05070f` base / `#0b1020` raised / `#11182c` card (exact values set in Phase 8; rule = one base, two elevations).
- Accent: keep indigo family but ONE accent + ONE success (WhatsApp green reserved for WhatsApp actions only).
- Buttons: 2 variants only — solid primary, quiet secondary. No glow shadows on rest state.
- Kill the repeated uppercase-capsule section-label pattern; hierarchy via type scale (display/h2/h3/body/small) not badges.
- Typography: Geist stays; define scale + prose styles once in `globals.css` `@theme`.
- Motion: entrance-only, 1 distance, 1 duration; no infinite background loops.

No mockups in this file — design tokens get their own pass after structure phases land.

---

## 12. Implementation phases (after sign-off)

Order = dependency order. Each phase: failing test/check first where testable (Jest configured), atomic commits, no deploys without explicit owner OK.

| Phase | Scope | Key files |
|---|---|---|
| **0** | Merge `claude/website-audit-restructure-amwxf7` → main | — |
| **1. Trust purge** | Hero badge, aggregateRating, portfolio stats, footer AI-disclosure, GmbUpdates removal + replacement link sections, FAQ↔pricing fix via `data/pricing.ts` | HomePageClient, JsonLd, Footer, PortfolioPageClient, location clients, new data/pricing.ts |
| **2. Navigation + /contact** | New /contact page, nav target structure (§3), journey fixes table, footer 4-col, bottom-nav slim | NavBar, Footer, MobileBottomNav, new contact/ |
| **3. Blog rebuild** | Data split, server listing, category routes, prose typography, OG-image cards, Article schema | data/blogs/*, blog/* |
| **4. Portfolio dynamic** | Stars out, card upgrade, repo links, voice fixes | portfolio/* |
| **5. Tools** | Cull 3, rebuild 2, flagship layout | tools/* |
| **6. Echo** | Prompt assembly from data, flow, golden tests | actions/chat.ts, data/knowledgeBase.ts |
| **7. Legal + consent** | Banner, Consent Mode v2, 2 new pages, restyle 4 | layout.tsx, GoogleAnalytics, new pages |
| **8. SEO + perf sweep** | §10 table remainder, breadcrumbs, FAQPage, animation diet, h1 sweep | global |
| **9. Design tokens** | §11 applied site-wide | globals.css + components |

**Open questions for owner (blocking respective phases only):**
1. "100+ projects delivered" — real number to show, or drop? (Phase 1)
2. Tools cull list (§7) — approve removing content-calendar, document-intelligence, brand-kit? (Phase 5)
3. FestivalProvider seasonal overlay — keep or remove? (auto-theming; not flagged, default = keep) (Phase 9)
4. Pricing source of truth: confirm ₹25k/₹65k/₹1.25L+ and Autopilot ₹12k/mo are current. (Phase 1)

---
*End of blueprint. Implementation starts only after this file is approved.*
