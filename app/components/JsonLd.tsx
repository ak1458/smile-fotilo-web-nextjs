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
                "inLanguage": "en"
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
