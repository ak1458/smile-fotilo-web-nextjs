"use client";

import { useState } from 'react';
import { Footer } from '../../components/Footer';
import { ConnectModal } from '../../components/ConnectModal';
import { OtherLocations } from '../../components/OtherLocations';
import { LocationSchema } from '../../components/LocationSchema';
import { GmbUpdates } from '../../components/GmbUpdates';
import { MdArrowForward, MdTempleHindu, MdCheckCircle, MdHotel, MdStore, MdAutoAwesome } from 'react-icons/md';

export default function AyodhyaPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen relative text-slate-200 selection:bg-orange-500/30">
            <LocationSchema location="ayodhya" />
            <ConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} context="Ayodhya Location Page" />

            {/* Global Animated Background */}
            <div className="fixed inset-0 z-[-2] animated-bg"></div>

            {/* User Provided Background Image (BG OLD) - FINAL SELECTION */}
            <div className="fixed inset-0 z-[-1] opacity-[0.35] pointer-events-none" style={{
                backgroundImage: `url('/ayodhya-bg-abstract.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to bottom, black 20%, transparent 90%)'
            }}></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden min-h-[85vh] flex items-center">
                {/* Hero Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/20 mb-8 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_orange]"></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-orange-200">The Digital Renaissance of Ayodhya</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
                            Where <span className="text-indigo-300">Heritage</span> Meets <span className="text-indigo-300">Technology</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-10 font-light leading-relaxed">
                            Ayodhya is evolving, and so is its story. At Smile Fotilo, we are honoring the sacred past while building a smart, connected future.
                            From <span className="text-orange-300 font-medium">immersive temple experiences</span> to <span className="text-blue-300 font-medium">global digital outreach</span> for local businesses.
                        </p>

                        <div className="flex flex-wrap justify-center gap-5">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn-primary flex items-center gap-2 group shadow-orange-500/20"
                            >
                                <span>Digitalize Your Vision</span>
                                <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a
                                href="https://www.google.com/maps/search/Smile+Fotilo+Ayodhya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 rounded-full border border-orange-500/30 text-orange-200 hover:bg-orange-500/10 transition-all flex items-center gap-2 group"
                            >
                                <span>View on Google Maps</span>
                                <MdTempleHindu className="text-orange-400 group-hover:rotate-12 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Connection Section (Glass Cards) */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                        <div className="order-2 md:order-1 relative">
                            {/* Abstract Visual Representation of Mandir Structure */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-blue-500/20 blur-3xl rounded-full"></div>
                            <div className="glass-card p-8 md:p-12 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MdTempleHindu className="text-9xl" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Our Vision for Ayodhya</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    We envision Ayodhya not just as a spiritual capital, but as a beacon of specific <strong>smart city innovation</strong>.
                                    Our goal is to assist local artisans, hospitality services, and cultural institutions in showcasing their legacy to the world through world-class web design and digital storytelling.
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Global platforms for local artisans',
                                        'Smart tourism interfaces for pilgrims',
                                        'Digital archives for heritage preservation'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <MdCheckCircle className="text-orange-400 text-sm" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why We Are Here</h2>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                Our presence in Ayodhya is driven by a deep respect for its transformation. As the city grows into a global pilgrimage destination, the need for a sophisticated digital infrastructure grows with it.
                            </p>
                            <p className="text-slate-400 leading-relaxed">
                                Smile Fotilo bridges the gap. We bring the same premium design standards used by global brands to the heart of Ram Janmabhoomi, ensuring that every digital interaction reflects the dignity and grandeur of this holy city.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services for Ayodhya */}
            <section className="py-20 relative bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Services Tailored for Ayodhya</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-transparent mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: 'temple_hindu',
                                title: 'Temple & Trust Websites',
                                desc: 'Secure, high-traffic portals for donations, darshan bookings, and live streaming services.',
                                color: 'text-orange-400'
                            },
                            {
                                icon: 'hotel',
                                title: 'Hospitality & Tourism',
                                desc: 'Premium booking engines and experiences for hotels, homestays, and travel agencies catering to global visitors.',
                                color: 'text-blue-400'
                            },
                            {
                                icon: 'store',
                                title: 'Local Business Growth',
                                desc: 'E-commerce solutions for selling prasad, handicrafts, and souvenirs to devotees worldwide.',
                                color: 'text-emerald-400'
                            }
                        ].map((service, i) => (
                            <div key={i} className="glass p-8 rounded-2xl hover:bg-white/5 transition-all group hover:-translate-y-2">
                                <span className={`${service.color} group-hover:scale-110 transition-transform text-4xl mb-4 block`}>
                                    {service.icon === 'temple_hindu' ? <MdTempleHindu /> : service.icon === 'hotel' ? <MdHotel /> : <MdStore />}
                                </span>
                                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cultural Ambient Section */}
            <section className="py-32 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/10 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center max-w-2xl px-4">
                    <MdAutoAwesome className="text-6xl text-orange-500/50 mx-auto mb-6 block" />
                    <h2 className="text-3xl md:text-5xl font-serif text-orange-100/90 italic mb-8">
                        &quot;Tradition is the soul. Technology is the wings.&quot;
                    </h2>
                    <p className="text-slate-400">Join us in writing Ayodhya&apos;s next chapter.</p>
                </div>
            </section>

            {/* Other Locations Nav (Consistent with footer style) */}
            <GmbUpdates locationFilter="ayodhya" />
            <OtherLocations currentLocation="ayodhya" />

            <Footer />
        </main>
    );
}
