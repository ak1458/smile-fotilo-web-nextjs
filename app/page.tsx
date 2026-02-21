import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Smile Fotilo | Web Design & Digital Marketing in Gonda, Lucknow & Global",
  description: "Smile Fotilo is a premium creative agency for Web Design, Branding, and SEO. Custom websites from ₹15,999. Serving Gonda, Lucknow, and global brands.",
  keywords: ["web design Gonda", "web design Lucknow", "digital marketing India", "SEO agency", "website developer", "branding agency India", "web design Greater Noida", "website cost India", "affordable web design", "Smile Fotilo"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smile Fotilo | Web Design, SEO & Branding Agency",
    description: "We build world-class websites and digital experiences. Custom web design from ₹15,999. Based in India, serving globally.",
    type: "website",
    url: "https://smilefotilo.com",
    images: [
      {
        url: "/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo - Web Design & Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Fotilo | Web Design & Digital Marketing",
    description: "Premium web design, SEO, and branding. Custom websites from ₹15,999. Global delivery.",
    images: ["/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing"],
  },
};

// Server-rendered SEO content that Google can read without JavaScript
// This text is visually hidden but provides search engines with key content
function ServerSEOContent() {
  return (
    <div className="sr-only" aria-hidden="true">
      <h2>Smile Fotilo — Web Design &amp; Digital Marketing Agency</h2>
      <p>
        Smile Fotilo is a premium creative agency specializing in Web Design,
        Branding, and Digital Marketing. We build world-class digital experiences
        for global brands. Custom websites starting at ₹15,999 with 2-3 week delivery.
      </p>
      <h2>Our Services</h2>
      <ul>
        <li>Web Development — Fast, secure, and SEO-optimized websites on WordPress &amp; Custom Stacks</li>
        <li>Digital Growth — Data-driven SEO and Google Ads strategies that bring customers</li>
        <li>Creative Studio — High-end product photography and brand identity design</li>
        <li>24/7 Support — Dedicated support team to help you grow your business</li>
      </ul>
      <h2>Pricing</h2>
      <ul>
        <li>The Starter — ₹15,000 per project, for doctors, clinics, or small shops</li>
        <li>The Growth — ₹35,000+ starting, for retail brands ready to sell online</li>
        <li>The Domination — Custom pricing, full stack solution</li>
      </ul>
      <h2>Frequently Asked Questions</h2>
      <dl>
        <dt>What services does Smile Fotilo offer?</dt>
        <dd>We offer Web Design &amp; Development, Digital Marketing &amp; SEO, Brand Identity Design, and Product Photography services tailored for global brands.</dd>
        <dt>How much does a website cost?</dt>
        <dd>Our website packages start from ₹15,999. We offer The Starter (₹15k) for small businesses, The Growth (₹35k+) for retail brands, and custom enterprise solutions.</dd>
        <dt>How long does it take to build a website?</dt>
        <dd>Typical websites take 2-4 weeks from concept to launch. Complex projects with custom features may take 4-8 weeks.</dd>
        <dt>Do you work with international clients?</dt>
        <dd>Yes! We proudly serve enterprise clients in Texas (USA), Mexico, and across India.</dd>
        <dt>What support do you provide after launch?</dt>
        <dd>We provide 24/7 dedicated support including website maintenance, security updates, performance optimization, and ongoing SEO improvements.</dd>
      </dl>
      <h2>Locations</h2>
      <p>Serving clients in Gonda (HQ), Lucknow, Greater Noida, Ayodhya, Texas (USA), and Mexico City.</p>
      <h2>Contact</h2>
      <p>Email: ashrafkamal1458@gmail.com | Phone: +91-9453878422 | Response within 24 hours.</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <ServerSEOContent />
      <HomePageClient />
    </>
  );
}
