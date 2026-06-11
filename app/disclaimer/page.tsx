import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'Disclaimer',
    description:
        'Disclaimer for Smile Fotilo — what our results claims, pricing, third-party references, and blog content do and do not promise.',
    alternates: { canonical: '/disclaimer' },
    robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
    return (
        <>
            <main className="min-h-screen bg-[#020617] pt-24 pb-20 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-8 text-4xl font-bold md:text-5xl">Disclaimer</h1>
                    <p className="mb-8 text-slate-400">Last updated: June 11, 2026</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">1. Results vary</h2>
                            <p className="leading-relaxed text-slate-300">
                                Case studies and examples on this site describe real client projects, but every
                                business is different. Past outcomes — rankings, traffic, leads, or revenue — do not
                                guarantee similar results for your project. SEO in particular depends on competition,
                                budget, and time; no honest provider can guarantee a specific Google position.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">2. Pricing</h2>
                            <p className="leading-relaxed text-slate-300">
                                Prices on the <Link href="/pricing" className="text-indigo-300 underline underline-offset-2">pricing page</Link>{' '}
                                are starting points for typical scopes. Your final quote depends on requirements and is
                                confirmed in writing before any work begins. Prices may change; the written quote you
                                receive is what applies to your project.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">3. Free tools and the Echo assistant</h2>
                            <p className="leading-relaxed text-slate-300">
                                The free tools and the Echo chat assistant provide automated, general-purpose output.
                                They are useful starting points, not professional advice, and may contain errors.
                                Decisions you make based on them are your own; for anything important, talk to a human —{' '}
                                <Link href="/contact" className="text-indigo-300 underline underline-offset-2">contact me directly</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">4. Third-party names and links</h2>
                            <p className="leading-relaxed text-slate-300">
                                Product names mentioned on this site (Google, WordPress, WooCommerce, Razorpay, WhatsApp,
                                and others) are trademarks of their respective owners. Mentioning them means we work with
                                those platforms — not that those companies endorse Smile Fotilo. External links are
                                provided for convenience; we are not responsible for third-party content.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">5. Blog content</h2>
                            <p className="leading-relaxed text-slate-300">
                                Blog articles reflect experience and research at the time of writing. Web standards,
                                Google policies, and prices change quickly — verify anything time-sensitive before
                                acting on it.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">6. Questions</h2>
                            <p className="leading-relaxed text-slate-300">
                                Email{' '}
                                <a href="mailto:support@smilefotilo.com" className="text-indigo-300 underline underline-offset-2">
                                    support@smilefotilo.com
                                </a>
                                . See also the{' '}
                                <Link href="/terms" className="text-indigo-300 underline underline-offset-2">Terms of Service</Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-indigo-300 underline underline-offset-2">Privacy Policy</Link>.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
