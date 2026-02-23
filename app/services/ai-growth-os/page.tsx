import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MdAutoAwesome,
  MdCampaign,
  MdChat,
  MdDone,
  MdInsights,
  MdLanguage,
  MdRateReview,
  MdScheduleSend,
  MdSecurity,
  MdSmartToy,
  MdStorefront,
  MdWebhook,
} from 'react-icons/md';
import { OpenChatButton } from '../../components/OpenChatButton';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'AI Local Business OS | Smile Fotilo',
  description:
    'AI Local Business OS by Smile Fotilo: automate reviews, local marketing, multilingual support, and lead followup for clinics, stores, and service businesses.',
  alternates: {
    canonical: '/services/ai-growth-os',
  },
  keywords: [
    'AI automation for local business',
    'Google review automation',
    'WhatsApp lead automation India',
    'multilingual AI assistant',
    'local business marketing automation',
    'AI SaaS for clinics and restaurants',
  ],
  openGraph: {
    title: 'AI Local Business OS | Smile Fotilo',
    description:
      'Automate local growth with one stack: reviews, posts, lead followup, multilingual AI support, and analytics.',
    type: 'website',
    url: 'https://smilefotilo.com/services/ai-growth-os',
    images: [
      {
        url: '/og?title=AI%20Local%20Business%20OS&subtitle=Automation%20for%20Growth',
        width: 1200,
        height: 630,
        alt: 'Smile Fotilo AI Local Business OS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Local Business OS | Smile Fotilo',
    description:
      'Scalable AI system for local businesses: review responses, campaigns, lead ops, and multilingual support.',
    images: ['/og?title=AI%20Local%20Business%20OS&subtitle=Automation%20for%20Growth'],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is AI Local Business OS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI Local Business OS is a productized growth platform that automates review handling, local content publishing, lead followup, and multilingual support from one dashboard.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is this for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is designed for clinics, restaurants, retail stores, coaching institutes, real estate teams, and other local service businesses that need consistent growth operations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this only a chatbot?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Chat is one module. The full system includes review workflows, content scheduling, lead pipelines, integration logs, and performance analytics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can my team approve content before posting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Approval mode is supported for review replies, campaign posts, and outbound followups so your team stays in control.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it support Hindi and English?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The platform supports Hindi and English by default, with roadmap support for additional regional languages.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is pricing structured?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pricing is typically monthly per location with optional managed services for teams that want done-for-you operations.',
      },
    },
  ],
};

const modules = [
  {
    title: 'Reviews and Reputation',
    desc: 'AI-generated review replies with tone controls, escalation paths, and approval mode.',
    icon: <MdRateReview />,
  },
  {
    title: 'Campaign Autopilot',
    desc: 'Weekly local offers, announcements, and service highlights generated and scheduled in one flow.',
    icon: <MdCampaign />,
  },
  {
    title: 'Lead Inbox and Followup',
    desc: 'Capture and qualify leads from chat, forms, and WhatsApp with reminders and ownership tracking.',
    icon: <MdChat />,
  },
  {
    title: 'Voice and Chat Agent',
    desc: 'Business-specific assistant for FAQs, booking support, and pre-sales guidance.',
    icon: <MdSmartToy />,
  },
  {
    title: 'Integrations and Events',
    desc: 'Connect CRM, forms, booking apps, and messaging channels with event logging.',
    icon: <MdWebhook />,
  },
  {
    title: 'Analytics and Insights',
    desc: 'Track response speed, sentiment, campaign output, and lead conversion trends.',
    icon: <MdInsights />,
  },
];

const implementationSteps = [
  {
    title: 'Vertical Discovery',
    desc: 'Pick one niche and map high-frequency tasks that consume owner time every week.',
    icon: <MdStorefront />,
  },
  {
    title: 'Data and Workflow Setup',
    desc: 'Configure knowledge base, brand voice, approval rules, and connected channels.',
    icon: <MdAutoAwesome />,
  },
  {
    title: 'Pilot Launch',
    desc: 'Launch with one location, monitor quality daily, and tune prompts plus safeguards.',
    icon: <MdScheduleSend />,
  },
  {
    title: 'Scale Playbook',
    desc: 'Standardize templates and onboarding so the same system expands to multiple clients fast.',
    icon: <MdDone />,
  },
];

const verticalPacks = [
  {
    title: 'Clinic Pack',
    points: ['Appointment reminders', 'Review and feedback loop', 'Followup FAQs'],
  },
  {
    title: 'Restaurant Pack',
    points: ['Menu and offer campaigns', 'Review reputation ops', 'Reservation lead routing'],
  },
  {
    title: 'Retail Pack',
    points: ['Inventory-linked promotions', 'Store-level lead tagging', 'Post-purchase support'],
  },
  {
    title: 'Real Estate Pack',
    points: ['Inquiry qualification', 'Location-specific content', 'Broker followup automation'],
  },
];

export default function AIGrowthOSPage() {
  return (
    <>
    <main className="min-h-screen bg-[#020617] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-widest mb-8">
            <MdAutoAwesome className="text-base" />
            Futuristic Service Product
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AI Local Business OS
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"> for Scalable Growth</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Not another generic chatbot. This is an operations system that automates reputation, local marketing,
            lead workflows, and multilingual support from one control panel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton
              prompt="I want to launch AI Local Business OS for my business. Ask me for my vertical, team size, and goals."
              className="btn-primary px-8 py-4 text-lg"
            >
              <span>Book Pilot Strategy Call</span>
            </OpenChatButton>
            <Link href="/services" className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl">
              Compare All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Core Product Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.title}
                className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/60 hover:border-cyan-400/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-2xl mb-5">
                  {module.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-slate-400">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#020617]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Implementation Blueprint</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {implementationSteps.map((step, index) => (
              <div key={step.title} className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/50">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Vertical Packs for Faster Scale</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              Same product core, different templates by industry. This gives you repeatable delivery and recurring revenue.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {verticalPacks.map((pack) => (
              <div key={pack.title} className="p-6 rounded-2xl border border-white/10 bg-[#020617]/75">
                <h3 className="text-lg font-bold mb-4 text-cyan-300">{pack.title}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {pack.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <MdDone className="text-cyan-300 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#020617]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-cyan-400/30 bg-cyan-500/5">
            <h2 className="text-3xl font-bold mb-6 text-center">Trust Layer Built In</h2>
            <div className="grid md:grid-cols-2 gap-5 text-slate-300">
              <div className="flex items-start gap-3">
                <MdSecurity className="text-cyan-300 text-xl mt-1" />
                <p>Approval controls for sensitive actions and outbound communication.</p>
              </div>
              <div className="flex items-start gap-3">
                <MdInsights className="text-cyan-300 text-xl mt-1" />
                <p>Audit logs for all AI actions so businesses can review decisions quickly.</p>
              </div>
              <div className="flex items-start gap-3">
                <MdLanguage className="text-cyan-300 text-xl mt-1" />
                <p>Hindi + English response strategies with room for regional expansion.</p>
              </div>
              <div className="flex items-start gap-3">
                <MdWebhook className="text-cyan-300 text-xl mt-1" />
                <p>Open integration model for CRM, booking, and messaging providers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to Launch Your First Pilot?</h2>
          <p className="text-white/85 text-lg mb-8">
            Start with one vertical and one location. Productize what works, then scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton
              prompt="Start pilot discussion for AI Local Business OS."
              className="inline-block bg-white text-cyan-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              <span>Start Pilot Discussion</span>
            </OpenChatButton>
            <Link
              href="/pricing"
              className="inline-block border border-white/70 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View Pricing Options
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
