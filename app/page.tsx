import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Smile Fotilo | Web Design & Digital Marketing in Gonda, Lucknow & Global",
  description:
    "Smile Fotilo is a premium creative agency for Web Design, Branding, and SEO. Custom websites from INR 15,999. Serving Gonda, Lucknow, and global brands.",
  keywords: [
    "web design Gonda",
    "web design Lucknow",
    "digital marketing India",
    "SEO agency",
    "website developer",
    "branding agency India",
    "web design Greater Noida",
    "website cost India",
    "affordable web design",
    "Smile Fotilo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smile Fotilo | Web Design, SEO & Branding Agency",
    description:
      "We build world-class websites and digital experiences. Custom web design from INR 15,999. Based in India, serving globally.",
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
    description:
      "Premium web design, SEO, and branding. Custom websites from INR 15,999. Global delivery.",
    images: ["/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing"],
  },
};

// Server-rendered SEO content that Google can read without JavaScript.
function ServerSEOContent() {
  return (
    <div className="sr-only" aria-hidden="true">
      <h2>Smile Fotilo - Web Design and Digital Marketing Agency</h2>
      <p>
        Smile Fotilo is a premium creative agency specializing in Web Design,
        Branding, and Digital Marketing. We build world-class digital experiences
        for global brands. Custom websites starting at INR 15,999 with 2-3 week delivery.
      </p>
      <h2>Our Services</h2>
      <ul>
        <li>Web Development - Fast, secure, and SEO-optimized websites on WordPress and custom stacks</li>
        <li>Digital Growth - Data-driven SEO and Google Ads strategies that bring customers</li>
        <li>Creative Studio - High-end product photography and brand identity design</li>
        <li>Growth Autopilot - Clinic-first missed-call followups, reminders, reviews, and bilingual patient workflows</li>
        <li>24/7 Support - Dedicated support team to help you grow your business</li>
      </ul>
      <h2>Pricing</h2>
      <ul>
        <li>The Starter - INR 15,000 per project, for doctors, clinics, or small shops</li>
        <li>The Growth - INR 35,000+ starting, for retail brands ready to sell online</li>
        <li>The Domination - Custom pricing, full stack solution</li>
      </ul>
      <h2>Frequently Asked Questions</h2>
      <dl>
        <dt>What services does Smile Fotilo offer?</dt>
        <dd>
          We offer Web Design and Development, Digital Marketing and SEO, Brand
          Identity Design, Product Photography, and Growth Autopilot services.
        </dd>
        <dt>How much does a website cost?</dt>
        <dd>
          Our website packages start from INR 15,999. We offer The Starter (INR 15k)
          for small businesses, The Growth (INR 35k+) for retail brands, and custom
          enterprise solutions.
        </dd>
        <dt>How long does it take to build a website?</dt>
        <dd>
          Typical websites take 2-4 weeks from concept to launch. Complex projects
          with custom features may take 4-8 weeks.
        </dd>
        <dt>Do you work with international clients?</dt>
        <dd>Yes. We serve enterprise clients in Texas (USA), Mexico, and across India.</dd>
        <dt>What support do you provide after launch?</dt>
        <dd>
          We provide 24/7 dedicated support including website maintenance, security
          updates, performance optimization, and ongoing SEO improvements.
        </dd>
        <dt>Do you offer AI automation services?</dt>
        <dd>
          Yes. Our Growth Autopilot helps clinics automate followups, reminders,
          reviews, and patient inquiry workflows.
        </dd>
      </dl>
      <h2>Locations</h2>
      <p>
        Serving clients in Gonda (HQ), Lucknow, Greater Noida, Ayodhya, Texas (USA),
        and Mexico City.
      </p>
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
