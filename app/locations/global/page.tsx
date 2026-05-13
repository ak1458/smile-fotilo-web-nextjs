import type { Metadata } from "next";
import GlobalPageClient from "./GlobalPageClient";

export const metadata: Metadata = {
  title: "Global Web Design & Digital Marketing | Smile Fotilo",
  description:
    "Web development and digital marketing services built in India, delivered to clients in the USA and worldwide.",
  alternates: {
    canonical: "/locations/global",
  },
  keywords: ["web design agency India", "international web development", "global digital marketing", "web design USA", "website developer global"],
  openGraph: {
    title: "Global Web Design & Digital Marketing | Smile Fotilo",
    description: "Web development and digital marketing built in India, delivered to clients worldwide.",
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
    description: "Web development and digital marketing. Built in India, delivered worldwide.",
    images: ["/og?title=Global%20Services&subtitle=Built%20in%20India%2C%20Delivered%20Worldwide"],
  },
};

export default function Page() {
  return <GlobalPageClient />;
}
