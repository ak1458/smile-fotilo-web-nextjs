// Single source of truth for every price shown or spoken anywhere on the site:
// home pricing section, /pricing page, home FAQ, Echo assistant (prompt +
// fallbacks), and service schema offers. Guarded by app/data/__tests__/pricing.test.ts.

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  priceNumeric: number;
  suffix: string;
  description: string;
  points: string[];
  ctaLabel: string;
  href?: string;
  prompt?: string;
  featured: boolean;
}

export interface PricingMode {
  label: string;
  subtitle: string;
  plans: PricingPlan[];
}

export const PRICING: { project: PricingMode; autopilot: PricingMode } = {
  project: {
    label: 'Project Delivery',
    subtitle: 'Fixed-scope websites. Transparent pricing, no surprises.',
    plans: [
      {
        id: 'launch',
        title: 'Launch',
        price: '₹25,000',
        priceNumeric: 25000,
        suffix: '/ project',
        description: 'For local businesses and clinics getting online the right way.',
        points: [
          '5-page responsive website',
          'On-page SEO setup',
          'Lead form + WhatsApp CTA',
          'Google Business Profile optimization',
        ],
        ctaLabel: 'Start with Launch',
        href: '/contact?plan=launch',
        featured: false,
      },
      {
        id: 'growth',
        title: 'Growth',
        price: '₹65,000',
        priceNumeric: 65000,
        suffix: '/ project',
        description: 'For businesses and small e-commerce that need to convert and scale.',
        points: [
          'Dynamic pages or online store',
          'Conversion-focused UX',
          'Performance + analytics',
          '3 months support',
        ],
        ctaLabel: 'Choose Growth',
        href: '/contact?plan=growth',
        featured: true,
      },
      {
        id: 'premium',
        title: 'Premium',
        price: '₹1,25,000+',
        priceNumeric: 125000,
        suffix: '/ project',
        description: 'For custom builds with integrations, dashboards, and advanced SEO.',
        points: [
          'Custom architecture',
          'Payments / CRM / AI integrations',
          'Advanced SEO + roadmap',
        ],
        ctaLabel: 'Discuss Premium',
        prompt: 'I need custom/premium project pricing and delivery scope.',
        featured: false,
      },
    ],
  },
  autopilot: {
    label: 'AI Growth Ops',
    subtitle: 'Monthly automation for followups, reminders, reviews, and support.',
    plans: [
      {
        id: 'automation-setup',
        title: 'Automation Setup',
        price: '₹20,000',
        priceNumeric: 20000,
        suffix: '/ one-time',
        description:
          'One-time build: workflow mapping, integrations, prompt design, and go-live.',
        points: ['Business discovery', 'Workflow + integration setup', 'Prompt tuning & go-live'],
        ctaLabel: 'Start Setup',
        prompt: 'I want the AI automation setup for my business.',
        featured: false,
      },
      {
        id: 'growth-autopilot',
        title: 'Growth Autopilot',
        price: '₹12,000',
        priceNumeric: 12000,
        suffix: '/ month / location',
        description:
          'Managed automation: missed-call recovery, reminders, review responses, and bilingual support — including AI usage and monitoring.',
        points: ['Missed-call recovery', 'Reminder workflows', 'Review response assistant'],
        ctaLabel: 'See Autopilot Plan',
        href: '/services/clinic-growth-autopilot',
        featured: true,
      },
      {
        id: 'multi-branch-os',
        title: 'Multi-Branch OS',
        price: '₹30,000',
        priceNumeric: 30000,
        suffix: '/ month',
        description:
          'Scale AI operations across multiple branches with standardized SOPs, KPI tracking, and priority support.',
        points: ['Branch-level reporting', 'Team approval controls', 'Weekly outcome tracking'],
        ctaLabel: 'Open AI OS Service',
        href: '/services/ai-growth-os',
        featured: false,
      },
    ],
  },
};

// Flat facts for prose: FAQ answers, Echo prompt/fallbacks, schema offers.
export const PRICING_FACTS = {
  websiteFrom: '₹25,000',
  growthFrom: '₹65,000',
  premiumFrom: '₹1,25,000+',
  automationSetup: '₹20,000',
  autopilotMonthly: '₹12,000',
  multiBranchMonthly: '₹30,000',
} as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: FaqItem[] = [
  {
    question: 'What services does Smile Fotilo offer?',
    answer:
      'I offer Web Development (WordPress and custom React/Next.js), SEO and local search growth, brand identity design, and AI automation for local businesses — including the clinic-first Growth Autopilot.',
  },
  {
    question: 'How much does a website cost?',
    answer: `Website projects start at ${PRICING_FACTS.websiteFrom} (Launch — 5 pages, SEO-ready). E-commerce and conversion-focused builds are ${PRICING_FACTS.growthFrom} (Growth), and custom platforms start at ${PRICING_FACTS.premiumFrom} (Premium). Full breakdown on the pricing page.`,
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'Typical websites take 2-4 weeks from concept to launch. Complex projects with custom features may take 4-8 weeks. You get a clear timeline before work starts.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      'Yes. I work with clients in the USA and across India — including Curbit, a service business in Oregon. I handle timezone differences and communicate in English and Hindi.',
  },
  {
    question: 'What support do you provide after launch?',
    answer:
      'Responsive support during business hours (Mon-Sat, 9AM-6PM IST): maintenance, security updates, performance optimization, and ongoing SEO improvements. Urgent issues are handled same-day.',
  },
  {
    question: 'Do you offer AI automation for local businesses?',
    answer: `Yes. Growth Autopilot (${PRICING_FACTS.autopilotMonthly}/month per location) automates missed-call recovery, reminders, review responses, and bilingual inquiry handling — clinic-first, works for any local business.`,
  },
];
