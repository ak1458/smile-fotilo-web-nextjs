import type { Metadata } from "next";
import PricingPageClient from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing | Web Design + Clinic Growth Plans",
  description:
    "Transparent pricing for web design, SEO, branding, and clinic automation. Choose Starter, Growth, Growth Autopilot, or enterprise plans.",
  alternates: {
    canonical: "/pricing",
  },
  keywords: [
    "website pricing India",
    "web design cost",
    "website packages",
    "affordable web design",
    "web design Gonda",
    "SEO pricing",
    "clinic automation pricing",
  ],
  openGraph: {
    title: "Pricing | Web Design + Clinic Growth Plans | Smile Fotilo",
    description:
      "Transparent pricing for web design and Growth Autopilot automation with SEO and support.",
    type: "website",
    images: [
      {
        url: "/og?title=Website%20Pricing&subtitle=Web%20Design%20and%20AI%20Growth",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Design + Clinic Growth Pricing | Smile Fotilo",
    description:
      "Transparent pricing for Starter, Growth, Growth Autopilot, and enterprise packages.",
    images: ["/og?title=Website%20Pricing&subtitle=Web%20Design%20and%20AI%20Growth"],
  },
};

export default function Page() {
  return <PricingPageClient />;
}
