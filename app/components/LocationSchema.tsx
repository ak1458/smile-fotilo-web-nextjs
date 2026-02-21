// Location-specific schema data for LocalBusiness markup
export const locationSchemas = {
    gonda: {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://smilefotilo.com/locations/gonda#business",
        "name": "Smile Fotilo - Gonda (Headquarters)",
        "description": "Top-rated digital agency in Gonda offering web design, SEO, and branding. Specializing in high-performance websites and local SEO dominance.",
        "url": "https://smilefotilo.com/locations/gonda",
        "hasMap": "https://www.google.com/maps?cid=14436214578143247413", // Hypothetical CID based on maps search pattern
        "telephone": "+91-9453878422",
        "email": "hello@smilefotilo.com",
        "image": "https://smilefotilo.com/logo.png",
        "priceRange": "₹₹",
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
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "18:00"
        },
        "areaServed": [
            { "@type": "City", "name": "Gonda" },
            { "@type": "State", "name": "Uttar Pradesh" }
        ],
        "sameAs": [
            "https://www.instagram.com/ashrafkamal14/",
            "https://www.linkedin.com/in/ashrafkamal14/"
        ]
    },
    lucknow: {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://smilefotilo.com/locations/lucknow#business",
        "name": "Smile Fotilo - Lucknow",
        "description": "Expert web design and E-commerce services in Lucknow. Dominating local search with premium SEO, branding, and custom web development for Hazratganj & Gomti Nagar.",
        "url": "https://smilefotilo.com/locations/lucknow",
        "telephone": "+91-9453878422",
        "email": "hello@smilefotilo.com",
        "image": "https://smilefotilo.com/logo.png",
        "priceRange": "₹₹",
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
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://smilefotilo.com/locations/greater-noida#business",
        "name": "Smile Fotilo - Greater Noida",
        "description": "Leading web development and 'smile e-commerce services' in Noida. High-performance digital solutions for NCR tech startups and corporates.",
        "url": "https://smilefotilo.com/locations/greater-noida",
        "hasMap": "https://www.google.com/maps/search/Smile+Fotilo+Greater+Noida",
        "telephone": "+91-9453878422",
        "email": "hello@smilefotilo.com",
        "image": "https://smilefotilo.com/logo.png",
        "priceRange": "₹₹",
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
            { "@type": "Place", "name": "NCR" }
        ]
    },
    ayodhya: {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://smilefotilo.com/locations/ayodhya#business",
        "name": "Smile Fotilo - Ayodhya",
        "description": "Digital services for Ayodhya's growing tourism and spiritual business ecosystem. Web design for temples, hotels, and local commerce.",
        "url": "https://smilefotilo.com/locations/ayodhya",
        "telephone": "+91-9453878422",
        "email": "hello@smilefotilo.com",
        "image": "https://smilefotilo.com/logo.png",
        "priceRange": "₹₹",
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
};

// Component to render location schema
export function LocationSchema({ location }: { location: keyof typeof locationSchemas }) {
    const schema = locationSchemas[location];
    if (!schema) return null;

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
