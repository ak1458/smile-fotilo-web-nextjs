import { ProjectDetailClient } from './ProjectDetailClient';

// Required for static export with dynamic routes
export function generateStaticParams() {
    return [
        { slug: 'pulsekart' },
        { slug: 'kapda-factory' },
        { slug: 'orderflow' },
        { slug: 'curbit' },
        { slug: 'veloria-vault' },
    ];
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
    return <ProjectDetailClient slug={params.slug} />;
}
