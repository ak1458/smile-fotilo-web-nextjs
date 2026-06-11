# Smile Fotilo — Image Generation Guide (for Gemini / Nano Banana)

**Purpose:** generate every missing blog cover image. The site currently serves
auto-generated `/og` covers because the 53 files below were referenced in code
but never created. Generate each image with the prompt given, save it with the
EXACT filename into `public/blog/`, and the site will use them.

## How to use this file

1. Open Gemini (3.5 / Nano Banana image generation).
2. For each section below, paste the **Prompt** block.
3. Export as WebP (preferred) at **1200x630**. If the tool outputs PNG/JPG,
   convert to WebP before saving (smaller files, better Core Web Vitals).
4. Save into `smile-fotilo/public/blog/` with the exact filename from
   **Save to:** — filenames must match, the code references them literally.

## After generating — one code switch (tell Claude or do manually)

The helper `blogImage()` in `app/data/blogPosts.ts` currently ignores the
`post.image` field and returns an `/og` URL. Once the files exist in
`public/blog/`, change it to prefer the real file:

```ts
export function blogImage(post: Pick<BlogPost, 'title' | 'category' | 'image'>): string {
    if (post.image) return post.image; // real generated cover in /public/blog
    return `/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.category)}`;
}
```

Also remove `unoptimized` from the three `<Image>` usages (listing cards,
post hero, related cards) so Next.js optimizes the static files.

## Shared style rules (already baked into every prompt)

- 1200x630 landscape, dark navy `#05070f` background
- Single accent: indigo `#4f46e5`, small cyan highlights allowed
- Premium flat illustration, soft depth, generous negative space
- **NO text inside the image** — titles get overlaid by the site
- No stock-photo look, no people's faces, no logos/watermarks

---

### startup.webp

- **Save to:** `public/blog/startup.webp`
- **Article:** Startup Website Checklist 2026: 15 Must-Have Features Before Launch
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Startup Website Checklist 2026: 15 Must-Have Features Before Launch. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### business-ideas.webp

- **Save to:** `public/blog/business-ideas.webp`
- **Article:** Samey Online Business Ideas Under ₹50k in India (2026 Edition)
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Samey Online Business Ideas Under ₹50k in India (2026 Edition). Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### budget.webp

- **Save to:** `public/blog/budget.webp`
- **Article:** Digital Marketing Budget: How Much to Spend in 2026?
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Digital Marketing Budget: How Much to Spend in 2026?. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### doctor.webp

- **Save to:** `public/blog/doctor.webp`
- **Article:** Website Guide for Doctors & Clinics in India 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Website Guide for Doctors & Clinics in India 2026. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### hotel.webp

- **Save to:** `public/blog/hotel.webp`
- **Article:** Hotel & Restaurant Website Strategy 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Hotel & Restaurant Website Strategy 2026. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### realestate.webp

- **Save to:** `public/blog/realestate.webp`
- **Article:** Real Estate Website Design: Selling Homes Online
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Real Estate Website Design: Selling Homes Online. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### lawyer.webp

- **Save to:** `public/blog/lawyer.webp`
- **Article:** Digital Presence for Lawyers & Law Firms in India
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Digital Presence for Lawyers & Law Firms in India. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### gym.webp

- **Save to:** `public/blog/gym.webp`
- **Article:** Gym & Fitness Marketing: Filling Up Your Classes
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Gym & Fitness Marketing: Filling Up Your Classes. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### school.webp

- **Save to:** `public/blog/school.webp`
- **Article:** School & College Website Design: Increasing Admissions
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: School & College Website Design: Increasing Admissions. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### ngo.webp

- **Save to:** `public/blog/ngo.webp`
- **Article:** Websites for NGOs: Increasing Donations & Trust
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Websites for NGOs: Increasing Donations & Trust. Scene: a minimal storefront or desk scene with rising chart elements and a glowing lightbulb, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### online-store.webp

- **Save to:** `public/blog/online-store.webp`
- **Article:** Start an Online Store in India 2026: Costs, GST, Platform, Shipping
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Start an Online Store in India 2026: Costs, GST, Platform, Shipping. Scene: a floating shopping cart or product cards with a payment checkmark and price tags, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### logo-cost.webp

- **Save to:** `public/blog/logo-cost.webp`
- **Article:** Logo Design Cost in India 2026: ₹500 vs ₹50,000
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Logo Design Cost in India 2026: ₹500 vs ₹50,000. Scene: floating color swatches, a logo grid sketch, and typography specimens arranged in a designer flat-lay, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### photography.webp

- **Save to:** `public/blog/photography.webp`
- **Article:** DIY Product Photography Guide for Indian Sellers
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: DIY Product Photography Guide for Indian Sellers. Scene: a floating shopping cart or product cards with a payment checkmark and price tags, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### identity.webp

- **Save to:** `public/blog/identity.webp`
- **Article:** Logo vs Brand Identity: What's the Difference?
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Logo vs Brand Identity: What's the Difference?. Scene: floating color swatches, a logo grid sketch, and typography specimens arranged in a designer flat-lay, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### shopify-woo.webp

- **Save to:** `public/blog/shopify-woo.webp`
- **Article:** Shopify vs WooCommerce: The Final Decision for Indian Sellers
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Shopify vs WooCommerce: The Final Decision for Indian Sellers. Scene: a floating shopping cart or product cards with a payment checkmark and price tags, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### copywriting.webp

- **Save to:** `public/blog/copywriting.webp`
- **Article:** How to Write Website Content That Sells (Copywriting 101)
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: How to Write Website Content That Sells (Copywriting 101). Scene: a numbered step path winding through floating checkpoint cards with checkmarks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### bounce-rate.webp

- **Save to:** `public/blog/bounce-rate.webp`
- **Article:** 5 Ways to Reduce Website Bounce Rate
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: 5 Ways to Reduce Website Bounce Rate. Scene: a numbered step path winding through floating checkpoint cards with checkmarks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### cro.webp

- **Save to:** `public/blog/cro.webp`
- **Article:** CRO Guide: Turning Visitors into Customers
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: CRO Guide: Turning Visitors into Customers. Scene: a numbered step path winding through floating checkpoint cards with checkmarks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### payments.webp

- **Save to:** `public/blog/payments.webp`
- **Article:** Razorpay vs PhonePe vs Cashfree (2026): Fees, Failure Rates, Setup
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Razorpay vs PhonePe vs Cashfree (2026): Fees, Failure Rates, Setup. Scene: a floating shopping cart or product cards with a payment checkmark and price tags, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### linkedin.webp

- **Save to:** `public/blog/linkedin.webp`
- **Article:** Personal Branding on LinkedIn: A Founder's Guide
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Personal Branding on LinkedIn: A Founder's Guide. Scene: floating color swatches, a logo grid sketch, and typography specimens arranged in a designer flat-lay, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### seo-cost.webp

- **Save to:** `public/blog/seo-cost.webp`
- **Article:** SEO Cost in India 2026: Real Prices from ₹5,000 to ₹50,000/Month
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: SEO Cost in India 2026: Real Prices from ₹5,000 to ₹50,000/Month. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### geo.webp

- **Save to:** `public/blog/geo.webp`
- **Article:** GEO: Generative Engine Optimization (SEO for AI Search) 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: GEO: Generative Engine Optimization (SEO for AI Search) 2026. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### local-seo.webp

- **Save to:** `public/blog/local-seo.webp`
- **Article:** Local SEO Guide for Indian Small Businesses 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Local SEO Guide for Indian Small Businesses 2026. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### gbp.webp

- **Save to:** `public/blog/gbp.webp`
- **Article:** Google Business Profile Optimization: Complete Guide for Indian SMEs
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Google Business Profile Optimization: Complete Guide for Indian SMEs. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### onpage.webp

- **Save to:** `public/blog/onpage.webp`
- **Article:** On-Page SEO Checklist 2026: 15 Essential Factors
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: On-Page SEO Checklist 2026: 15 Essential Factors. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### keywords.webp

- **Save to:** `public/blog/keywords.webp`
- **Article:** Keyword Research for Indian Market: Tools & Strategy
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Keyword Research for Indian Market: Tools & Strategy. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### link-building.webp

- **Save to:** `public/blog/link-building.webp`
- **Article:** Link Building in 2026: Quality Over Quantity
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Link Building in 2026: Quality Over Quantity. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### audit.webp

- **Save to:** `public/blog/audit.webp`
- **Article:** How to Perform a Technical SEO Audit (Step-by-Step)
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: How to Perform a Technical SEO Audit (Step-by-Step). Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### ads-vs-seo.webp

- **Save to:** `public/blog/ads-vs-seo.webp`
- **Article:** Google Ads vs SEO: Which is Better for Your Business in 2026?
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Google Ads vs SEO: Which is Better for Your Business in 2026?. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### content.webp

- **Save to:** `public/blog/content.webp`
- **Article:** Content Marketing Strategy for Indian Businesses 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Content Marketing Strategy for Indian Businesses 2026. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### seo-audit.webp

- **Save to:** `public/blog/seo-audit.webp`
- **Article:** What To Check When Your Website Is Not Showing On Google After A Redesign
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: What To Check When Your Website Is Not Showing On Google After A Redesign. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### local-seo.webp

- **Save to:** `public/blog/local-seo.webp`
- **Article:** How Google Business Profile Helps Local Service Businesses Get Better Leads
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: How Google Business Profile Helps Local Service Businesses Get Better Leads. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### web-design.webp

- **Save to:** `public/blog/web-design.webp`
- **Article:** Why Small Businesses Need SEO-Ready Websites, Not Just Good-Looking Pages
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Why Small Businesses Need SEO-Ready Websites, Not Just Good-Looking Pages. Scene: a stylized search results page with one result glowing and rising above the others, small upward graph line, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### ai-design.webp

- **Save to:** `public/blog/ai-design.webp`
- **Article:** AI in Web Design: Trends Shaping 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: AI in Web Design: Trends Shaping 2026. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### dev-trends.webp

- **Save to:** `public/blog/dev-trends.webp`
- **Article:** Top 7 Web Development Trends for 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Top 7 Web Development Trends for 2026. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### frameworks.webp

- **Save to:** `public/blog/frameworks.webp`
- **Article:** React vs Vue vs Angular: The 2026 Verdict
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: React vs Vue vs Angular: The 2026 Verdict. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### webflow.webp

- **Save to:** `public/blog/webflow.webp`
- **Article:** WordPress vs Webflow: Which is Best for Designers?
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: WordPress vs Webflow: Which is Best for Designers?. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### headless.webp

- **Save to:** `public/blog/headless.webp`
- **Article:** What is a Headless CMS? (And Why You Need One)
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: What is a Headless CMS? (And Why You Need One). Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### pwa.webp

- **Save to:** `public/blog/pwa.webp`
- **Article:** PWA vs Native App: Do You Really Need an App Store App?
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: PWA vs Native App: Do You Really Need an App Store App?. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### security.webp

- **Save to:** `public/blog/security.webp`
- **Article:** Website Security Checklist 2026: Preventing Hacks
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Website Security Checklist 2026: Preventing Hacks. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### hosting.webp

- **Save to:** `public/blog/hosting.webp`
- **Article:** Vercel vs Netlify vs AWS: Hosting Modern Websites
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Vercel vs Netlify vs AWS: Hosting Modern Websites. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### accessibility.webp

- **Save to:** `public/blog/accessibility.webp`
- **Article:** Web Accessibility (A11y): It's the Law and Good Business
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Web Accessibility (A11y): It's the Law and Good Business. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### vitals.webp

- **Save to:** `public/blog/vitals.webp`
- **Article:** Core Web Vitals 2026: The New Metrics
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Core Web Vitals 2026: The New Metrics. Scene: abstract circuit lines and floating UI panels with code fragments (no readable text), subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### cost.webp

- **Save to:** `public/blog/cost.webp`
- **Article:** Website Development Cost in India 2026: Complete Pricing Guide
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Website Development Cost in India 2026: Complete Pricing Guide. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### lucknow.webp

- **Save to:** `public/blog/lucknow.webp`
- **Article:** Best Web Design Companies in Lucknow 2026: Top 10 Agencies Compared
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Best Web Design Companies in Lucknow 2026: Top 10 Agencies Compared. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### gonda-hero.jpg

- **Save to:** `public/blog/gonda-hero.jpg`
- **Article:** Web Design in Gonda: Your Local Digital Partner
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Web Design in Gonda: Your Local Digital Partner. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### responsive.webp

- **Save to:** `public/blog/responsive.webp`
- **Article:** Why Responsive Web Design is Non-Negotiable in 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Why Responsive Web Design is Non-Negotiable in 2026. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### noida.webp

- **Save to:** `public/blog/noida.webp`
- **Article:** Web Design Services in Greater Noida: Local Expert Guide 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Web Design Services in Greater Noida: Local Expert Guide 2026. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### ayodhya.webp

- **Save to:** `public/blog/ayodhya.webp`
- **Article:** Web Design in Ayodhya: Capturing the Tourism Boom 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Web Design in Ayodhya: Capturing the Tourism Boom 2026. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### speed.webp

- **Save to:** `public/blog/speed.webp`
- **Article:** Website Speed & SEO: Why Every Second Counts in 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Website Speed & SEO: Why Every Second Counts in 2026. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### ecommerce.webp

- **Save to:** `public/blog/ecommerce.webp`
- **Article:** E-commerce Website Cost in India 2026: WooCommerce vs Shopify
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: E-commerce Website Cost in India 2026: WooCommerce vs Shopify. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### nextjs.webp

- **Save to:** `public/blog/nextjs.webp`
- **Article:** Why Next.js Websites are Worth the Investment in 2026
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: Why Next.js Websites are Worth the Investment in 2026. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

### wordpress.webp

- **Save to:** `public/blog/wordpress.webp`
- **Article:** WordPress Website Cost in India 2026: Honest Pricing
- **Prompt:**

> Editorial blog cover illustration, 1200x630 landscape. Theme: WordPress Website Cost in India 2026: Honest Pricing. Scene: a sleek browser window mockup floating in dark space with glowing layout wireframe blocks, subtly referencing the article topic. Style: premium flat illustration with soft depth, very dark navy background (#05070f), indigo (#4f46e5) as the single accent color with small cyan highlights, thin light strokes, generous negative space. ABSOLUTELY NO TEXT, no letters, no words, no logos, no watermarks. Crisp vector-like finish, web-optimized.

---

## Bonus: site imagery (optional, higher impact)

### hero-aurora.webp
- **Save to:** `public/hero-aurora.webp` (then tell Claude to wire it into the home hero)
- **Prompt:**

> Abstract premium website hero background, 2560x1440. A very dark navy field (#05070f) with one soft indigo (#4f46e5) aurora light wash rising from the bottom-left, extremely subtle thin grid lines fading into darkness, faint star-like specks. Minimal, calm, expensive feeling. NO text, no logos, no recognizable objects.

### og-default.webp
- **Save to:** `public/og-default.webp` (fallback social share image)
- **Prompt:**

> Social share card background, 1200x630. Dark navy (#05070f), centered soft indigo glow, very subtle geometric grid, clean and premium. Completely empty center area for text overlay. NO text, no logos.
