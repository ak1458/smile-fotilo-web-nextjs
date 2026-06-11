import type { Metadata } from 'next';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { Footer } from '../components/Footer';


export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for Smile Fotilo - Learn how we collect, use, and protect your personal information.',
    alternates: {
        canonical: '/privacy',
    },
};

export default function PrivacyPolicyPage() {
    return (
        <>
            <main className="min-h-screen bg-[#020617] text-white pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
                    <p className="text-slate-400 mb-8">Last updated: January 24, 2026</p>

                    <div className="prose prose-invert prose-slate max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-slate-300 leading-relaxed">
                                At Smile Fotilo, we collect information you provide directly to us, such as when you fill out a contact form,
                                request a quote, or communicate with us via email or phone. This may include your name, email address,
                                phone number, company name, and project details.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We use the information we collect to respond to your inquiries, provide quotes for our services,
                                deliver the services you request, and communicate with you about projects. We may also use your
                                information to improve our services and website experience.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties. We may share your
                                information with trusted service providers who assist us in operating our website and conducting
                                our business, provided they agree to keep your information confidential.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We implement appropriate security measures to protect your personal information against unauthorized
                                access, alteration, disclosure, or destruction. However, no method of transmission over the Internet
                                is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies &amp; Analytics Consent</h2>
                            <p className="text-slate-300 leading-relaxed">
                                Analytics on this site runs under Google Consent Mode v2: no analytics cookies are set
                                and no identifiers are stored until you choose &quot;Accept all&quot; in the consent banner.
                                You can decline and the site works fully. The complete list of cookies and storage we
                                use — and how to change your choice — is in the{' '}
                                <Link href="/cookie-policy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Cookie Policy</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Chat Assistant &amp; Form Data</h2>
                            <p className="text-slate-300 leading-relaxed">
                                Messages you send to the Echo chat assistant are processed by AI providers to generate a
                                reply and are not used to build advertising profiles. Contact-form submissions are
                                delivered to us by email and stored only as long as needed to respond to your inquiry.
                                Business-customer data (for clients using our automation products) is stored with
                                Supabase under access controls.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                            <p className="text-slate-300 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <ul className="text-slate-300 mt-4 space-y-2">
                                <li>Email: support@smilefotilo.com</li>
                                <li>Phone: +91 9453878422</li>
                                <li>Address: Gonda, Uttar Pradesh, India</li>
                            </ul>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10">
                        <Link href="/" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                            <MdArrowBack />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
