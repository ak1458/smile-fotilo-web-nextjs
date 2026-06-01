export type McpSection = {
  id: string;
  label: string;
  role: 'hero' | 'nav' | 'content' | 'cta' | 'social-proof' | 'form' | 'footer' | 'tools' | 'catalog';
  summary: string;
  selectors: string[];
  primaryActions: string[];
};

export type McpLink = {
  to: string;
  relation: 'primary-nav' | 'cta' | 'content-link' | 'workflow-next';
  reason: string;
};

export type McpRoute = {
  path: string;
  title: string;
  purpose: string;
  layoutFlow: string[];
  seoIntents: string[];
  schemaHints: string[];
  sections: McpSection[];
  links: McpLink[];
};

export const WEB_MCP_VERSION = '1.0.0';

export const WEB_MCP_ROUTES: McpRoute[] = [
  {
    path: '/',
    title: 'Home',
    purpose: 'Primary lead capture and service positioning.',
    layoutFlow: ['navbar', 'hero', 'services', 'pricing', 'proof', 'faq', 'contact', 'footer'],
    seoIntents: ['web design agency india', 'seo services', 'branding services', 'clinic growth autopilot'],
    schemaHints: ['Organization', 'WebSite', 'Service', 'FAQPage'],
    sections: [
      {
        id: 'home-nav',
        label: 'Top Navigation',
        role: 'nav',
        summary: 'Global navigation with primary pages and start-project CTA.',
        selectors: ['nav', 'header nav'],
        primaryActions: ['navigate to services', 'navigate to tools', 'start project'],
      },
      {
        id: 'home-hero',
        label: 'Hero Section',
        role: 'hero',
        summary: 'Primary brand value proposition and two conversion CTAs.',
        selectors: ['#home', 'h1'],
        primaryActions: ['view work', 'book strategy call'],
      },
      {
        id: 'home-services',
        label: 'Service Highlights',
        role: 'content',
        summary: 'High-level service cards: web, growth, creative.',
        selectors: ['#services'],
        primaryActions: ['open service detail pages'],
      },
      {
        id: 'home-pricing',
        label: 'Pricing Preview',
        role: 'cta',
        summary: 'Launch (Rs 25k) / Growth (Rs 65k) / Premium / Autopilot pricing to qualify leads.',
        selectors: ['#pricing'],
        primaryActions: ['open pricing page', 'open contact flow'],
      },
    ],
    links: [
      { to: '/services', relation: 'primary-nav', reason: 'Main service exploration path.' },
      { to: '/pricing', relation: 'cta', reason: 'Commercial qualification path.' },
      { to: '/tools', relation: 'content-link', reason: 'Free tool discovery path.' },
      { to: '/blog', relation: 'content-link', reason: 'SEO content and topical authority.' },
    ],
  },
  {
    path: '/services',
    title: 'Services Hub',
    purpose: 'Service catalog with vertical/solution-level entry points.',
    layoutFlow: ['navbar', 'hero', 'service-grid', 'cta', 'footer'],
    seoIntents: ['web development services india', 'seo agency', 'brand identity design'],
    schemaHints: ['Service', 'ItemList'],
    sections: [
      {
        id: 'services-grid',
        label: 'Service Grid',
        role: 'catalog',
        summary: 'Cards for web-design, seo, branding, and growth-autopilot.',
        selectors: ['section', 'a[href^=\"/services/\"]'],
        primaryActions: ['open sub-service page'],
      },
    ],
    links: [
      { to: '/services/web-design', relation: 'workflow-next', reason: 'Web development conversion path.' },
      { to: '/services/seo', relation: 'workflow-next', reason: 'SEO/GEO conversion path.' },
      { to: '/services/branding', relation: 'workflow-next', reason: 'Branding conversion path.' },
      { to: '/services/clinic-growth-autopilot', relation: 'workflow-next', reason: 'Autopilot conversion path.' },
    ],
  },
  {
    path: '/services/web-design',
    title: 'Web Design Service',
    purpose: 'Offer-page for website design and development conversion.',
    layoutFlow: ['navbar', 'hero', 'offers', 'process', 'faq', 'cta', 'footer'],
    seoIntents: ['web design company india', 'website development pricing', 'nextjs website agency'],
    schemaHints: ['Service', 'FAQPage'],
    sections: [
      {
        id: 'web-design-hero',
        label: 'Service Hero',
        role: 'hero',
        summary: 'Service value proposition, pricing cue, and primary CTA.',
        selectors: ['h1', 'main section'],
        primaryActions: ['get free quote', 'view portfolio'],
      },
      {
        id: 'web-design-deliverables',
        label: 'What We Build',
        role: 'content',
        summary: 'Deliverables and capability blocks for web design scope.',
        selectors: ['h2', 'section'],
        primaryActions: ['compare scope', 'open contact flow'],
      },
    ],
    links: [
      { to: '/portfolio', relation: 'content-link', reason: 'Proof path from service pitch.' },
      { to: '/pricing', relation: 'cta', reason: 'Commercial qualification.' },
    ],
  },
  {
    path: '/services/seo',
    title: 'SEO Service',
    purpose: 'Offer-page for search growth and geo/seo execution.',
    layoutFlow: ['navbar', 'hero', 'strategy', 'proof', 'cta', 'footer'],
    seoIntents: ['seo agency india', 'local seo services', 'geo optimization'],
    schemaHints: ['Service', 'FAQPage'],
    sections: [
      {
        id: 'seo-hero',
        label: 'SEO Hero',
        role: 'hero',
        summary: 'Positioning for ranking and local business visibility.',
        selectors: ['h1', 'main section'],
        primaryActions: ['book strategy call', 'start seo plan'],
      },
      {
        id: 'seo-process',
        label: 'SEO Process',
        role: 'content',
        summary: 'Checklist or framework blocks defining SEO workflow.',
        selectors: ['h2', 'section'],
        primaryActions: ['review process', 'submit lead'],
      },
    ],
    links: [
      { to: '/tools/website-audit', relation: 'workflow-next', reason: 'Self-serve audit before managed SEO.' },
      { to: '/blog', relation: 'content-link', reason: 'SEO educational content.' },
    ],
  },
  {
    path: '/services/branding',
    title: 'Branding Service',
    purpose: 'Offer-page for identity, voice, and creative positioning.',
    layoutFlow: ['navbar', 'hero', 'capabilities', 'examples', 'cta', 'footer'],
    seoIntents: ['branding agency india', 'logo and identity design', 'brand strategy service'],
    schemaHints: ['Service'],
    sections: [
      {
        id: 'branding-hero',
        label: 'Branding Hero',
        role: 'hero',
        summary: 'Core promise for brand design outcomes.',
        selectors: ['h1', 'main section'],
        primaryActions: ['book branding consult', 'start project'],
      },
      {
        id: 'branding-scope',
        label: 'Branding Scope',
        role: 'content',
        summary: 'Scope cards for naming, visual system, and messaging.',
        selectors: ['h2', 'section'],
        primaryActions: ['compare packages', 'request custom scope'],
      },
    ],
    links: [
      { to: '/tools/brand-kit', relation: 'workflow-next', reason: 'AI draft-to-service upgrade flow.' },
      { to: '/portfolio', relation: 'content-link', reason: 'Brand execution examples.' },
    ],
  },
  {
    path: '/services/ai-growth-os',
    title: 'AI Growth OS Service',
    purpose: 'Offer-page for monthly AI-led growth operations.',
    layoutFlow: ['navbar', 'hero', 'modules', 'plan', 'cta', 'footer'],
    seoIntents: ['ai growth operations', 'business automation agency', 'ai growth os'],
    schemaHints: ['Service', 'Product'],
    sections: [
      {
        id: 'ai-growth-hero',
        label: 'AI Growth Hero',
        role: 'hero',
        summary: 'Explains operating model and expected outcomes.',
        selectors: ['h1', 'main section'],
        primaryActions: ['book demo', 'view pricing'],
      },
      {
        id: 'ai-growth-modules',
        label: 'Module Grid',
        role: 'content',
        summary: 'Highlights WhatsApp, calls, content, and analytics modules.',
        selectors: ['h2', 'section'],
        primaryActions: ['review modules', 'select implementation path'],
      },
    ],
    links: [
      { to: '/pricing', relation: 'cta', reason: 'Plan selection path.' },
      { to: '/services/clinic-growth-autopilot', relation: 'workflow-next', reason: 'Clinic-specific offer variant.' },
    ],
  },
  {
    path: '/services/clinic-growth-autopilot',
    title: 'Clinic Growth Autopilot Service',
    purpose: 'Offer-page focused on clinic lead handling and appointment growth.',
    layoutFlow: ['navbar', 'hero', 'problem-solution', 'results', 'cta', 'footer'],
    seoIntents: ['clinic marketing automation', 'doctor lead management', 'clinic growth autopilot'],
    schemaHints: ['Service', 'FAQPage'],
    sections: [
      {
        id: 'clinic-autopilot-hero',
        label: 'Clinic Hero',
        role: 'hero',
        summary: 'Clinic-focused positioning with treatment discovery to booking flow.',
        selectors: ['h1', 'main section'],
        primaryActions: ['book strategy call', 'get clinic plan'],
      },
      {
        id: 'clinic-autopilot-stack',
        label: 'Automation Stack',
        role: 'content',
        summary: 'Explains chatbot, calls, reminders, and lead pipeline workflow.',
        selectors: ['h2', 'section'],
        primaryActions: ['review stack', 'request onboarding'],
      },
    ],
    links: [
      { to: '/pricing', relation: 'cta', reason: 'Pricing decision stage.' },
      { to: '/tools', relation: 'content-link', reason: 'Free tools for pre-qualification.' },
    ],
  },
  {
    path: '/portfolio',
    title: 'Portfolio',
    purpose: 'Case-study and execution proof for agency services.',
    layoutFlow: ['navbar', 'hero', 'work-grid', 'project-detail-links', 'footer'],
    seoIntents: ['web design portfolio india', 'agency case studies', 'website projects'],
    schemaHints: ['CollectionPage', 'CreativeWork', 'ItemList'],
    sections: [
      {
        id: 'portfolio-grid',
        label: 'Portfolio Grid',
        role: 'content',
        summary: 'Cards and previews for selected website and branding projects.',
        selectors: ['section', 'a[href^=\"/work/\"]'],
        primaryActions: ['open case study', 'start similar project'],
      },
    ],
    links: [
      { to: '/work', relation: 'content-link', reason: 'Full work archive path.' },
      { to: '/#contact', relation: 'cta', reason: 'Convert interested visitors.' },
    ],
  },
  {
    path: '/pricing',
    title: 'Pricing',
    purpose: 'Plan comparison and offer framing for decision-stage users.',
    layoutFlow: ['navbar', 'hero', 'plan-cards', 'footer'],
    seoIntents: ['web design pricing india', 'agency pricing', 'clinic automation pricing'],
    schemaHints: ['Product', 'Offer'],
    sections: [
      {
        id: 'pricing-cards',
        label: 'Plan Cards',
        role: 'catalog',
        summary: 'Launch, Growth, Premium, and Growth Autopilot offers.',
        selectors: ['h1', 'h2', 'a[href]'],
        primaryActions: ['select plan', 'navigate to service details'],
      },
    ],
    links: [
      { to: '/services/clinic-growth-autopilot', relation: 'workflow-next', reason: 'Autopilot deep-dive path.' },
      { to: '/#contact', relation: 'cta', reason: 'Lead capture action.' },
    ],
  },
  {
    path: '/tools',
    title: 'Tools Hub',
    purpose: 'Free AI tools entry page for traffic capture and lead magnet flow.',
    layoutFlow: ['navbar', 'hero', 'tool-grid', 'footer'],
    seoIntents: ['free ai tools for seo', 'website audit tool', 'content generator'],
    schemaHints: ['SoftwareApplication', 'ItemList'],
    sections: [
      {
        id: 'tools-grid',
        label: 'Tool Grid',
        role: 'tools',
        summary: 'Cards for website audit, seo content, brand kit, and content calendar.',
        selectors: ['a[href^=\"/tools/\"]'],
        primaryActions: ['open tool page'],
      },
    ],
    links: [
      { to: '/tools/website-audit', relation: 'workflow-next', reason: 'Technical audit workflow start.' },
      { to: '/tools/seo-content', relation: 'workflow-next', reason: 'SEO content generation flow.' },
      { to: '/tools/brand-kit', relation: 'workflow-next', reason: 'Brand design support flow.' },
      { to: '/tools/content-calendar', relation: 'workflow-next', reason: 'Social planning flow.' },
    ],
  },
  {
    path: '/tools/website-audit',
    title: 'Website Audit Tool',
    purpose: 'Generate instant quality/SEO/security grade for a URL.',
    layoutFlow: ['navbar', 'hero', 'input-form', 'results', 'footer'],
    seoIntents: ['website audit free', 'seo grade checker'],
    schemaHints: ['SoftwareApplication'],
    sections: [
      {
        id: 'audit-form',
        label: 'Audit Input',
        role: 'form',
        summary: 'URL input and run action.',
        selectors: ['input[type=\"url\"]', 'button[type=\"submit\"]'],
        primaryActions: ['run audit'],
      },
    ],
    links: [{ to: '/#contact', relation: 'cta', reason: 'Escalate from self-serve to managed service.' }],
  },
  {
    path: '/tools/seo-content',
    title: 'SEO Content Engine',
    purpose: 'Generate titles, metas, outline, and keyword targets.',
    layoutFlow: ['navbar', 'hero', 'input-form', 'results', 'footer'],
    seoIntents: ['seo content generator', 'meta description generator'],
    schemaHints: ['SoftwareApplication'],
    sections: [
      {
        id: 'seo-form',
        label: 'SEO Generator Form',
        role: 'form',
        summary: 'Business + industry fields for content planning output.',
        selectors: ['form', 'input', 'textarea'],
        primaryActions: ['generate seo content'],
      },
    ],
    links: [{ to: '/blog', relation: 'content-link', reason: 'Publish generated strategy into content engine.' }],
  },
  {
    path: '/tools/brand-kit',
    title: 'Brand Kit Generator',
    purpose: 'Generate color/voice/tagline and identity guidance.',
    layoutFlow: ['navbar', 'hero', 'input-form', 'results', 'footer'],
    seoIntents: ['brand kit generator', 'brand strategy ai'],
    schemaHints: ['SoftwareApplication'],
    sections: [
      {
        id: 'brand-form',
        label: 'Brand Inputs',
        role: 'form',
        summary: 'Business profile fields for AI-generated brand system.',
        selectors: ['form', 'input', 'textarea'],
        primaryActions: ['generate brand kit'],
      },
    ],
    links: [{ to: '/services/branding', relation: 'workflow-next', reason: 'Move from AI draft to expert execution.' }],
  },
  {
    path: '/tools/content-calendar',
    title: 'Content Calendar',
    purpose: 'Generate weekly social plan with captions and hooks.',
    layoutFlow: ['navbar', 'hero', 'input-form', 'results', 'footer'],
    seoIntents: ['content calendar generator', 'social media plan ai'],
    schemaHints: ['SoftwareApplication'],
    sections: [
      {
        id: 'calendar-form',
        label: 'Calendar Inputs',
        role: 'form',
        summary: 'Business and platform context fields for weekly plan.',
        selectors: ['form', 'input', 'textarea', 'select'],
        primaryActions: ['generate content calendar'],
      },
    ],
    links: [{ to: '/services/ai-growth-os', relation: 'workflow-next', reason: 'Upgrade to done-for-you operations.' }],
  },
  {
    path: '/marketplace',
    title: 'AI Agent Marketplace',
    purpose: 'Template catalog for installable local-business AI agents.',
    layoutFlow: ['navbar', 'hero', 'category-filter', 'search', 'templates', 'footer'],
    seoIntents: ['ai agent templates', 'clinic ai template', 'local business automation'],
    schemaHints: ['CollectionPage', 'ItemList', 'SoftwareApplication'],
    sections: [
      {
        id: 'marketplace-filters',
        label: 'Category and Search',
        role: 'catalog',
        summary: 'Category list and keyword search for template discovery.',
        selectors: ['aside', 'form[action=\"/marketplace\"]'],
        primaryActions: ['filter category', 'search template'],
      },
      {
        id: 'marketplace-results',
        label: 'Template Results',
        role: 'content',
        summary: 'Template cards or empty-state message.',
        selectors: ['main', 'a[href^=\"/marketplace/\"]'],
        primaryActions: ['open template detail'],
      },
    ],
    links: [{ to: '/portal/agents', relation: 'workflow-next', reason: 'Manage installed agents from portal.' }],
  },
  {
    path: '/blog',
    title: 'Blog',
    purpose: 'SEO topical authority and discovery content.',
    layoutFlow: ['navbar', 'hero', 'category-tabs', 'article-grid', 'footer'],
    seoIntents: ['web design insights', 'seo strategy 2026', 'branding playbook'],
    schemaHints: ['Blog', 'Article', 'ItemList'],
    sections: [
      {
        id: 'blog-list',
        label: 'Article Feed',
        role: 'content',
        summary: 'Featured and latest articles organized by category.',
        selectors: ['article', 'a[href^=\"/blog/\"]'],
        primaryActions: ['open article'],
      },
    ],
    links: [{ to: '/tools', relation: 'content-link', reason: 'Blog-to-tool conversion path.' }],
  },
  {
    path: '/about',
    title: 'About',
    purpose: 'Trust, team narrative, and agency credibility.',
    layoutFlow: ['navbar', 'hero', 'story', 'values', 'footer'],
    seoIntents: ['about smile fotilo', 'creative agency india'],
    schemaHints: ['AboutPage', 'Organization'],
    sections: [
      {
        id: 'about-story',
        label: 'Agency Story',
        role: 'content',
        summary: 'Positioning, philosophy, and experience summary.',
        selectors: ['h1', 'section'],
        primaryActions: ['navigate to contact or services'],
      },
    ],
    links: [{ to: '/#contact', relation: 'cta', reason: 'Primary conversion endpoint from trust page.' }],
  },
];

export function getMcpRoute(path: string): McpRoute | null {
  const normalized = normalizeMcpPath(path);
  return WEB_MCP_ROUTES.find((route) => route.path === normalized) ?? null;
}

export function normalizeMcpPath(path: string): string {
  const value = (path || '/').trim();
  if (!value || value === '/') return '/';
  if (!value.startsWith('/')) return `/${value}`.replace(/\/+/g, '/');
  return value.replace(/\/+/g, '/');
}
