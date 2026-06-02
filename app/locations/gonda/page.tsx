import type { Metadata } from "next";
import GondaPageClient from "./GondaPageClient";

export const metadata: Metadata = {
  title: "Website Designer in Gonda | Fast, Affordable Web Design — Smile Fotilo",
  description:
    "Gonda's local web studio. Custom websites, e-commerce & Google-ranking SEO from ₹6,000 — most sites go live in 2 weeks. Get a free quote on WhatsApp today.",
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
    title: "Website Designer in Gonda | Fast, Affordable Web Design — Smile Fotilo",
    description: "Custom websites, e-commerce & Google-ranking SEO from ₹6,000. Most Gonda sites live in 2 weeks.",
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
    title: "Website Designer in Gonda | Fast, Affordable Web Design — Smile Fotilo",
    description: "Custom websites & local SEO from ₹6,000. Most Gonda sites live in 2 weeks. Free quote on WhatsApp.",
    images: ["/og?title=Web%20Design%20Gonda&subtitle=Smile%20Fotilo%20HQ"],
  },
};

export default function Page() {
  return <GondaPageClient />;
}
