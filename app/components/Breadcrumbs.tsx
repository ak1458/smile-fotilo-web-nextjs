'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdChevronRight } from 'react-icons/md';

export const Breadcrumbs = () => {
    const pathname = usePathname();

    // Don't render breadcrumbs on home page
    if (pathname === '/') return null;

    // Generate paths
    const pathSegments = pathname.split('/').filter(p => p !== '');

    const breadcrumbs = pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
        // Format the segment to be readable (e.g., "web-design" -> "Web Design")
        let label = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        // Handle specific route names better if needed
        if (segment.toLowerCase() === 'seo') label = 'SEO';

        return { label, url };
    });

    // Add Home as the first item
    const allBreadcrumbs = [{ label: 'Home', url: '/' }, ...breadcrumbs];

    // Generate JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": allBreadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.label,
            "item": `https://smilefotilo.com${crumb.url}`
        }))
    };

    return (
        <>
            {/* JSON-LD Script for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Visual Breadcrumb UI */}
            <nav className="sf-breadcrumbs flex items-center text-sm font-medium text-slate-400 mb-8 pt-4 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                <ol className="flex items-center space-x-2">
                    {allBreadcrumbs.map((crumb, index) => {
                        const isLast = index === allBreadcrumbs.length - 1;

                        return (
                            <li key={crumb.url} className="flex items-center">
                                {index > 0 && <MdChevronRight className="mx-2 text-slate-600 shrink-0" />}
                                {isLast ? (
                                    <span className="text-white" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.url}
                                        className="hover:text-white transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
};
