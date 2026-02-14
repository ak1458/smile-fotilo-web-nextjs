import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work | Portfolio & Case Studies",
  description:
    "Explore our portfolio of websites and digital products — from enterprise POS systems to luxury e-commerce stores. Real results for real businesses.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Our Work | Portfolio & Case Studies | Smile Fotilo",
    description: "See our portfolio: PulseKart POS, Kapda Factory ERP, OrderFlow Logistics, and more. Real digital products built for real businesses.",
    type: "website",
    images: [
      {
        url: "/og?title=Our%20Work&subtitle=Portfolio%20%26%20Case%20Studies",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio & Case Studies | Smile Fotilo",
    description: "Enterprise systems, e-commerce stores, and digital products. Explore our best work.",
    images: ["/og?title=Our%20Work&subtitle=Portfolio%20%26%20Case%20Studies"],
  },
};

export default function Page() {
  return <WorkPageClient />;
}
