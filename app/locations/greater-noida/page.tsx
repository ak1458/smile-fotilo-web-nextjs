import type { Metadata } from "next";
import GreaterNoidaPageClient from "./GreaterNoidaPageClient";

export const metadata: Metadata = {
  title: "Web Designers in Greater Noida & Noida | Websites + Local SEO",
  description:
    "Greater Noida & Noida businesses: get a fast, mobile-first website with local SEO that ranks on Google. E-commerce, landing pages & lead systems — free site audit.",
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
    title: "Web Designers in Greater Noida & Noida | Websites + Local SEO — Smile Fotilo",
    description: "Fast, mobile-first websites with local SEO that ranks on Google. E-commerce, landing pages & lead systems for Greater Noida & NCR.",
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
    title: "Web Designers in Greater Noida & Noida | Websites + Local SEO — Smile Fotilo",
    description: "Fast, mobile-first websites with local SEO that ranks on Google. For Greater Noida, Noida & NCR businesses. Free site audit.",
    images: ["/og?title=Web%20Design%20Greater%20Noida&subtitle=NCR%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <GreaterNoidaPageClient />;
}
