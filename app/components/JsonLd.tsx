export const JsonLd = () => {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://smilefotilo.com/#organization",
                "name": "Smile Fotilo",
                "url": "https://smilefotilo.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://smilefotilo.com/logo.png",
                    "width": 512,
                    "height": 512
                },
                "image": "https://smilefotilo.com/logo.png",
                "description": "Smile Fotilo is a premium creative agency specializing in Web Design, Branding, SEO, and Digital Marketing. Based in Gonda, UP, India — serving clients in Lucknow, Greater Noida, Ayodhya, USA, and globally.",
                "foundingDate": "2021",
                "founder": {
                    "@type": "Person",
                    "@id": "https://smilefotilo.com/#founder-person",
                    "name": "Ashraf Kamal"
                },
                "numberOfEmployees": {
                    "@type": "QuantitativeValue",
                    "minValue": 5,
                    "maxValue": 15
                },
                "sameAs": [
                    "https://www.instagram.com/ashrafkamal14/",
                    "https://www.linkedin.com/in/ashrafkamal14/",
                    "https://www.facebook.com/smilefotilo",
                    "https://twitter.com/ashrafkamal14"
                ],
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": "+91-9453878422",
                        "contactType": "customer service",
                        "areaServed": ["IN", "US", "MX", "GB", "AE"],
                        "availableLanguage": ["en", "hi"],
                        "contactOption": "TollFree"
                    },
                    {
                        "@type": "ContactPoint",
                        "telephone": "+91-9453878422",
                        "contactType": "sales",
                        "email": "ashrafkamal1458@gmail.com",
                        "areaServed": ["IN", "US"],
                        "availableLanguage": ["en", "hi"]
                    }
                ],
                "knowsAbout": [
                    "Web Design", "Web Development", "Search Engine Optimization",
                    "Generative Engine Optimization", "Digital Marketing",
                    "Brand Identity Design", "E-Commerce Development",
                    "WordPress Development", "Next.js Development",
                    "Local SEO", "Google Ads", "Product Photography"
                ],
                "slogan": "World-Class Digital Experiences, Built in India",
                "award": "100+ Websites Delivered Globally"
            },
            {
                "@type": "WebSite",
                "@id": "https://smilefotilo.com/#website",
                "url": "https://smilefotilo.com",
                "name": "Smile Fotilo",
                "description": "Premium creative agency specializing in Web Design, Branding, and Digital Marketing — serving India and global clients",
                "publisher": {
                    "@id": "https://smilefotilo.com/#organization"
                },
                "inLanguage": "en",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://smilefotilo.com/?s={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            // Primary LocalBusiness — Gonda HQ (ProfessionalService for richer results)
            {
                "@type": ["ProfessionalService", "LocalBusiness"],
                "@id": "https://smilefotilo.com/#localbusiness-gonda",
                "name": "Smile Fotilo — Web Design Agency Gonda",
                "image": "https://smilefotilo.com/logo.png",
                "url": "https://smilefotilo.com/locations/gonda",
                "telephone": "+91-9453878422",
                "email": "ashrafkamal1458@gmail.com",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Gonda",
                    "addressLocality": "Gonda",
                    "addressRegion": "Uttar Pradesh",
                    "postalCode": "271001",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 27.1300,
                    "longitude": 81.9600
                },
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        "opens": "09:00",
                        "closes": "18:00"
                    }
                ],
                "areaServed": [
                    { "@type": "City", "name": "Gonda" },
                    { "@type": "City", "name": "Lucknow" },
                    { "@type": "City", "name": "Greater Noida" },
                    { "@type": "City", "name": "Ayodhya" },
                    { "@type": "State", "name": "Uttar Pradesh" },
                    { "@type": "Country", "name": "India" },
                    { "@type": "Country", "name": "United States" },
                    { "@type": "Country", "name": "Mexico" }
                ],
                "priceRange": "₹15,000 — ₹5,00,000",
                "currenciesAccepted": "INR, USD",
                "paymentAccepted": "UPI, Bank Transfer, PayPal, Credit Card",
                "isAccessibleForFree": false,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Web Design & Digital Marketing Services",
                    "itemListElement": [
                        {
                            "@type": "OfferCatalog",
                            "name": "Website Design Packages",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "name": "The Starter — Business Website",
                                    "description": "Professional website for doctors, clinics, or small shops. Includes mobile optimization, basic SEO, SSL, and 24/7 support.",
                                    "price": "15000",
                                    "priceCurrency": "INR",
                                    "priceValidUntil": "2026-12-31",
                                    "availability": "https://schema.org/InStock",
                                    "url": "https://smilefotilo.com/pricing"
                                },
                                {
                                    "@type": "Offer",
                                    "name": "The Growth — E-Commerce Website",
                                    "description": "Full e-commerce website for retail brands ready to sell online. Payment integration, inventory management, and advanced SEO.",
                                    "price": "35000",
                                    "priceCurrency": "INR",
                                    "priceValidUntil": "2026-12-31",
                                    "availability": "https://schema.org/InStock",
                                    "url": "https://smilefotilo.com/pricing"
                                },
                                {
                                    "@type": "Offer",
                                    "name": "The Domination — Enterprise Solution",
                                    "description": "Full-stack custom solution with CRM, POS, mobile apps, and dedicated support team.",
                                    "priceCurrency": "INR",
                                    "availability": "https://schema.org/InStock",
                                    "url": "https://smilefotilo.com/pricing"
                                }
                            ]
                        },
                        {
                            "@type": "OfferCatalog",
                            "name": "SEO & Digital Marketing",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "name": "Local SEO Package",
                                    "description": "Google Business Profile optimization, local citations, and location-specific content for cities like Lucknow, Gonda, and Greater Noida.",
                                    "price": "9999",
                                    "priceCurrency": "INR",
                                    "priceValidUntil": "2026-12-31",
                                    "url": "https://smilefotilo.com/services/seo"
                                }
                            ]
                        },
                        {
                            "@type": "OfferCatalog",
                            "name": "Branding & Creative",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "name": "Logo Design",
                                    "description": "3 concepts, 2 revisions, all vector files. Memorable logos for startups and established businesses.",
                                    "price": "7999",
                                    "priceCurrency": "INR",
                                    "priceValidUntil": "2026-12-31",
                                    "url": "https://smilefotilo.com/services/branding"
                                }
                            ]
                        }
                    ]
                }
            },
            // Lucknow Location
            {
                "@type": ["ProfessionalService", "LocalBusiness"],
                "@id": "https://smilefotilo.com/#localbusiness-lucknow",
                "name": "Smile Fotilo — Web Design Lucknow",
                "url": "https://smilefotilo.com/locations/lucknow",
                "telephone": "+91-9453878422",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Lucknow",
                    "addressRegion": "Uttar Pradesh",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 26.8467,
                    "longitude": 80.9462
                },
                "areaServed": [
                    { "@type": "City", "name": "Lucknow" },
                    { "@type": "City", "name": "Hazratganj" },
                    { "@type": "City", "name": "Gomti Nagar" }
                ],
                "priceRange": "₹₹",
                "parentOrganization": { "@id": "https://smilefotilo.com/#organization" }
            },
            // Greater Noida Location
            {
                "@type": ["ProfessionalService", "LocalBusiness"],
                "@id": "https://smilefotilo.com/#localbusiness-greaternoida",
                "name": "Smile Fotilo — Web Design Greater Noida",
                "url": "https://smilefotilo.com/locations/greater-noida",
                "telephone": "+91-9453878422",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Greater Noida",
                    "addressRegion": "Uttar Pradesh",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 28.4744,
                    "longitude": 77.5040
                },
                "areaServed": [
                    { "@type": "City", "name": "Greater Noida" },
                    { "@type": "City", "name": "Noida" },
                    { "@type": "City", "name": "NCR" }
                ],
                "priceRange": "₹₹",
                "parentOrganization": { "@id": "https://smilefotilo.com/#organization" }
            },
            // Ayodhya Location
            {
                "@type": ["ProfessionalService", "LocalBusiness"],
                "@id": "https://smilefotilo.com/#localbusiness-ayodhya",
                "name": "Smile Fotilo — Web Design Ayodhya",
                "url": "https://smilefotilo.com/locations/ayodhya",
                "telephone": "+91-9453878422",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Ayodhya",
                    "addressRegion": "Uttar Pradesh",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 26.7922,
                    "longitude": 82.1998
                },
                "areaServed": [
                    { "@type": "City", "name": "Ayodhya" },
                    { "@type": "City", "name": "Faizabad" }
                ],
                "priceRange": "₹₹",
                "parentOrganization": { "@id": "https://smilefotilo.com/#organization" }
            },
            // Services
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-webdesign",
                "serviceType": "Web Design & Development",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "Custom website design and development starting ₹15,999. We build WordPress, WooCommerce, and Next.js websites with mobile-first design, SEO optimization, and 24/7 support. Delivery in 2-3 weeks.",
                "areaServed": ["IN", "US", "MX"],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Web Design Packages",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "name": "Business Website",
                            "price": "15000",
                            "priceCurrency": "INR"
                        },
                        {
                            "@type": "Offer",
                            "name": "E-Commerce Website",
                            "price": "35000",
                            "priceCurrency": "INR"
                        }
                    ]
                },
                "url": "https://smilefotilo.com/services/web-design"
            },
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-seo",
                "serviceType": "SEO & Generative Engine Optimization (GEO)",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "Search engine optimization and GEO services starting ₹9,999/month. We optimize for Zero Position, AI Overviews, Featured Snippets, and traditional Google rankings. Local SEO for Lucknow, Gonda, Greater Noida, and Ayodhya.",
                "areaServed": ["IN", "US", "MX"],
                "url": "https://smilefotilo.com/services/seo"
            },
            {
                "@type": "Service",
                "@id": "https://smilefotilo.com/#service-branding",
                "serviceType": "Brand Identity & Logo Design",
                "provider": { "@id": "https://smilefotilo.com/#organization" },
                "description": "Professional logo design starting ₹7,999 and complete brand identity systems from ₹25,000. Includes 3 concepts, 2 revision rounds, and all vector files. 2-4 week delivery.",
                "areaServed": ["IN", "US", "MX"],
                "url": "https://smilefotilo.com/services/branding"
            },
            // BreadcrumbList
            {
                "@type": "BreadcrumbList",
                "@id": "https://smilefotilo.com/#breadcrumb",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smilefotilo.com" },
                    { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://smilefotilo.com/services" },
                    { "@type": "ListItem", "position": 3, "name": "Work", "item": "https://smilefotilo.com/work" },
                    { "@type": "ListItem", "position": 4, "name": "Pricing", "item": "https://smilefotilo.com/pricing" },
                    { "@type": "ListItem", "position": 5, "name": "Blog", "item": "https://smilefotilo.com/blog" },
                    { "@type": "ListItem", "position": 6, "name": "Locations", "item": "https://smilefotilo.com/locations" },
                    { "@type": "ListItem", "position": 7, "name": "About", "item": "https://smilefotilo.com/about" },
                    { "@type": "ListItem", "position": 8, "name": "Contact", "item": "https://smilefotilo.com/#contact" }
                ]
            },
            // FAQPage
            {
                "@type": "FAQPage",
                "@id": "https://smilefotilo.com/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What services does Smile Fotilo offer?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Smile Fotilo offers Web Design & Development (starting ₹15,999), Search Engine Optimization & GEO (starting ₹9,999/month), Brand Identity & Logo Design (starting ₹7,999), and Product Photography services. We serve businesses in Gonda, Lucknow, Greater Noida, Ayodhya, and international clients in USA and Mexico."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does a website cost in India?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Website costs at Smile Fotilo: The Starter package (business website) is ₹15,000, The Growth package (e-commerce) starts at ₹35,000, and The Domination (enterprise) is custom-quoted. All packages include mobile optimization, basic SEO, SSL security, and 24/7 support."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where is Smile Fotilo located?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Smile Fotilo is headquartered in Gonda, Uttar Pradesh, India. We also serve clients in Greater Noida (NCR), Lucknow (Hazratganj, Gomti Nagar), Ayodhya, and internationally in Texas (USA) and Mexico City."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does it take to build a website?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Standard business websites take 2-3 weeks. E-commerce sites with inventory management take 4-6 weeks. Complex web applications and enterprise systems take 8-12 weeks. We provide detailed timelines during the free strategy call."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you provide ongoing support after website launch?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, Smile Fotilo provides 24/7 dedicated support for all clients. This includes website maintenance, security updates, performance optimization, content updates, and ongoing SEO improvements. Managed hosting with 99.9% uptime is available from ₹2,999/year."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is GEO (Generative Engine Optimization)?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "GEO is the practice of optimizing content so AI models like Google Gemini, ChatGPT, and Bing Copilot cite your brand as a trusted source. While traditional SEO helps humans find your website through search results, GEO ensures AI treats your brand as an authoritative entity worth citing in AI-generated answers."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you work with international clients?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! Smile Fotilo proudly serves enterprise clients in Texas (USA), Mexico City, and across Asia. We are comfortable with timezone differences and communicate via Zoom, Slack, WhatsApp, and email. Our pricing for international clients starts at $499 for business websites."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is the best web design agency in Gonda?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Smile Fotilo is the leading web design agency headquartered in Gonda, Uttar Pradesh. Founded by Ashraf Kamal, with 5+ years of experience and 100+ websites delivered globally, Smile Fotilo offers premium web design, SEO, and branding services at affordable prices starting from ₹15,000."
                        }
                    }
                ]
            },
            // AggregateRating
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
            // Reviews
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review1",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": { "@type": "Organization", "name": "Kapda Factory" },
                "datePublished": "2024-12-15",
                "reviewBody": "Our WordPress e-commerce store for men's fashion with custom stitching services has been a game-changer. The payment tracking and delivery management features work flawlessly.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review2",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": { "@type": "Organization", "name": "OrderFlow Logistics" },
                "datePublished": "2024-11-20",
                "reviewBody": "The real-time GPS tracking system and driver mobile app they built has streamlined our entire delivery operation. The hub dashboard on Android tablets is exactly what we needed.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review3",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": { "@type": "Organization", "name": "Veloria Vault" },
                "datePublished": "2024-10-10",
                "reviewBody": "Our luxury handbag WooCommerce store looks stunning. The high-quality product gallery and seamless checkout experience have significantly boosted our online sales.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review4",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": { "@type": "Organization", "name": "Curbit (USA)" },
                "datePublished": "2024-09-05",
                "reviewBody": "Professional Next.js website that perfectly represents our smart city curb management services. The booking system and customer portal work seamlessly across all devices.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
            },
            {
                "@type": "Review",
                "@id": "https://smilefotilo.com/#review5",
                "itemReviewed": { "@id": "https://smilefotilo.com/#organization" },
                "author": { "@type": "Organization", "name": "PulseKart Pharmacy" },
                "datePublished": "2024-08-15",
                "reviewBody": "The pharmacy POS system handles inventory tracking, prescription management, and GST-compliant billing perfectly. Multi-store support from a single dashboard has transformed our operations.",
                "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" }
            },
            // HowTo
            {
                "@type": "HowTo",
                "@id": "https://smilefotilo.com/#howto-getstarted",
                "name": "How to Get a Website Built by Smile Fotilo",
                "description": "Simple 4-step process to start your web design, branding, or SEO project with Smile Fotilo",
                "totalTime": "PT48H",
                "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "INR",
                    "value": "15000"
                },
                "step": [
                    {
                        "@type": "HowToStep",
                        "position": 1,
                        "name": "Book a Free Consultation",
                        "text": "Schedule a 30-minute strategy call to discuss your project goals, target audience, and requirements. Call +91-9453878422 or fill out the contact form.",
                        "url": "https://smilefotilo.com/#contact"
                    },
                    {
                        "@type": "HowToStep",
                        "position": 2,
                        "name": "Receive Your Proposal",
                        "text": "Within 48 hours, receive a detailed proposal including wireframes, timeline, technology stack, pricing breakdown, and deliverables.",
                        "url": "https://smilefotilo.com/pricing"
                    },
                    {
                        "@type": "HowToStep",
                        "position": 3,
                        "name": "Approve & Start Development",
                        "text": "Once approved, our team begins development immediately with daily progress updates via WhatsApp and weekly review calls."
                    },
                    {
                        "@type": "HowToStep",
                        "position": 4,
                        "name": "Review, Launch & Grow",
                        "text": "Review your project, request unlimited revisions on the design, and launch when 100% satisfied. Post-launch support included."
                    }
                ]
            },
            // WebPage
            {
                "@type": "WebPage",
                "@id": "https://smilefotilo.com/#webpage",
                "url": "https://smilefotilo.com",
                "name": "Smile Fotilo — Web Design, SEO & Branding Agency in India",
                "isPartOf": { "@id": "https://smilefotilo.com/#website" },
                "about": { "@id": "https://smilefotilo.com/#organization" },
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": ["h1", "h2", ".hero-text", ".lead-answer", ".sr-only"]
                },
                "datePublished": "2024-01-01",
                "dateModified": "2026-02-14",
                "inLanguage": "en",
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://smilefotilo.com/logo.png"
                }
            },
            // ProfilePage / Founder
            {
                "@type": "ProfilePage",
                "@id": "https://smilefotilo.com/#founder",
                "mainEntity": {
                    "@type": "Person",
                    "@id": "https://smilefotilo.com/#founder-person",
                    "name": "Ashraf Kamal",
                    "jobTitle": "Founder & Creative Director",
                    "worksFor": { "@id": "https://smilefotilo.com/#organization" },
                    "sameAs": [
                        "https://www.linkedin.com/in/ashrafkamal14/",
                        "https://www.instagram.com/ashrafkamal14/",
                        "https://twitter.com/ashrafkamal14"
                    ],
                    "knowsAbout": [
                        "Web Design", "SEO", "GEO (Generative Engine Optimization)",
                        "Digital Marketing", "Brand Identity", "React", "Next.js",
                        "WordPress", "E-Commerce", "UI/UX Design"
                    ],
                    "alumniOf": {
                        "@type": "Organization",
                        "name": "Self-taught Developer & Designer"
                    },
                    "description": "Ashraf Kamal is the founder of Smile Fotilo, a premium web design and digital marketing agency in Gonda, UP. With 5+ years of experience, he has delivered 100+ websites for businesses across India, USA, and Mexico. He specializes in modern web technologies (React, Next.js), SEO, and Generative Engine Optimization (GEO).",
                    "nationality": {
                        "@type": "Country",
                        "name": "India"
                    }
                }
            },
            // ItemList — Services (for Google to show as a list)
            {
                "@type": "ItemList",
                "@id": "https://smilefotilo.com/#services-list",
                "name": "Smile Fotilo Services",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Web Design & Development",
                        "url": "https://smilefotilo.com/services/web-design"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "SEO & GEO Optimization",
                        "url": "https://smilefotilo.com/services/seo"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Brand Identity & Logo Design",
                        "url": "https://smilefotilo.com/services/branding"
                    }
                ]
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
