import type { Metadata } from 'next';
import Link from 'next/link';
import { MdCall, MdMail, MdSchedule, MdLocationOn } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { ContactForm } from '../components/ContactForm';
import { Footer } from '../components/Footer';
import { StructuredData } from '../components/StructuredData';
import { PRICING } from '../data/pricing';

export const metadata: Metadata = {
  title: 'Contact — Get a Free Quote in 24 Hours',
  description:
    'Tell me about your project and get a free quote within 24 hours. WhatsApp, call, or email Smile Fotilo — web design, SEO, and AI automation from Gonda, UP, serving clients worldwide.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Smile Fotilo',
    description:
      'Free quote in 24 hours. WhatsApp, call, or send project details — replies in Hindi or English.',
    type: 'website',
    url: 'https://smilefotilo.com/contact',
    images: [
      {
        url: '/og?title=Contact%20Smile%20Fotilo&subtitle=Free%20Quote%20in%2024%20Hours',
        width: 1200,
        height: 630,
        alt: 'Contact Smile Fotilo',
      },
    ],
  },
};

const WHATSAPP_HREF =
  'https://wa.me/919453878422?text=Hi%20Smile%20Fotilo%2C%20I%20want%20a%20free%20quote%20for%20my%20project.';

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://smilefotilo.com/contact#contactpage',
  url: 'https://smilefotilo.com/contact',
  name: 'Contact Smile Fotilo',
  mainEntity: { '@id': 'https://smilefotilo.com/#organization' },
};

const allPlans = [...PRICING.project.plans, ...PRICING.autopilot.plans];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planId } = await searchParams;
  const plan = allPlans.find((p) => p.id === planId);

  return (
    <>
      <StructuredData data={contactPageSchema} />
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="relative overflow-hidden pt-32 pb-16">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                Tell me what you&apos;re building.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                I reply within 24 hours — usually much faster — in Hindi or English.
                No sales team, no handoffs: you talk directly to the person who
                builds your project.
              </p>
              {plan && (
                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-5 py-3">
                  <span className="text-sm text-slate-300">Asking about:</span>
                  <span className="font-semibold text-white">
                    {plan.title} — {plan.price}
                    <span className="ml-1 text-sm font-normal text-slate-400">{plan.suffix}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <div className="space-y-4">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 transition-colors hover:border-emerald-500/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl text-emerald-400">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <div className="font-semibold text-white">WhatsApp — fastest</div>
                    <div className="text-sm text-slate-400">+91 94538 78422 · same-day reply</div>
                  </div>
                </a>

                <a
                  href="tel:+919453878422"
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-300">
                    <MdCall />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Call</div>
                    <div className="text-sm text-slate-400">+91 94538 78422</div>
                  </div>
                </a>

                <a
                  href="mailto:support@smilefotilo.com"
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-300">
                    <MdMail />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Email</div>
                    <div className="text-sm text-slate-400">support@smilefotilo.com</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-300">
                    <MdSchedule />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Hours</div>
                    <div className="text-sm text-slate-400">Mon–Sat, 9AM–6PM IST · urgent issues same-day</div>
                  </div>
                </div>

                <a
                  href="https://www.google.com/maps?cid=14436214578143247413"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/25"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl text-indigo-300">
                    <MdLocationOn />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Studio</div>
                    <div className="text-sm text-slate-400">
                      KP Singh Marg, near Deewani Kacheri Chauraha, Civil Line, Gonda, UP 271001
                    </div>
                  </div>
                </a>

                <p className="pt-2 text-sm text-slate-500">
                  Not sure what you need yet? Compare plans on the{' '}
                  <Link href="/pricing" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                    pricing page
                  </Link>{' '}
                  or browse{' '}
                  <Link href="/work" className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
                    recent client work
                  </Link>
                  .
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
