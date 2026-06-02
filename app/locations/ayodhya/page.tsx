import type { Metadata } from "next";
import AyodhyaPageClient from "./AyodhyaPageClient";

export const metadata: Metadata = {
  title: "Website Designer in Ayodhya | Affordable Sites + Local SEO — Smile Fotilo",
  description:
    "Ayodhya businesses & tourism brands: mobile-friendly websites with local SEO from ₹6,000, live in 2 weeks. Hotels, shops & services — free quote on WhatsApp.",
  alternates: {
    canonical: "/locations/ayodhya",
  },
  keywords: [
    "website developer Ayodhya",
    "web design company Ayodhya",
    "tourism website Ayodhya",
    "SEO services Ayodhya",
    "business website Ayodhya",
    "hotel website design Ayodhya",
  ],
  openGraph: {
    title: "Website Designer in Ayodhya | Affordable Sites + Local SEO — Smile Fotilo",
    description: "Mobile-friendly websites with local SEO from ₹6,000, live in 2 weeks. For Ayodhya businesses, hotels & tourism brands.",
    type: "website",
    images: [
      {
        url: "/og?title=Web%20Design%20Ayodhya&subtitle=Tourism%20%26%20Business%20Digital%20Solutions",
        width: 1200,
        height: 630,
        alt: "Web Design in Ayodhya - Smile Fotilo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Designer in Ayodhya | Affordable Sites + Local SEO — Smile Fotilo",
    description: "Mobile-friendly websites + local SEO from ₹6,000, live in 2 weeks. For Ayodhya businesses & tourism brands.",
    images: ["/og?title=Web%20Design%20Ayodhya&subtitle=Tourism%20%26%20Business%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <AyodhyaPageClient />;
}
