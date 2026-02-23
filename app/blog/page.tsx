import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog | Smile Fotilo",
  description:
    "Expert insights on web design, SEO, branding, and growing your business online.",
  alternates: {
    canonical: "/blog",
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
