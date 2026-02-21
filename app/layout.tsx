import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { JsonLd } from "./components/JsonLd";
import { NavBar } from "./components/NavBar";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { FestivalProvider } from "./components/FestivalProvider";
import { ChatSupportWrapper } from "./components/ChatSupportWrapper";
import { GoogleAnalytics, GTMNoScript } from "./components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smilefotilo.com'),
  title: {
    default: "Smile Fotilo | Web Design & Digital Marketing in Gonda, Lucknow & Global",
    template: "%s | Smile Fotilo",
  },
  description: "Smile Fotilo: Premium Web Design, Branding & Digital Marketing agency. Serving Gonda, Lucknow, and global clients with world-class digital experiences.",
  keywords: ["Web Design", "Digital Marketing", "Branding", "Gonda", "Lucknow", "Greater Noida", "Ayodhya", "Website Development", "SEO", "Creative Agency", "Web Design Gonda", "SEO Lucknow", "Website Developer India"],
  authors: [{ name: "Ashraf Kamal" }],
  creator: "Smile Fotilo",
  publisher: "Smile Fotilo",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  // Uncomment and add your Google Search Console verification code:
  // verification: {
  //   google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
  // },
  openGraph: {
    title: "Smile Fotilo | World-Class Digital Experiences",
    description: "We build beautiful, high-performance websites and brands. Based in India, serving the world.",
    url: "https://smilefotilo.com",
    siteName: "Smile Fotilo",
    images: [
      {
        url: "/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing",
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
    images: ["/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing"],
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0&display=optional" />
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GTMNoScript />
        <FestivalProvider>
          <NavBar />
          <JsonLd />
          {children}
          <ChatSupportWrapper />
          <MobileBottomNav />
        </FestivalProvider>
      </body>
    </html>
  );
}
