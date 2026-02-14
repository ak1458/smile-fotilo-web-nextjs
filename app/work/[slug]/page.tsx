import { ProjectDetailClient } from './ProjectDetailClient';
import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const dynamicParams = false;

const projectMeta: Record<
    string,
    {
        title: string;
        description: string;
    }
> = {
    pulsekart: {
        title: 'PulseKart',
        description:
            'Enterprise-grade Point of Sale with inventory management, billing, and prescription tracking for pharmacies.',
    },
    'kapda-factory': {
        title: 'Kapda Factory',
        description:
            'End-to-end textile manufacturing solution including WordPress e-commerce. Tracks order loading, payment collections, and shipment status in real-time.',
    },
    orderflow: {
        title: 'OrderFlow',
        description:
            'Daily order tracking and collection ecosystem with mobile app and Android tablet dashboard for delivery hubs.',
    },
    curbit: {
        title: 'Curbit',
        description:
            'Website for a US-based company providing curb-related services. Clean, professional, and enterprise-grade.',
    },
    'veloria-vault': {
        title: 'Veloria Vault',
        description:
            "Premium WordPress store for a luxury leather handbag brand with immersive product storytelling.",
    },
    'storybook-weddings': {
        title: 'StoryBook Weddings',
        description:
            "Professional website for Lucknow's premier wedding photography studio. Beautiful portfolio showcasing engagement, haldi, pre-wedding, and wedding ceremonies.",
    },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = projectMeta[slug];
    if (!project) {
        return {
            title: 'Project Not Found | Smile Fotilo',
            robots: { index: false, follow: false },
        };
    }

    const title = `${project.title} Case Study | Smile Fotilo`;
    const description = project.description;
    const canonical = `/work/${slug}`;
    const ogImage = `/og?title=${encodeURIComponent(project.title)}&subtitle=Case%20Study`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    };
}

// Required for static export with dynamic routes
export function generateStaticParams() {
    return [
        { slug: 'pulsekart' },
        { slug: 'kapda-factory' },
        { slug: 'orderflow' },
        { slug: 'curbit' },
        { slug: 'veloria-vault' },
        { slug: 'storybook-weddings' },
    ];
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = (await params);
    return <ProjectDetailClient slug={slug} />;
}
