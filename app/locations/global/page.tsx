import type { Metadata } from "next";
import GlobalPageClient from "./GlobalPageClient";
import { StructuredData, serviceSchema, faqSchema } from "../../components/StructuredData";

export const metadata: Metadata = {
  title: "Web Development Agency for US Businesses | Hire Web Developers — Smile Fotilo",
  description:
    "Web development agency serving US businesses — custom websites, Shopify/WooCommerce e-commerce, React/Next.js, and SEO-optimized web design. Founder-led, fast delivery, US-friendly rates. Hire web developers without the big-agency overhead.",
  alternates: {
    canonical: "/locations/global",
  },
  keywords: [
    "web development agency USA", "hire web developers USA", "custom web development company",
    "professional website development services", "responsive web design agency", "full stack web development company",
    "WordPress development agency USA", "custom Shopify website developers", "ecommerce web development services",
    "React web development company", "small business website developers", "SEO optimized web design agency",
    "B2B website development services", "conversion focused web development", "web redesign services USA",
  ],
  openGraph: {
    title: "Web Development Agency for US Businesses | Smile Fotilo",
    description: "Custom websites, e-commerce, and SEO-optimized web design for US businesses. Founder-led, fast, US-friendly rates.",
    type: "website",
    images: [
      {
        url: "/og?title=Web%20Development%20for%20US%20Businesses&subtitle=Custom%20sites%2C%20e-commerce%20%26%20SEO",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo — Web Development for US Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Agency for US Businesses | Smile Fotilo",
    description: "Custom websites, e-commerce, and SEO-optimized web design for US businesses. Founder-led, fast, US-friendly rates.",
    images: ["/og?title=Web%20Development%20for%20US%20Businesses&subtitle=Custom%20sites%2C%20e-commerce%20%26%20SEO"],
  },
};

const usServiceSchema = serviceSchema({
  name: "Web Development & SEO for US Businesses",
  description:
    "Custom web development, e-commerce (Shopify/WooCommerce), React/Next.js builds, and SEO-optimized web design for businesses across the United States. Founder-led, fast delivery, US-friendly rates.",
  url: "https://smilefotilo.com/locations/global",
  areaServed: ["United States", "New York", "California", "Texas", "Florida", "Illinois", "Washington"],
});

const usFaqSchema = faqSchema([
  {
    question: "Do you work with clients in the United States?",
    answer:
      "Yes. I build websites and run SEO for US businesses across New York, California, Texas, Florida and nationwide — working remotely with same-day replies and US-friendly overlapping hours.",
  },
  {
    question: "How much does a website cost for a US business?",
    answer:
      "Launch sites start around $600 and e-commerce/Growth builds around $1,500+ — a fraction of typical US agency rates, founder-led with no overhead markup.",
  },
  {
    question: "What technologies do you build with?",
    answer:
      "React and Next.js for custom builds, plus WordPress/WooCommerce or Shopify for e-commerce — fast, responsive, SEO-optimized, and conversion-focused.",
  },
  {
    question: "How fast can you deliver?",
    answer: "Most business websites ship in 2–3 weeks; e-commerce stores in 4–6 weeks.",
  },
]);

export default function Page() {
  return (
    <>
      <StructuredData data={usServiceSchema} />
      <StructuredData data={usFaqSchema} />
      <GlobalPageClient />
    </>
  );
}
