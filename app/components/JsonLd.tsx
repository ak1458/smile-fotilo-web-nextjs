export const JsonLd = () => {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://smilefotilo.com/#organization",
                "name": "Smile Fotilo",
                "url": "https://smilefotilo.com",
                "logo": "https://smilefotilo.com/logo.png",
                "sameAs": [
                    "https://www.instagram.com/ashrafkamal14/",
                    "https://www.linkedin.com/in/ashrafkamal14/",
                    "https://www.facebook.com/smilefotilo"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-9453878422",
                    "contactType": "customer service",
                    "areaServed": ["IN", "US", "GB", "AE"],
                    "availableLanguage": ["en", "hi"]
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://smilefotilo.com/#website",
                "url": "https://smilefotilo.com",
                "name": "Smile Fotilo",
                "description": "Premium creative agency specializing in Web Design, Branding, and Digital Marketing",
                "publisher": {
                    "@id": "https://smilefotilo.com/#organization"
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://smilefotilo.com/?s={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "LocalBusiness",
                "@id": "https://smilefotilo.com/#localbusiness",
                "name": "Smile Fotilo",
                "image": "https://smilefotilo.com/logo.png",
                "url": "https://smilefotilo.com",
                "telephone": "+91-9453878422",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Gonda",
                    "addressRegion": "Uttar Pradesh",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 27.1300,
                    "longitude": 81.9600
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday"
                    ],
                    "opens": "09:00",
                    "closes": "18:00"
                },
                "areaServed": [
                    { "@type": "City", "name": "Gonda" },
                    { "@type": "City", "name": "Lucknow" },
                    { "@type": "City", "name": "Greater Noida" },
                    { "@type": "City", "name": "Ayodhya" }
                ],
                "priceRange": "₹₹"
            },
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-webdesign",
                "serviceType": "Web Design & Development",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "Fast, secure, and SEO-optimized websites on WordPress & Custom Stacks",
                "areaServed": ["IN", "US", "MX"]
            },
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-seo",
                "serviceType": "Digital Marketing & SEO",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "Data-driven SEO and Google Ads strategies that drive customer acquisition"
            },
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-branding",
                "serviceType": "Brand Identity & Creative Studio",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "High-end product photography and brand identity design for luxury brands"
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://smilefotilo.com/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://smilefotilo.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Services",
                        "item": "https://smilefotilo.com/#services"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Work",
                        "item": "https://smilefotilo.com/work"
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": "Contact",
                        "item": "https://smilefotilo.com/#contact"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://smilefotilo.com/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What services does Smile Fotilo offer?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We offer Web Design & Development, Digital Marketing & SEO, Brand Identity Design, and Product Photography services tailored for global brands."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does a website cost?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our website packages start from ₹15,999. We offer The Starter (₹15k), The Growth (₹35k+), and custom enterprise solutions based on project requirements."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where is Smile Fotilo located?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We are headquartered in Gonda, Uttar Pradesh, India. We also serve clients in Greater Noida, Lucknow, Ayodhya, and internationally in Texas (USA) and Mexico."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does it take to build a website?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Typical websites take 2-4 weeks from concept to launch. Complex projects with custom features may take 4-8 weeks. We provide detailed timelines during the strategy call."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you provide ongoing support after launch?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, we provide 24/7 dedicated support for all our clients. This includes website maintenance, security updates, and ongoing optimization services."
                        }
                    }
                ]
            },
            {
                "@type": "AggregateRating",
                "@id": "https://smilefotilo.com/#aggregaterating",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "ratingValue": "4.9",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "47",
                "reviewCount": "32"
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review1",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": {
                    "@type": "Organization",
                    "name": "Kapda Factory"
                },
                "datePublished": "2024-12-15",
                "reviewBody": "Our WordPress e-commerce store for men's fashion with custom stitching services has been a game-changer. The payment tracking and delivery management features work flawlessly.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review2",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": {
                    "@type": "Organization",
                    "name": "OrderFlow Logistics"
                },
                "datePublished": "2024-11-20",
                "reviewBody": "The real-time GPS tracking system and driver mobile app they built has streamlined our entire delivery operation. The hub dashboard on Android tablets is exactly what we needed.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review3",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": {
                    "@type": "Organization",
                    "name": "Veloria Vault"
                },
                "datePublished": "2024-10-10",
                "reviewBody": "Our luxury handbag WooCommerce store looks stunning. The high-quality product gallery and seamless checkout experience have significantly boosted our online sales.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review4",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": {
                    "@type": "Organization",
                    "name": "Curbit (USA)"
                },
                "datePublished": "2024-09-05",
                "reviewBody": "Professional Next.js website that perfectly represents our smart city curb management services. The booking system and customer portal work seamlessly across all devices.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review5",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": {
                    "@type": "Organization",
                    "name": "PulseKart Pharmacy"
                },
                "datePublished": "2024-08-15",
                "reviewBody": "The pharmacy POS system handles inventory tracking, prescription management, and GST-compliant billing perfectly. Multi-store support from a single dashboard has transformed our operations.",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                }
            },
            {
                "@type": "HowTo",
                "@id": "https://smilefotilo.com/#howto-getstarted",
                "name": "How to Get Started with Smile Fotilo",
                "description": "Simple steps to start your web design, branding, or SEO project with us",
                "totalTime": "PT48H",
                "step": [
                    {
                        "@type": "HowToStep",
                        "position": 1,
                        "name": "Book a Free Consultation",
                        "text": "Schedule a 30-minute strategy call to discuss your project goals and requirements"
                    },
                    {
                        "@type": "HowToStep",
                        "position": 2,
                        "name": "Receive Your Proposal",
                        "text": "Within 48 hours, you'll receive a detailed proposal with timeline, pricing, and deliverables"
                    },
                    {
                        "@type": "HowToStep",
                        "position": 3,
                        "name": "Approve & Start",
                        "text": "Once approved, we begin work immediately with regular progress updates"
                    },
                    {
                        "@type": "HowToStep",
                        "position": 4,
                        "name": "Review & Launch",
                        "text": "Review your project, request revisions, and launch when you're 100% satisfied"
                    }
                ]
            },
            {
                "@type": "WebPage",
                "@id": "https://smilefotilo.com/#webpage",
                "url": "https://smilefotilo.com",
                "name": "Smile Fotilo - Premium Web Design & Digital Marketing Agency",
                "isPartOf": { "@id": "https://smilefotilo.com/#website" },
                "about": { "@id": "https://smilefotilo.com/#organization" },
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": ["h1", "h2", ".hero-text", ".lead-answer"]
                },
                "datePublished": "2024-01-01",
                "dateModified": "2026-01-24"
            },
            {
                "@type": "ProfilePage",
                "@id": "https://smilefotilo.com/#founder",
                "mainEntity": {
                    "@type": "Person",
                    "name": "Ashraf Kamal",
                    "jobTitle": "Founder & Creative Director",
                    "worksFor": { "@id": "https://smilefotilo.com/#organization" },
                    "sameAs": [
                        "https://www.linkedin.com/in/ashrafkamal14/",
                        "https://www.instagram.com/ashrafkamal14/"
                    ],
                    "knowsAbout": [
                        "Web Design",
                        "SEO",
                        "GEO (Generative Engine Optimization)",
                        "Digital Marketing",
                        "Brand Identity",
                        "React",
                        "Next.js"
                    ],
                    "description": "Ashraf Kamal is the founder of Smile Fotilo with 5+ years of experience in web design and digital marketing. He has helped 100+ businesses across India establish their digital presence."
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
    );
};

