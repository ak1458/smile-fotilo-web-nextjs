import type { Metadata } from "next";
import GreaterNoidaPageClient from "./GreaterNoidaPageClient";

export const metadata: Metadata = {
  title: "Web Design & SEO in Greater Noida / NCR | Smile Fotilo",
  description:
    "Digital solutions for startups and corporate clients in Greater Noida and NCR. Web development, SEO, and branding for high-growth teams.",
  alternates: {
    canonical: "/locations/greater-noida",
  },
  keywords: ["web design Greater Noida", "SEO Noida", "website developer NCR", "digital marketing Greater Noida", "Noida"],
  openGraph: {
    title: "Web Design & SEO in Greater Noida / NCR | Smile Fotilo",
    description: "Professional web development, SEO, and branding for tech startups and corporates in Greater Noida and NCR.",
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
    title: "Web Design & SEO in Greater Noida / NCR | Smile Fotilo",
    description: "Digital solutions for startups and corporates in Greater Noida and NCR.",
    images: ["/og?title=Web%20Design%20Greater%20Noida&subtitle=NCR%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <GreaterNoidaPageClient />;
}
