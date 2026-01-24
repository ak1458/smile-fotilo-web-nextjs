import { ProjectDetailClient } from './ProjectDetailClient';

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
