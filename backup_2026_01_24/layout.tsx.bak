import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "./components/JsonLd";
import { NavBar } from "./components/NavBar";
import { ChatSupport } from "./components/ChatSupport";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { FestivalProvider } from "./components/FestivalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smile Fotilo | Web Design & Digital Marketing in Gonda, Lucknow & Global",
  description: "Smile Fotilo is a premium creative agency specializing in Web Design, Branding, and Digital Marketing. Serving clients in Gonda, Greater Noida, Lucknow, Ayodhya, and globally.",
  keywords: ["Web Design", "Digital Marketing", "Branding", "Gonda", "Lucknow", "Greater Noida", "Ayodhya", "Website Development", "SEO", "Creative Agency"],
  authors: [{ name: "Ashraf Kamal" }],
  creator: "Smile Fotilo",
  publisher: "Smile Fotilo",
  openGraph: {
    title: "Smile Fotilo | World-Class Digital Experiences",
    description: "We build beautiful, high-performance websites and brands. Based in India, serving the world.",
    url: "https://smilefotilo.com",
    siteName: "Smile Fotilo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smile Fotilo Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smile Fotilo | Creative Agency",
    description: "Transforming brands with stunning web design and digital strategy.",
    creator: "@ashrafkamal14",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://smilefotilo.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <FestivalProvider>
          <NavBar />
          <JsonLd />
          {children}
          <ChatSupport />
          <MobileBottomNav />
        </FestivalProvider>
      </body>
    </html>
  );
}

