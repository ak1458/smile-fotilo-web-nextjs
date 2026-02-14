import type { Metadata } from "next";
import LucknowPageClient from "./LucknowPageClient";

export const metadata: Metadata = {
  title: "Web Design & SEO in Lucknow | Smile Fotilo",
  description:
    "Web design, local SEO, and digital marketing services in Lucknow. We help businesses in Hazratganj, Gomti Nagar, and beyond grow online.",
  alternates: {
    canonical: "/locations/lucknow",
  },
  keywords: ["web design Lucknow", "SEO Lucknow", "website developer Lucknow", "digital marketing Lucknow", "Gomti Nagar", "Hazratganj"],
  openGraph: {
    title: "Web Design & SEO in Lucknow | Smile Fotilo",
    description: "Professional web design, SEO, and digital marketing for Lucknow businesses. Serving Hazratganj, Gomti Nagar, and all of Lucknow.",
    type: "website",
    images: [
      {
        url: "/og?title=Web%20Design%20Lucknow&subtitle=SEO%20%26%20Digital%20Marketing",
        width: 1200,
        height: 630,
        alt: "Web Design in Lucknow - Smile Fotilo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design & SEO in Lucknow | Smile Fotilo",
    description: "Premium web design and SEO services for Lucknow businesses.",
    images: ["/og?title=Web%20Design%20Lucknow&subtitle=SEO%20%26%20Digital%20Marketing"],
  },
};

export default function Page() {
  return <LucknowPageClient />;
}
