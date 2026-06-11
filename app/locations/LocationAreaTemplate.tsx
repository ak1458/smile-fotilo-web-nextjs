import Link from 'next/link';
import { MdArrowForward, MdCheckCircle, MdLocationOn } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { Footer } from '../components/Footer';
import { OtherLocations } from '../components/OtherLocations';
import { StructuredData, faqSchema } from '../components/StructuredData';
import { PRICING_FACTS } from '../data/pricing';
import type { ServiceAreaLocation } from '../data/locations';

const WHATSAPP_BASE = 'https://wa.me/919453878422?text=';

// Server-rendered template for service-area city pages (no physical office).
// One data entry in app/data/locations.ts + a thin page.tsx per city.
export function LocationAreaTemplate({ location }: { location: ServiceAreaLocation }) {
  const whatsappHref = `${WHATSAPP_BASE}${encodeURIComponent(
    `Hi Smile Fotilo, I need a website/SEO for my business in ${location.name}.`,
  )}`;

  return (
    <>
      <StructuredData data={faqSchema(location.faqs)} />
      <main className="min-h-screen bg-[#020617] text-slate-200">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-cyan-300">
                <MdLocationOn /> {location.heroEyebrow}
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
                {location.heroTitle} <span className={location.accentClass}>{location.heroAccent}</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-400 md:text-xl">{location.intro}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white transition-colors hover:bg-indigo-500"
                >
                  Get a Free Quote <MdArrowForward />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 px-8 py-4 font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/10"
                >
                  <FaWhatsapp className="text-xl" /> WhatsApp
                </a>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                Websites from <span className="font-semibold text-slate-300">{PRICING_FACTS.websiteFrom}</span> · Free
                quote in 24 hours · Hindi &amp; English
              </p>
            </div>
          </div>
        </section>

        {/* Services for this city */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-bold text-white md:text-4xl">
              What I do for {location.name} businesses
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {location.services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-cyan-500/30"
                >
                  <h3 className="mb-3 text-xl font-bold text-white">{service.title}</h3>
                  <p className="leading-relaxed text-slate-400">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Honest positioning */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
              <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">How working together looks</h2>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{location.positioning}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {['Founder-direct, no handoffs', 'Same-day replies on WhatsApp', 'Plain-language monthly reports'].map(
                  (point) => (
                    <div key={point} className="flex items-start gap-3 text-slate-300">
                      <MdCheckCircle className="mt-1 shrink-0 text-cyan-400" />
                      <span>{point}</span>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                <Link href="/work" className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200">
                  See client work
                </Link>
                <Link href="/pricing" className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200">
                  Compare pricing
                </Link>
                <Link href="/services" className="text-indigo-300 underline underline-offset-4 hover:text-indigo-200">
                  All services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              {location.name} — common questions
            </h2>
            <div className="space-y-6">
              {location.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                  <h3 className="mb-3 text-lg font-bold text-white md:text-xl">{faq.question}</h3>
                  <p className="leading-relaxed text-slate-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Ready to get found in {location.name}?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 font-bold text-white transition-colors hover:bg-indigo-500"
              >
                Start a project <MdArrowForward />
              </Link>
            </div>
          </div>
        </section>

        <OtherLocations currentLocation={location.slug} />
        <Footer />
      </main>
    </>
  );
}
