import type { Metadata } from "next";
import GreaterNoidaPageClient from "./GreaterNoidaPageClient";

export const metadata: Metadata = {
  title: "Web Design Company in Greater Noida & Noida | Smile Fotilo",
  description:
    "Smile Fotilo builds websites, SEO landing pages, e-commerce stores, and lead-generation systems for Greater Noida, Noida, and NCR businesses.",
  alternates: {
    canonical: "/locations/greater-noida",
  },
  keywords: [
    "web design company Greater Noida",
    "website developer Greater Noida",
    "SEO services Greater Noida",
    "website development Noida",
    "local SEO Noida",
    "business website Greater Noida",
  ],
  openGraph: {
    title: "Web Design Company in Greater Noida & Noida | Smile Fotilo",
    description: "Websites, SEO landing pages, e-commerce stores, and lead-generation systems for Greater Noida and NCR.",
    type: "website",
    images: [
      {
        url: "/og?title=Web%20Design%20Greater%20Noida&subtitle=NCR%20Digital%20Solutions",
        width: 1200,
        height: 630,
        alt: "Web Design in Greater Noida - Smile Fotilo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Company in Greater Noida & Noida | Smile Fotilo",
    description: "Websites and local SEO systems for Greater Noida, Noida, and NCR businesses.",
    images: ["/og?title=Web%20Design%20Greater%20Noida&subtitle=NCR%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <GreaterNoidaPageClient />;
}
