# Portfolio project-cover image prompts

Generate one image per project, drop it at the matching path, and it appears
automatically on `/portfolio` (missing files fall back to the gradient cover).

- **Aspect / size:** 16:11 landscape, ~**1280×880** (or 1600×1100). Export **.webp** (or .png/.jpg).
- **Folder:** `smile-fotilo/public/portfolio/covers/`
- Filenames are listed per project below — they must match exactly.

---

## Shared style preamble (paste before every project prompt)

> Premium dark UI hero cover, 16:11 cinematic landscape. Near-black charcoal
> background (#0B0B0E to #050505) with a subtle radial accent glow and faint film
> grain. High-end SaaS marketing render: glassmorphism panels, soft depth-of-field,
> volumetric rim light, crisp reflections, floating 3D UI cards with gentle drop
> shadows. Editorial, expensive, restrained. Octane/Redshift quality, 8k, sharp.
> **No readable text, no real words, no logos, no watermarks, no UI labels** — only
> abstract shapes, charts, and device silhouettes (AI garbles text). Negative:
> text, letters, typography, logo, watermark, clutter, low-res, cartoon, stock-photo people.

---

## Per-project prompts

### 1. KapdaFactory — `covers/kapdafactory.webp`
B2B fashion & textile marketplace + inventory ERP.
> [preamble] Subject: a floating glass dashboard for a textile B2B marketplace —
> abstract inventory grid tiles, stacked fabric-swatch cards in warm neutrals, a
> subtle supply-chain flow line. Dominant accent: warm **amber/orange** glow.
> Hints of woven-fabric texture in the bokeh.

### 2. Veloria Vault — `covers/veloriavault.webp`
Luxury leather headless e-commerce.
> [preamble] Subject: a single premium leather handbag on a minimalist pedestal in
> dramatic editorial studio light, glossy product render, deep shadows, a faint
> floating glass product-card behind it. Dominant accent: **rose-gold / warm amber**.
> Luxury fashion campaign mood.

### 3. PulseKart — `covers/pulsekart.webp`
Full-stack retail e-commerce / POS.
> [preamble] Subject: a clean floating point-of-sale + checkout dashboard, abstract
> product tiles and a billing summary card, a stylized barcode strip (no readable
> digits). Dominant accent: **teal/emerald** glow. Modern retail-tech feel.

### 4. Takhti — `covers/takhti.webp`
Offline-first tuition PWA with AI progress reports.
> [preamble] Subject: a sleek smartphone mockup floating at an angle showing an
> abstract class-roster list and a rising progress chart, a small AI spark icon,
> soft education motifs (abstract graduation/notebook shapes) in bokeh. Dominant
> accent: **electric blue**. Friendly, modern edtech.

### 5. Carfax for Boats — `covers/carfax-boats.webp`
AI-vision transferable marine maintenance records.
> [preamble] Subject: a smartphone scanning a boat engine plate, glowing AI
> computer-vision scan overlay (corner brackets, scan line), a faint boat hull
> silhouette on water in the background. Dominant accent: **marine cyan/blue**.
> Crisp, techy, trustworthy.

### 6. Attest Health — `covers/attest-health.webp`
Offline clinical symptom-tracking suite.
> [preamble] Subject: a calm health dashboard floating — abstract symptom timeline,
> a soft body/anatomy outline, gentle line chart, a shield for privacy. Dominant
> accent: **calm teal/green**. Clinical, reassuring, clean.

### 7. Sovereign Vault — `covers/sovereign-vault.webp`
Local-first, zero-knowledge privacy vault (Web Crypto).
> [preamble] Subject: a glowing encrypted vault — abstract padlock + shield made of
> light, floating cryptographic key shards, particle field, lock-grid pattern.
> Dominant accent: **cyber violet/purple**. Secure, premium, slightly futuristic.

### 8. AI SEO Agent — `covers/ai-seo-agent.webp`
Autonomous local-LLM SEO agent (Ollama + Python).
> [preamble] Subject: an autonomous AI agent visualized as a glowing node-graph
> crawling abstract search-result cards and a rising rank arrow, faint terminal
> window with no readable text. Dominant accent: **emerald green**. Automation,
> intelligence, momentum.

### 9. Creator Agent Toolbox — `covers/creator-toolbox.webp`
AI content toolbox: script gen + A/B testing + YouTube analysis.
> [preamble] Subject: floating glass panels — an abstract script/storyboard card, an
> A/B split test chart, and blank video-thumbnail tiles, connected by AI spark
> lines. Dominant accent: **cyan**. Creator-tech, energetic.

### 10. YouTube Bulk Optimizer — `covers/youtube-optimizer.webp`
Bulk playlist + SEO metadata automation (Flask).
> [preamble] Subject: a dashboard managing many blank video tiles at once, a bulk
> multi-select / batch-edit UI, an optimization progress bar and metadata sliders.
> Dominant accent: **red-to-orange**. Automation at scale, clean.

### 11. Smile Fotilo — `covers/smile-fotilo.webp`
Premium digital-agency platform with AI chatbot.
> [preamble] Subject: a sleek agency landing page shown on a floating laptop at an
> angle, a small glowing AI chat bubble beside it, modern gradient hero. Dominant
> accent: **electric blue**. Polished, premium, agency.

### 12. Liar Loop — `covers/liar-loop.webp`
Interactive logic-puzzle game.
> [preamble] Subject: an abstract logic-puzzle board — interlocking true/false nodes,
> glowing connection paths, a knight-and-knave style geometric motif, playful depth.
> Dominant accent: **violet**. Smart, game-like, minimal.

### 13. Trivia & Jokes — `covers/trivia-jokes.webp`
Lightweight entertainment / trivia app.
> [preamble] Subject: playful floating quiz cards and a lightbulb/question-mark
> shape made of light (no letters), confetti bokeh. Dominant accent: **bright blue/
> magenta**. Fun, light, energetic.

---

## After you generate them

1. Save each as the exact filename above into `smile-fotilo/public/portfolio/covers/`.
2. That's it — they appear on the next page load (ISR). No code change needed; the
   `THUMBNAIL_OVERRIDES` map in `app/data/portfolio.ts` already points to these paths.
3. The Veloria cover is shared by all three Veloria repos (whichever is newest wins).
