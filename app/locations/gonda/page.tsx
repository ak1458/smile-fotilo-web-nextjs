import type { Metadata } from "next";
import GondaPageClient from "./GondaPageClient";

export const metadata: Metadata = {
  title: "Website Developer & SEO Company in Gonda | Smile Fotilo",
  description:
    "Need a website developer in Gonda? Smile Fotilo builds SEO-ready websites, landing pages, e-commerce stores, branding, and local lead systems for Gonda businesses.",
  alternates: {
    canonical: "/locations/gonda",
  },
  keywords: [
    "website developer in Gonda",
    "web design company in Gonda",
    "SEO company in Gonda",
    "business website Gonda",
    "ecommerce website development Gonda",
    "local SEO Gonda",
  ],
  openGraph: {
    title: "Website Developer & SEO Company in Gonda | Smile Fotilo",
    description: "SEO-ready websites, landing pages, e-commerce stores, and local lead systems for Gonda businesses.",
    type: "website",
    images: [
      {
        url: "/og?title=Web%20Design%20Gonda&subtitle=Smile%20Fotilo%20HQ",
        width: 1200,
        height: 630,
        alt: "Web Design in Gonda - Smile Fotilo HQ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Developer & SEO Company in Gonda | Smile Fotilo",
    description: "SEO-ready websites and local digital growth systems for Gonda businesses.",
    images: ["/og?title=Web%20Design%20Gonda&subtitle=Smile%20Fotilo%20HQ"],
  },
};

export default function Page() {
  return <GondaPageClient />;
}
