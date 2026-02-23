import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MdCalendarMonth,
  MdCallMissedOutgoing,
  MdCheckCircle,
  MdInsights,
  MdMarkChatUnread,
  MdRateReview,
  MdScheduleSend,
  MdTrendingUp,
} from 'react-icons/md';
import { OpenChatButton } from '../../components/OpenChatButton';
import { Footer } from '../../components/Footer';

export const metadata: Metadata = {
  title: 'Growth Autopilot (Clinic-First) | Smile Fotilo',
  description:
    'Growth Autopilot by Smile Fotilo is a clinic-first, multi-vertical-ready automation system for lead followups, reminders, review workflows, and support.',
  alternates: {
    canonical: '/services/clinic-growth-autopilot',
  },
  keywords: [
    'growth autopilot',
    'clinic automation India',
    'doctor clinic lead followup',
    'Google review automation clinic',
    'appointment reminder system',
    'Hindi English clinic chatbot',
  ],
  openGraph: {
    title: 'Growth Autopilot (Clinic-First) | Smile Fotilo',
    description:
      'A clinic-first automation system for missed-call recovery, reminders, reviews, and appointment-focused growth analytics.',
    type: 'website',
    url: 'https://smilefotilo.com/services/clinic-growth-autopilot',
    images: [
      {
        url: '/og?title=Growth%20Autopilot&subtitle=Clinic-First%20Automation',
        width: 1200,
        height: 630,
        alt: 'Smile Fotilo Growth Autopilot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growth Autopilot (Clinic-First) | Smile Fotilo',
    description:
      'Clinic-first automation for lead handling, reminders, review management, and local growth.',
    images: ['/og?title=Growth%20Autopilot&subtitle=Clinic-First%20Automation'],
  },
};

const usps = [
  {
    title: 'Vertical-First, Multi-Vertical Ready',
    desc: 'Built around real front-desk behavior: missed calls, reminders, walk-ins, and followups.',
  },
  {
    title: 'Human-in-the-Loop Control',
    desc: 'Approve sensitive replies while automation handles repetitive tasks at scale.',
  },
  {
    title: 'Outcomes Over Vanity Metrics',
    desc: 'Track booked appointments, response speed, no-show reduction, and review sentiment.',
  },
];

const modules = [
  {
    title: 'Missed-Call Recovery',
    desc: 'Auto-send WhatsApp follow-up to missed calls and route replies to clinic staff.',
    icon: <MdCallMissedOutgoing />,
  },
  {
    title: 'Appointment Reminder Flow',
    desc: 'T-24h and T-2h reminders to reduce no-shows and keep slots optimized.',
    icon: <MdCalendarMonth />,
  },
  {
    title: 'Review Response Assistant',
    desc: 'Draft response suggestions for Google reviews with optional approval mode.',
    icon: <MdRateReview />,
  },
  {
    title: 'Weekly Clinic Posts',
    desc: 'Generate and schedule local clinic updates, offers, and education posts.',
    icon: <MdScheduleSend />,
  },
  {
    title: 'FAQ and Booking Assistant',
    desc: 'Hindi + English assistant for service FAQs, timing, fees, and booking intent.',
    icon: <MdMarkChatUnread />,
  },
  {
    title: 'Owner Dashboard',
    desc: 'Track lead response speed, booked appointments, review sentiment, and follow-up status.',
    icon: <MdInsights />,
  },
];

const rollout = [
  {
    phase: 'Week 1-2',
    title: 'Clinic Workflow Mapping',
    desc: 'Map reception flow, booking process, follow-up cadence, and escalation rules.',
  },
  {
    phase: 'Week 3-5',
    title: 'Integrations and Templates',
    desc: 'Set up WhatsApp, forms, Google profile workflows, and clinic-specific prompt templates.',
  },
  {
    phase: 'Week 6-8',
    title: 'Pilot Launch',
    desc: 'Deploy to one clinic branch, monitor daily quality, and tune automation decisions.',
  },
  {
    phase: 'Week 9-12',
    title: 'Scale Playbook',
    desc: 'Standardize onboarding and duplicate winning setup for additional branches.',
  },
];

const kpis = [
  'Faster first response for new patient inquiries',
  'Lower missed-follow-up leakage from calls and forms',
  'Higher review response consistency and reputation score',
  'More appointments confirmed through reminder flow',
];

export default function ClinicGrowthAutopilotPage() {
  return (
    <>
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/15 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-xs font-bold uppercase tracking-widest mb-7">
            Unique USP: Clinic-First Product
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Growth Autopilot
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300"> for Real-World Operations</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Not a generic chatbot. A clinic-first automation stack that scales to restaurants,
            real estate, and local service businesses after pilot validation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton
              prompt="I want to start a Growth Autopilot pilot for my clinic."
              className="btn-primary px-8 py-4 text-lg"
            >
              <span>Start Pilot Discussion</span>
            </OpenChatButton>
            <OpenChatButton
              prompt="Show me Growth Autopilot plans and monthly pricing."
              className="btn-secondary px-8 py-4 text-lg border border-white/20 rounded-xl"
            >
              See Plans in Chat
            </OpenChatButton>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Why This Is Different (USP)</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {usps.map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/60">
                <h3 className="text-xl font-bold mb-2 text-cyan-300">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#020617]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">Automation Modules</h2>
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

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Expansion Path</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/60">
              <h3 className="text-xl font-bold mb-2 text-cyan-300">Phase 1: Clinics</h3>
              <p className="text-slate-400">Validate lead recovery, reminders, and review workflows with measurable outcomes.</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/60">
              <h3 className="text-xl font-bold mb-2 text-cyan-300">Phase 2: Restaurants</h3>
              <p className="text-slate-400">Repurpose followup and review modules for reservation, offer, and reputation operations.</p>
            </div>
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/60">
              <h3 className="text-xl font-bold mb-2 text-cyan-300">Phase 3: Real Estate</h3>
              <p className="text-slate-400">Adapt inquiry qualification, callback workflows, and localized campaign orchestration.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">90-Day Implementation Plan</h2>
          <div className="space-y-5">
            {rollout.map((step) => (
              <div key={step.title} className="p-6 rounded-2xl border border-white/10 bg-[#0F172A]/50">
                <div className="text-cyan-300 text-sm font-semibold uppercase tracking-wider mb-2">{step.phase}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#020617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Expected Outcomes</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {kpis.map((item) => (
              <div key={item} className="flex items-center gap-3 p-5 rounded-2xl border border-white/10 bg-[#020617]/75">
                <MdTrendingUp className="text-cyan-300 text-xl shrink-0" />
                <span className="text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a0118]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl border border-cyan-400/30 bg-cyan-500/5">
            <h2 className="text-3xl font-bold mb-6 text-center">Pricing Model</h2>
            <ul className="space-y-4 text-slate-200">
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-cyan-300 mt-1" />
                Setup: INR 7,999 to INR 14,999 per clinic.
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-cyan-300 mt-1" />
                Monthly SaaS: INR 3,999 to INR 9,999 per clinic location.
              </li>
              <li className="flex items-start gap-3">
                <MdCheckCircle className="text-cyan-300 mt-1" />
                Managed service add-on: INR 5,000+ monthly for done-for-you operations.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">Ready to Pilot This in One Clinic?</h2>
          <p className="text-white/85 text-lg mb-8">
            Start with one branch, prove outcomes, then scale to multiple locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <OpenChatButton
              prompt="Start pilot discussion for Growth Autopilot."
              className="inline-block bg-white text-cyan-700 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              Start Pilot Discussion
            </OpenChatButton>
            <Link
              href="/services"
              className="inline-block border border-white/70 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
