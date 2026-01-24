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
                "@type": "FAQPage",
                "@id": "https://smilefotilo.com/#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What services do you offer?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We offer Web Design, Development, Branding, and Digital Marketing services tailored for global brands."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does a website cost?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our packages start from ₹29,999. We offer custom quotes based on project requirements."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Where are you located?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We are based in Gonda, Greater Noida, Lucknow, and Ayodhya, but we serve clients globally."
                        }
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
