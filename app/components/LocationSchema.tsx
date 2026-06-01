const ORG_ID = "https://smilefotilo.com/#organization";

// The ONE real physical location (HQ). NAP matches the Google Business Profile exactly.
const gondaBusiness = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": "https://smilefotilo.com/locations/gonda#business",
    "name": "Smile Fotilo",
    "description": "Website developer and SEO company in Gonda. We build SEO-ready websites, landing pages, e-commerce stores, and provide local SEO for Gonda businesses.",
    "url": "https://smilefotilo.com/locations/gonda",
    "telephone": "+91-9453878422",
    "email": "support@smilefotilo.com",
    "image": "https://smilefotilo.com/logo.png",
    "logo": "https://smilefotilo.com/logo.png",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR, USD",
    "hasMap": "https://www.google.com/maps?cid=14436214578143247413",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "KP Singh Marg, near Deewani Kacheri Chauraha, Civil Line",
        "addressLocality": "Gonda",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "271001",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 27.13,
        "longitude": 81.96
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
        { "@type": "State", "name": "Uttar Pradesh" }
    ],
    "sameAs": [
        "https://www.instagram.com/ashrafkamal14/",
        "https://www.linkedin.com/in/ashrafkamal14/"
    ],
    "parentOrganization": { "@id": ORG_ID }
};

// Service-area pages: no physical office in these cities, so we DO NOT assert a
// LocalBusiness with a fabricated address (that risks Google demotion). We model
// them as a Service provided by the real Gonda business, serving the named area.
type Area = { "@type": string; name: string };
function areaService(opts: {
    id: string;
    name: string;
    description: string;
    url: string;
    areas: Area[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": opts.id,
        "name": opts.name,
        "description": opts.description,
        "url": opts.url,
        "serviceType": "Web design, development & local SEO",
        "provider": {
            "@type": "Organization",
            "@id": ORG_ID,
            "name": "Smile Fotilo",
            "telephone": "+91-9453878422",
            "email": "support@smilefotilo.com"
        },
        "areaServed": opts.areas
    };
}

export const locationSchemas = {
    gonda: gondaBusiness,
    lucknow: areaService({
        id: "https://smilefotilo.com/locations/lucknow#service",
        name: "Web Design & SEO in Lucknow — Smile Fotilo",
        description: "WordPress and custom website development, local SEO, and digital marketing for Lucknow businesses. Served from our Gonda studio, on-site visits available.",
        url: "https://smilefotilo.com/locations/lucknow",
        areas: [
            { "@type": "City", "name": "Lucknow" },
            { "@type": "Place", "name": "Gomti Nagar" },
            { "@type": "Place", "name": "Hazratganj" }
        ]
    }),
    greaterNoida: areaService({
        id: "https://smilefotilo.com/locations/greater-noida#service",
        name: "Web Design & SEO in Greater Noida — Smile Fotilo",
        description: "Business websites, e-commerce stores, and local SEO for Greater Noida and Noida (NCR) businesses, delivered remotely from our Gonda studio.",
        url: "https://smilefotilo.com/locations/greater-noida",
        areas: [
            { "@type": "City", "name": "Greater Noida" },
            { "@type": "City", "name": "Noida" },
            { "@type": "Place", "name": "NCR" }
        ]
    }),
    ayodhya: areaService({
        id: "https://smilefotilo.com/locations/ayodhya#service",
        name: "Tourism & Hotel Website Design in Ayodhya — Smile Fotilo",
        description: "Tourism, hotel, and temple website design plus local SEO for Ayodhya and Faizabad businesses, delivered from our nearby Gonda studio.",
        url: "https://smilefotilo.com/locations/ayodhya",
        areas: [
            { "@type": "City", "name": "Ayodhya" },
            { "@type": "City", "name": "Faizabad" }
        ]
    })
};

export function LocationSchema({ location }: { location: keyof typeof locationSchemas }) {
    const schema = locationSchemas[location];

    if (!schema) {
        return null;
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
