import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Smile Fotilo | Web Development & Digital Marketing Studio",
  description:
    "Smile Fotilo is a web development and digital marketing studio run by Ashraf Kamal. I build custom websites using React, Next.js, and WordPress for businesses in India and worldwide.",
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
      <h1 className="sr-only">Smile Fotilo - Web Development, SEO, & Digital Marketing Studio</h1>
      <HomePageClient />
    </>
  );
}
