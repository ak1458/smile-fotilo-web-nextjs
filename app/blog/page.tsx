import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog | Smile Fotilo",
  description:
    "50+ practical guides on web design, local SEO, branding, e-commerce, and AI automation for Indian businesses — costs, checklists, and 2026 trends.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Smile Fotilo",
    description:
      "Practical guides on web design, local SEO, branding, and AI automation for growing businesses.",
    type: "website",
    url: "https://smilefotilo.com/blog",
    images: [
      {
        url: "/og?title=Smile%20Fotilo%20Blog&subtitle=Web%20Design%20%C2%B7%20SEO%20%C2%B7%20Branding%20%C2%B7%20AI",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Blog",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <BlogPageClient />
      <Footer />
    </>
  );
}
