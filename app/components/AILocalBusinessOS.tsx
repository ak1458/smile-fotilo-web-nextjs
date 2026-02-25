'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MdAutoAwesome,
  MdCalendarMonth,
  MdCallMissedOutgoing,
  MdLanguage,
  MdRateReview,
  MdMarkChatUnread,
  MdScheduleSend,
} from 'react-icons/md';

const modules = [
  {
    title: 'Missed-Call Recovery',
    desc: 'Auto WhatsApp follow-up for missed calls so inquiry leakage drops from day one.',
    icon: <MdCallMissedOutgoing />,
  },
  {
    title: 'Reminder Workflow',
    desc: 'T-24h and T-2h reminder flow to reduce no-shows and improve slot utilization.',
    icon: <MdCalendarMonth />,
  },
  {
    title: 'Review Response Assistant',
    desc: 'Google review response drafts with optional approval mode for clinic owners.',
    icon: <MdRateReview />,
  },
  {
    title: 'FAQ and Booking Chat',
    desc: 'Hindi + English assistant for clinic FAQs, timing, fees, and booking intent.',
    icon: <MdMarkChatUnread />,
  },
];

const outcomes = [
  'Recover more leads from missed calls',
  'Reduce patient no-show rate with reminders',
  'Respond to reviews consistently and faster',
  'Track booked appointments and response SLAs in one dashboard',
];

export const AILocalBusinessOS = () => {
  return (
    <section id="clinic-growth-autopilot" className="py-24 bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[460px] h-[460px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-6">
            <MdAutoAwesome className="text-base" />
            Growth Autopilot USP
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Growth
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300"> Autopilot</span>
          </h2>
          <p className="text-slate-400 mt-6 max-w-3xl mx-auto text-lg">
            Purpose-built for clinics: missed-call recovery, patient reminders, review workflows,
            and bilingual support to convert more inquiries into confirmed appointments. Built to
            expand into restaurant and real-estate packs after clinic validation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-[#0F172A]/55 p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold mb-6">Core Modules</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {modules.map((item) => (
                <div
                  key={item.title}
                  className="h-full min-h-[190px] rounded-xl sm:rounded-2xl border border-white/10 bg-[#020617]/80 p-4 sm:p-5 hover:border-cyan-400/40 transition-colors flex flex-col"
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center justify-center text-lg sm:text-2xl mb-3 sm:mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm sm:text-base mb-1.5 sm:mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-4 sm:line-clamp-none">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-6 md:p-8"
          >
            <h3 className="text-2xl font-bold mb-4">What Clinic Owners Get</h3>
            <p className="text-slate-300 mb-6">
              Workflow-first setup with approval controls, language settings, and weekly performance snapshots.
            </p>

            <div className="space-y-3 mb-8">
              {outcomes.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#020617]/70 px-4 py-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-300" />
                  <span className="text-slate-200 text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#020617]/80 p-5 mb-8">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-2">90-Day Rollout</div>
              <div className="text-slate-100 font-semibold">Discover {'>'} Integrate {'>'} Pilot {'>'} Scale across branches</div>
              <div className="text-slate-400 text-sm mt-1">Launch one clinic first, then replicate with a proven playbook.</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services/clinic-growth-autopilot" className="btn-primary text-center px-6 py-3">
                <span>Explore Growth Blueprint</span>
              </Link>
              <a href="tel:+919453878422" className="btn-secondary text-center px-6 py-3">
                Book Pilot Call
              </a>
            </div>
            <div className="mt-6 text-xs text-slate-400 inline-flex items-center gap-2">
              <MdScheduleSend className="text-sm" />
              Includes weekly campaign posting plus bilingual patient support workflows.
            </div>
            <div className="mt-2 text-xs text-slate-400 inline-flex items-center gap-2">
              <MdLanguage className="text-sm" />
              Hindi + English ready from day one.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
