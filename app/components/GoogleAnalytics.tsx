'use client';

import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NXSPSN27';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-9ZS27TJ3ZJ';

export function GoogleAnalytics() {
    return <NextGoogleAnalytics gaId={GA_MEASUREMENT_ID} />;
}

export function GTMNoScript() {
    return (
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
            />
        </noscript>
    );
}
