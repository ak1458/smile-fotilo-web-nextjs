import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | Smile Fotilo',
    description: 'Privacy Policy for Smile Fotilo - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
    return (
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
                        <h2 className="text-2xl font-bold text-white mb-4">5. Cookies</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Our website may use cookies to enhance your browsing experience. You can choose to disable cookies
                            through your browser settings, but this may affect some features of our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                        <p className="text-slate-300 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <ul className="text-slate-300 mt-4 space-y-2">
                            <li>Email: ashrafkamal1458@gmail.com</li>
                            <li>Phone: +91 9453878422</li>
                            <li>Address: Gonda, Uttar Pradesh, India</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <Link href="/" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                        <span className="material-symbols-rounded">arrow_back</span>
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
