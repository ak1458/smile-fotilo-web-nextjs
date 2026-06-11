import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description:
        'Which cookies smilefotilo.com sets, what they do, and how to change your consent choice at any time.',
    alternates: { canonical: '/cookie-policy' },
    robots: { index: true, follow: true },
};

const cookieRows = [
    {
        name: 'sf_cookie_consent',
        provider: 'Smile Fotilo',
        purpose: 'Remembers whether you accepted or declined analytics cookies.',
        duration: '1 year',
        type: 'Necessary',
    },
    {
        name: '_ga, _ga_*',
        provider: 'Google Analytics',
        purpose: 'Distinguishes visitors and sessions so we can see which pages help people. Only set after you accept.',
        duration: 'Up to 2 years',
        type: 'Analytics (consent required)',
    },
    {
        name: 'echo_client_id, echo_model',
        provider: 'Smile Fotilo (localStorage)',
        purpose: 'Keeps your Echo chat session stable and remembers your model preference. Stays on your device; never sent to advertisers.',
        duration: 'Until you clear browser storage',
        type: 'Functional',
    },
];

export default function CookiePolicyPage() {
    return (
        <>
            <main className="min-h-screen bg-[#020617] pt-24 pb-20 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-8 text-4xl font-bold md:text-5xl">Cookie Policy</h1>
                    <p className="mb-8 text-slate-400">Last updated: June 11, 2026</p>

                    <div className="space-y-8">
                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">1. How this site uses cookies</h2>
                            <p className="leading-relaxed text-slate-300">
                                smilefotilo.com uses a small number of cookies and browser-storage entries. Analytics
                                runs in Google Consent Mode v2: until you choose &quot;Accept all&quot; in the consent
                                banner, no analytics cookies are written and no identifiers are stored.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">2. Cookies and storage we use</h2>
                            <div className="overflow-x-auto rounded-2xl border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/5 text-slate-300">
                                        <tr>
                                            <th className="p-4 font-semibold">Name</th>
                                            <th className="p-4 font-semibold">Provider</th>
                                            <th className="p-4 font-semibold">Purpose</th>
                                            <th className="p-4 font-semibold">Duration</th>
                                            <th className="p-4 font-semibold">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cookieRows.map((row) => (
                                            <tr key={row.name} className="border-t border-white/5 align-top">
                                                <td className="p-4 font-mono text-xs text-indigo-300">{row.name}</td>
                                                <td className="p-4 text-slate-300">{row.provider}</td>
                                                <td className="p-4 text-slate-400">{row.purpose}</td>
                                                <td className="p-4 text-slate-400">{row.duration}</td>
                                                <td className="p-4 text-slate-300">{row.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">3. Changing your choice</h2>
                            <p className="leading-relaxed text-slate-300">
                                Clear this site&apos;s data in your browser (the <span className="font-mono text-xs">sf_cookie_consent</span>{' '}
                                entry) and the consent banner will appear again on your next visit. You can also block
                                cookies entirely in your browser settings — the site works fine without them.
                            </p>
                        </section>

                        <section>
                            <h2 className="mb-4 text-2xl font-bold text-white">4. Questions</h2>
                            <p className="leading-relaxed text-slate-300">
                                Email{' '}
                                <a href="mailto:support@smilefotilo.com" className="text-indigo-300 underline underline-offset-2">
                                    support@smilefotilo.com
                                </a>{' '}
                                or see the{' '}
                                <Link href="/privacy" className="text-indigo-300 underline underline-offset-2">
                                    Privacy Policy
                                </Link>{' '}
                                for how personal data is handled.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
