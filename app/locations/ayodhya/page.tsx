import type { Metadata } from "next";
import AyodhyaPageClient from "./AyodhyaPageClient";

export const metadata: Metadata = {
  title: "Website Developer in Ayodhya for Local Businesses | Smile Fotilo",
  description:
    "Smile Fotilo builds mobile-friendly websites, SEO pages, tourism business websites, landing pages, and branding systems for Ayodhya businesses.",
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
    title: "Website Developer in Ayodhya for Local Businesses | Smile Fotilo",
    description: "Mobile-friendly websites, SEO pages, tourism business websites, and branding systems for Ayodhya businesses.",
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
    title: "Website Developer in Ayodhya for Local Businesses | Smile Fotilo",
    description: "Websites, SEO pages, and local digital systems for Ayodhya businesses.",
    images: ["/og?title=Web%20Design%20Ayodhya&subtitle=Tourism%20%26%20Business%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <AyodhyaPageClient />;
}
