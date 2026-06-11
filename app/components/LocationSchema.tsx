const ORG_ID = "https://smilefotilo.com/#organization";

const SHARED = {
    "telephone": "+91-9453878422",
    "email": "support@smilefotilo.com",
    "image": "https://smilefotilo.com/logo.png",
    "logo": "https://smilefotilo.com/logo.png",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR, USD",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "18:00"
        }
    ],
    "sameAs": [
        "https://www.instagram.com/ashrafkamal14/",
        "https://www.linkedin.com/in/ashrafkamal14/"
    ],
    "parentOrganization": { "@id": ORG_ID }
};

type Area = { "@type": string; name: string };

// A real, verified Google Business Profile storefront (physical address shown).
function storefront(opts: {
    id: string;
    name: string;
    description: string;
    url: string;
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    areas: Area[];
    hasMap?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": opts.id,
        "name": opts.name,
        "description": opts.description,
        "url": opts.url,
        ...SHARED,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": opts.streetAddress,
            "addressLocality": opts.addressLocality,
            "addressRegion": "Uttar Pradesh",
            "postalCode": opts.postalCode,
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": opts.latitude,
            "longitude": opts.longitude
        },
        "areaServed": opts.areas,
        ...(opts.hasMap ? { "hasMap": opts.hasMap } : {})
    };
}

// A service-area page with NO physical office (e.g. Lucknow, served from Gonda).
// No PostalAddress is asserted — that would be a fabricated location. Modeled as a
// Service provided by the real organization, serving the named area.
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
    // Verified storefront — Headquarters. Also the service hub for nearby towns.
    gonda: storefront({
        id: "https://smilefotilo.com/locations/gonda#business",
        name: "Smile Fotilo — Gonda (Headquarters)",
        description: "Website developer and SEO company in Gonda. We build SEO-ready websites, landing pages, e-commerce stores, and provide local SEO for Gonda and nearby districts.",
        url: "https://smilefotilo.com/locations/gonda",
        streetAddress: "KP Singh Marg, near Deewani Kacheri Chauraha, Lucknow Road, Civil Lines",
        addressLocality: "Gonda",
        postalCode: "271001",
        latitude: 27.1340,
        longitude: 81.9610,
        hasMap: "https://www.google.com/maps?cid=14436214578143247413",
        areas: [
            { "@type": "City", "name": "Gonda" },
            { "@type": "City", "name": "Colonelganj" },
            { "@type": "City", "name": "Bahraich" },
            { "@type": "City", "name": "Balrampur" },
            { "@type": "City", "name": "Barabanki" },
            { "@type": "City", "name": "Lucknow" }
        ]
    }),
    // Verified storefront — Greater Noida (NCR).
    greaterNoida: storefront({
        id: "https://smilefotilo.com/locations/greater-noida#business",
        name: "Smile Fotilo — Greater Noida",
        description: "Web design company and SEO services in Greater Noida and Noida. We develop business websites, e-commerce stores, and provide local SEO across NCR.",
        url: "https://smilefotilo.com/locations/greater-noida",
        streetAddress: "Alpha 1 Block C Market",
        addressLocality: "Greater Noida",
        postalCode: "201310",
        latitude: 28.4744,
        longitude: 77.5040,
        areas: [
            { "@type": "City", "name": "Greater Noida" },
            { "@type": "City", "name": "Noida" },
            { "@type": "Place", "name": "NCR" }
        ]
    }),
    // Verified storefront — Ayodhya.
    ayodhya: storefront({
        id: "https://smilefotilo.com/locations/ayodhya#business",
        name: "Smile Fotilo — Ayodhya",
        description: "Website developer and web design company in Ayodhya. We specialize in tourism websites, hotel website design, and local SEO services for Ayodhya and Faizabad.",
        url: "https://smilefotilo.com/locations/ayodhya",
        streetAddress: "Parikrama Marg, Ram Nagar Ghosiyana",
        addressLocality: "Ayodhya",
        postalCode: "224001",
        latitude: 26.7920,
        longitude: 82.1980,
        areas: [
            { "@type": "City", "name": "Ayodhya" },
            { "@type": "City", "name": "Faizabad" }
        ]
    }),
    // Service-area only (no office) — served from the Greater Noida studio.
    noida: areaService({
        id: "https://smilefotilo.com/locations/noida#service",
        name: "Website Development & SEO in Noida — Smile Fotilo",
        description: "Website development, e-commerce, and local SEO for Noida businesses — served from our Greater Noida studio with on-site visits across NCR.",
        url: "https://smilefotilo.com/locations/noida",
        areas: [
            { "@type": "City", "name": "Noida" },
            { "@type": "Place", "name": "Sector 62" },
            { "@type": "Place", "name": "Sector 18" },
            { "@type": "Place", "name": "NCR" }
        ]
    }),
    // Service-area only (no office) — served from the Gonda studio.
    lucknow: areaService({
        id: "https://smilefotilo.com/locations/lucknow#service",
        name: "Web Design & SEO in Lucknow — Smile Fotilo",
        description: "WordPress and custom website development, local SEO, and digital marketing for Lucknow businesses. Served from our nearby Gonda studio; on-site visits available.",
        url: "https://smilefotilo.com/locations/lucknow",
        areas: [
            { "@type": "City", "name": "Lucknow" },
            { "@type": "Place", "name": "Gomti Nagar" },
            { "@type": "Place", "name": "Hazratganj" }
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
