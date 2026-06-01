import type { Metadata } from 'next';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for Smile Fotilo - Read our terms and conditions for using our web design and digital services.',
    alternates: {
        canonical: '/terms',
    },
};

export default function TermsOfServicePage() {
    return (
        <>
            <main className="min-h-screen bg-[#020617] text-white pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
                    <p className="text-slate-400 mb-8">Last updated: January 24, 2026</p>

                <div className="prose prose-invert prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-slate-300 leading-relaxed">
                            By accessing and using the services provided by Smile Fotilo, you accept and agree to be bound by
                            these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Services</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Smile Fotilo provides web design, development, branding, SEO, and related digital services.
                            The specific scope, timeline, and deliverables for each project will be outlined in a separate
                            proposal or agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Payment Terms</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Payment terms will be specified in your project proposal. Generally, we require an advance payment
                            before starting work, with the remaining balance due upon project completion. All prices are in
                            Indian Rupees (INR) unless otherwise specified.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Upon full payment, you will own the rights to the final deliverables created specifically for
                            your project. Smile Fotilo retains the right to showcase completed work in our portfolio unless
                            otherwise agreed in writing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Client Responsibilities</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Clients are responsible for providing accurate content, timely feedback, and necessary approvals.
                            Delays in client responses may affect project timelines and may incur additional charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Revisions</h2>
                        <p className="text-slate-300 leading-relaxed">
                            The number of included revisions will be specified in your project proposal. Additional revisions
                            beyond the agreed scope may be charged separately at our standard hourly rate.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Smile Fotilo shall not be liable for any indirect, incidental, or consequential damages arising
                            from the use of our services. Our total liability shall not exceed the amount paid for the
                            specific service in question.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Termination</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Either party may terminate a project with written notice. In case of termination, the client
                            will be responsible for payment of work completed up to the termination date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Contact</h2>
                        <p className="text-slate-300 leading-relaxed">
                            For questions about these Terms of Service, please contact us:
                        </p>
                        <ul className="text-slate-300 mt-4 space-y-2">
                            <li>Email: support@smilefotilo.com</li>
                            <li>Phone: +91 9453878422</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Earnings Disclaimer</h2>
                        <p className="text-slate-300 leading-relaxed">
                            Smile Fotilo does not guarantee specific financial returns, traffic increases, or search engine rankings. 
                            Any examples or case studies are provided for illustrative purposes and do not constitute a promise of performance.
                        </p>
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
