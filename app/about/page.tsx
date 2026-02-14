import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Smile Fotilo | Creative Agency India",
  description:
    "Learn about Smile Fotilo, a premium creative agency based in India. We build high-performance websites, brands, and digital marketing systems for local and global businesses.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Smile Fotilo | Creative Agency India",
    description: "Premium creative agency in India specializing in web design, branding, and digital marketing for local and global businesses.",
    type: "website",
    images: [
      {
        url: "/og?title=About%20Smile%20Fotilo&subtitle=Creative%20Agency%20India",
        width: 1200,
        height: 630,
        alt: "About Smile Fotilo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Smile Fotilo | Creative Agency India",
    description: "Premium creative agency specializing in web design, branding, and digital marketing.",
    images: ["/og?title=About%20Smile%20Fotilo&subtitle=Creative%20Agency%20India"],
  },
};

export default function Page() {
  return <AboutPageClient />;
}
