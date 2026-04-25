const sharedLocationSchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "telephone": "+91-9453878422",
    "email": "ashrafkamal1458@gmail.com",
    "image": "https://smilefotilo.com/logo.png",
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
    "parentOrganization": {
        "@id": "https://smilefotilo.com/#organization"
    }
} as const;

export const locationSchemas = {
    gonda: {
        ...sharedLocationSchema,
        "@id": "https://smilefotilo.com/locations/gonda#business",
        "name": "Smile Fotilo - Gonda (Headquarters)",
        "description": "Website developer and SEO company in Gonda. We build SEO-ready websites, landing pages, e-commerce stores, and provide local SEO for Gonda businesses.",
        "url": "https://smilefotilo.com/locations/gonda",
        "hasMap": "https://www.google.com/maps?cid=14436214578143247413",
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
            "latitude": 27.13,
            "longitude": 81.96
        },
        "areaServed": [
            { "@type": "City", "name": "Gonda" },
            { "@type": "City", "name": "Lucknow" },
            { "@type": "State", "name": "Uttar Pradesh" }
        ]
    },
    lucknow: {
        ...sharedLocationSchema,
        "@id": "https://smilefotilo.com/locations/lucknow#business",
        "name": "Smile Fotilo - Lucknow",
        "description": "Web design company and website development services in Lucknow. We offer WordPress development, local SEO, and digital marketing agency services.",
        "url": "https://smilefotilo.com/locations/lucknow",
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
            { "@type": "Place", "name": "Gomti Nagar" },
            { "@type": "Place", "name": "Hazratganj" }
        ]
    },
    greaterNoida: {
        ...sharedLocationSchema,
        "@id": "https://smilefotilo.com/locations/greater-noida#business",
        "name": "Smile Fotilo - Greater Noida",
        "description": "Web design company and SEO services in Greater Noida and Noida. We develop business websites, e-commerce stores, and provide local SEO optimization.",
        "url": "https://smilefotilo.com/locations/greater-noida",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Greater Noida",
            "addressRegion": "Uttar Pradesh",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.4744,
            "longitude": 77.504
        },
        "areaServed": [
            { "@type": "City", "name": "Greater Noida" },
            { "@type": "City", "name": "Noida" },
            { "@type": "Place", "name": "NCR" }
        ]
    },
    ayodhya: {
        ...sharedLocationSchema,
        "@id": "https://smilefotilo.com/locations/ayodhya#business",
        "name": "Smile Fotilo - Ayodhya",
        "description": "Website developer and web design company in Ayodhya. We specialize in tourism websites, hotel website design, and local SEO services.",
        "url": "https://smilefotilo.com/locations/ayodhya",
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
        ]
    }
} as const;

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
