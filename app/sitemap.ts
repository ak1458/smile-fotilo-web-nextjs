import { MetadataRoute } from 'next';
import { blogPosts, getAllCategories, categoryToSlug } from './data/blogPosts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://smilefotilo.com';
    // Stable lastmod for static pages. Bump this date only when the pages actually
    // change — do NOT use `new Date()` (it faked "changed today" on every build,
    // a freshness signal Google learns to ignore).
    const lastUpdated = new Date('2026-06-01T00:00:00Z');

    // Generate blog post URLs
    const blogUrls = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Category hubs — one crawlable URL per topic cluster.
    const categoryUrls = getAllCategories().map((category) => ({
        url: `${baseUrl}/blog/category/${categoryToSlug(category)}`,
        lastModified: lastUpdated,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        // Blog main page
        {
            url: `${baseUrl}/blog`,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        // All blog posts
        ...blogUrls,
        // Category hubs
        ...categoryUrls,
        // Main Pages
        {
            url: baseUrl,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: lastUpdated,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: lastUpdated,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // Services - SEO Authority Pages
        {
            url: `${baseUrl}/services/web-design`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/seo`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/branding`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/ai-growth-os`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/clinic-growth-autopilot`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        // Work / Portfolio
        {
            url: `${baseUrl}/work`,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/work/pulsekart`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/work/kapda-factory`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/work/orderflow`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/work/storybook-weddings`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/work/curbit`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/work/veloria-vault`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Locations
        {
            url: `${baseUrl}/locations`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/locations/gonda`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/locations/lucknow`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/locations/noida`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/locations/greater-noida`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/locations/ayodhya`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/locations/global`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        // Tools Pages
        {
            url: `${baseUrl}/tools`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tools/website-audit`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // (Phase 3: seo-content, brand-kit, content-calendar, document-intelligence,
        //  website-factory tools + marketplace removed from sitemap — noindexed/simplified)
        // Portfolio
        {
            url: `${baseUrl}/portfolio`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];
}

