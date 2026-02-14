import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing | Web Design Packages from ₹15,999",
  description:
    "Transparent pricing for web design, SEO, and branding. Website packages starting from ₹15,999. Choose The Starter, The Growth, or custom enterprise solutions.",
  alternates: {
    canonical: "/pricing",
  },
  keywords: ["website pricing India", "web design cost", "website packages", "affordable web design", "web design Gonda", "SEO pricing"],
  openGraph: {
    title: "Pricing | Web Design Packages from ₹15,999 | Smile Fotilo",
    description: "Transparent website pricing. Packages from ₹15,999 with SEO, mobile optimization, and 24/7 support included.",
    type: "website",
    images: [
      {
        url: "/og?title=Website%20Pricing&subtitle=Packages%20from%20%E2%82%B915%2C999",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design Pricing from ₹15,999 | Smile Fotilo",
    description: "Transparent website pricing. Starter, Growth, and Enterprise packages for Indian businesses.",
    images: ["/og?title=Website%20Pricing&subtitle=Packages%20from%20%E2%82%B915%2C999"],
  },
};

export default function Page() {
  return <PricingPageClient />;
}
