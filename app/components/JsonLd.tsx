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
                "description": "Smile Fotilo is a premium digital agency for web design, branding, SEO, and AI-led growth systems.",
                "email": "ashrafkamal1458@gmail.com",
                "telephone": "+91-9453878422",
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
                        "email": "ashrafkamal1458@gmail.com",
                        "contactType": "sales",
                        "areaServed": ["IN", "US", "MX"],
                        "availableLanguage": ["en", "hi"]
                    }
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://smilefotilo.com/#website",
                "url": "https://smilefotilo.com",
                "name": "Smile Fotilo",
                "description": "Smile Fotilo website for premium web design, branding, SEO, and AI business systems.",
                "publisher": {
                    "@id": "https://smilefotilo.com/#organization"
                },
                "inLanguage": "en",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://smilefotilo.com/blog?search={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "ItemList",
                "@id": "https://smilefotilo.com/#core-services",
                "name": "Smile Fotilo core services",
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
                        "name": "SEO & GEO Services",
                        "url": "https://smilefotilo.com/services/seo"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Brand Identity & Creative",
                        "url": "https://smilefotilo.com/services/branding"
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": "AI Growth OS",
                        "url": "https://smilefotilo.com/services/ai-growth-os"
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
