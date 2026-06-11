import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import { StructuredData, faqSchema } from "./components/StructuredData";
import { HOME_FAQS, PRICING_FACTS } from "./data/pricing";

export const metadata: Metadata = {
  title: "Smile Fotilo | Web Development & Digital Marketing Studio",
  description: `Founder-led web development & digital marketing studio. Custom websites, e-commerce & SEO that actually rank — from ${PRICING_FACTS.websiteFrom}, most sites live in 2-4 weeks. Serving India & US businesses. Free quote on WhatsApp.`,
  keywords: [
    "Web Design Agency",
    "Digital Marketing",
    "Website Developer",
    "Branding Agency India",
    "Smile Fotilo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smile Fotilo | Web Development & Digital Marketing Studio",
    description:
      "Smile Fotilo is a web development and digital marketing studio. Custom websites for businesses in India and worldwide.",
    type: "website",
    url: "https://smilefotilo.com",
    images: [
      {
        url: "/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo - Web Design & Branding Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Fotilo | Web Development & Digital Marketing Studio",
    description:
      "Smile Fotilo is a web development and digital marketing studio. Custom websites for businesses in India and worldwide.",
    images: ["/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing"],
  },
};

export default function Page() {
  return (
    <>
      {/* Same FAQs the visitor sees on the page — keeps markup honest. */}
      <StructuredData data={faqSchema(HOME_FAQS)} />
      <HomePageClient />
    </>
  );
}
