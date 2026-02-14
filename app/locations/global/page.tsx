import type { Metadata } from "next";
import GlobalPageClient from "./GlobalPageClient";

export const metadata: Metadata = {
  title: "Global Web Design & Digital Marketing | Smile Fotilo",
  description:
    "World-class web design, SEO, and digital systems built in India and delivered globally. Serving enterprise clients in USA, Mexico, and worldwide.",
  alternates: {
    canonical: "/locations/global",
  },
  keywords: ["web design agency India", "international web development", "global digital marketing", "web design USA", "website developer global"],
  openGraph: {
    title: "Global Web Design & Digital Marketing | Smile Fotilo",
    description: "Built in India, delivered globally. Enterprise web design and digital marketing for international businesses.",
    type: "website",
    images: [
      {
        url: "/og?title=Global%20Services&subtitle=Built%20in%20India%2C%20Delivered%20Worldwide",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Global Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Web Design & Digital Marketing | Smile Fotilo",
    description: "Enterprise web design and digital marketing. Built in India, delivered worldwide.",
    images: ["/og?title=Global%20Services&subtitle=Built%20in%20India%2C%20Delivered%20Worldwide"],
  },
};

export default function Page() {
  return <GlobalPageClient />;
}
