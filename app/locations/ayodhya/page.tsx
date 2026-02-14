import type { Metadata } from "next";
import AyodhyaPageClient from "./AyodhyaPageClient";

export const metadata: Metadata = {
  title: "Web Design & SEO in Ayodhya | Smile Fotilo",
  description:
    "Web design and digital services for Ayodhya's growing tourism and local business ecosystem. Modern websites, SEO, and branding with premium execution.",
  alternates: {
    canonical: "/locations/ayodhya",
  },
  keywords: ["web design Ayodhya", "SEO Ayodhya", "website developer Ayodhya", "digital marketing Ayodhya", "tourism website"],
  openGraph: {
    title: "Web Design & SEO in Ayodhya | Smile Fotilo",
    description: "Digital services for Ayodhya's tourism and business ecosystem. Modern websites, SEO, and branding.",
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
    title: "Web Design & SEO in Ayodhya | Smile Fotilo",
    description: "Premium web design for Ayodhya's tourism and local business ecosystem.",
    images: ["/og?title=Web%20Design%20Ayodhya&subtitle=Tourism%20%26%20Business%20Digital%20Solutions"],
  },
};

export default function Page() {
  return <AyodhyaPageClient />;
}
