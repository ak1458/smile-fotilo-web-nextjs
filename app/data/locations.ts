// Data-driven service-area location pages. Adding a city = one entry here
// plus a thin page.tsx — the template renders everything else.
// Cities with a physical GBP storefront (Gonda, Greater Noida, Ayodhya) keep
// their custom pages; this system is for service-area cities without offices.

export interface ServiceAreaLocation {
  slug: string;
  name: string;
  region: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroAccent: string;
  intro: string;
  /** Why a business here should care — honest, no fake office claims. */
  positioning: string;
  services: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  /** Slugs of nearby location pages to interlink. */
  nearby: string[];
  accentClass: string;
}

export const SERVICE_AREA_LOCATIONS: ServiceAreaLocation[] = [
  {
    slug: 'noida',
    name: 'Noida',
    region: 'NCR, Uttar Pradesh',
    metaTitle: 'Website Development & SEO in Noida | Smile Fotilo',
    metaDescription:
      'Website development, web design, and SEO for Noida businesses. SEO-ready Next.js and WordPress sites from ₹25,000 — serving Noida from our Greater Noida studio.',
    heroEyebrow: 'Noida · NCR',
    heroTitle: 'Websites & SEO for',
    heroAccent: 'Noida businesses',
    intro:
      'Noida runs on speed — startups in Sector 62, exporters in Phase 2, D2C brands shipping nationwide. I build fast, SEO-ready websites and run local SEO for Noida businesses from our Greater Noida studio, fifteen minutes down the expressway.',
    positioning:
      'You get founder-direct work: one person who designs, builds, deploys, and answers your WhatsApp — not an account manager relaying notes to a dev team. On-site meetings across Noida and Greater Noida are easy; everything else moves faster online.',
    services: [
      {
        title: 'Business Website Development',
        description:
          'Custom Next.js or WordPress sites for Noida startups, agencies, and manufacturers — fast, mobile-first, and built to rank from day one.',
      },
      {
        title: 'E-commerce & D2C Stores',
        description:
          'WooCommerce and custom storefronts with payments, shipping, and marketplace integration for brands selling across India.',
      },
      {
        title: 'Local SEO for Noida',
        description:
          'Google Business Profile optimization, sector-level landing pages, and review workflows so customers searching in Noida find you first.',
      },
      {
        title: 'AI Automation',
        description:
          'Missed-call recovery, WhatsApp follow-ups, and review responses on autopilot — built for clinics, salons, and service businesses.',
      },
    ],
    faqs: [
      {
        question: 'Do you have an office in Noida?',
        answer:
          'Our nearest studio is in Greater Noida (Alpha 1), and I regularly take on-site meetings across Noida and the NCR. Most of the work — design reviews, progress updates, support — happens over WhatsApp and video calls, which keeps projects fast.',
      },
      {
        question: 'How much does a website cost for a Noida business?',
        answer:
          'Launch websites start at ₹25,000 (5 pages, SEO setup, lead form). E-commerce and conversion-focused builds are ₹65,000+. Full breakdown is on the pricing page — no hidden retainers.',
      },
      {
        question: 'Can you rank my business in Noida search results?',
        answer:
          'Yes — local SEO is the core of what I do. That means your Google Business Profile, location-specific pages, reviews, and citations working together. Realistic local rankings take 2–4 months of consistent work, and I show progress in plain-language monthly reports.',
      },
      {
        question: 'Do you work with both startups and larger companies?',
        answer:
          'Most Noida clients are startups and small businesses that need to look credible and convert. For larger scopes — custom dashboards, integrations, multi-location SEO — the Premium tier covers architecture and a growth roadmap.',
      },
    ],
    nearby: ['greater-noida', 'lucknow', 'gonda'],
    accentClass: 'text-cyan-400',
  },
];

export function getServiceAreaLocation(slug: string): ServiceAreaLocation | undefined {
  return SERVICE_AREA_LOCATIONS.find((l) => l.slug === slug);
}
