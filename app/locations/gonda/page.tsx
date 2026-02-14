import type { Metadata } from "next";
import GondaPageClient from "./GondaPageClient";

export const metadata: Metadata = {
  title: "Web Design & SEO in Gonda | Smile Fotilo (HQ)",
  description:
    "Smile Fotilo headquarters in Gonda, Uttar Pradesh. Premium web design, SEO, and branding services with global delivery standards.",
  alternates: {
    canonical: "/locations/gonda",
  },
  keywords: ["web design Gonda", "SEO Gonda", "website developer Gonda", "digital marketing Gonda", "Uttar Pradesh"],
  openGraph: {
    title: "Web Design & SEO in Gonda | Smile Fotilo HQ",
    description: "Headquarters of Smile Fotilo in Gonda, UP. Premium web design, SEO, and branding services delivered globally.",
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
    title: "Web Design & SEO in Gonda | Smile Fotilo HQ",
    description: "Premium web design and digital marketing from Gonda, Uttar Pradesh.",
    images: ["/og?title=Web%20Design%20Gonda&subtitle=Smile%20Fotilo%20HQ"],
  },
};

export default function Page() {
  return <GondaPageClient />;
}
