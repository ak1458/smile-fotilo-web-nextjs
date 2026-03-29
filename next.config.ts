import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://pagead2.googlesyndication.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.groq.com https://generativelanguage.googleapis.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://region1.google-analytics.com",
      "frame-src 'self' https://www.google.com",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'"
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.smilefotilo.com' }],
        destination: 'https://smilefotilo.com/:path*',
        permanent: true,
      },
      // Backward compatibility for previously-referenced share image.
      {
        source: '/og-image.jpg',
        destination:
          '/og?title=Smile%20Fotilo&subtitle=Web%20Design%2C%20Branding%20%26%20Digital%20Marketing',
        permanent: true,
      },
      // Some crawlers/browsers request /favicon.ico by default.
      {
        source: '/favicon.ico',
        destination: '/icon.png',
        permanent: true,
      },

      // ============================================================
      // WordPress → Next.js Migration Redirects (Feb 2026)
      // These old WP URLs are still indexed in GSC. 301 redirects
      // tell Google the site has migrated and transfer ranking juice.
      // ============================================================
      {
        source: '/contact',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/hire-developer',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/hire-developer/',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/our-team',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/our-team/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/software-developmet',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/software-developmet/',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/web-development',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/web-development/',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/lucknow-seo-expert',
        destination: '/locations/lucknow',
        permanent: true,
      },
      {
        source: '/lucknow-seo-expert/',
        destination: '/locations/lucknow',
        permanent: true,
      },
      {
        source: '/dmca',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/dmca/',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/sitemap/',
        destination: '/sitemap.xml',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions/',
        destination: '/terms',
        permanent: true,
      },
      // New Legacy Fixes from Mar 2026 API Scan
      {
        source: '/app-development/',
        destination: '/services/web-design',
        permanent: true,
      },
      {
        source: '/graphics-design/',
        destination: '/services/branding',
        permanent: true,
      },
      {
        source: '/our-blogs/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/privacy-policy/',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/author/:path*',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/top-search-engines-for-pentesters-a-guide-to-penetration-testing-tools/',
        destination: '/blog/on-page-seo-checklist-2026',
        permanent: true,
      },
      // Old WordPress tag/category pages -> blog
      {
        source: '/tag/:slug*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/:slug*',
        destination: '/blog',
        permanent: true,
      },
      // Old WordPress blog post format
      {
        source: '/top-5-tools-for-seo-success-in-2024',
        destination: '/blog/on-page-seo-checklist-2026',
        permanent: true,
      },
      {
        source: '/top-5-tools-for-seo-success-in-2024/',
        destination: '/blog/on-page-seo-checklist-2026',
        permanent: true,
      },
      // General Legacy URL fallbacks (Mar 2026)
      {
        source: '/:slug*.html',
        destination: '/:slug*',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
    ];
  },

  // Disable x-powered-by header to reduce fingerprinting
  poweredByHeader: false,
};

export default nextConfig;
